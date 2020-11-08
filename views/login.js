import React from 'react'
import { View, Text, Image, Linking } from 'react-native'
import Style, { COLORS, FONTS, FONTSIZE, SPACE } from '../theme'
import { Input, LinkText, Button, IconButton } from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuthURL, Client } from 'ruqqus-js'
import * as Url from 'url'

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newServer: {
        clientID: '',
        clientSecret: '',
        domain: ''
      },
      servers: []
    }

    this.onChangeServer = this.onChangeServer.bind(this)
    this.catchTokens = this.catchTokens.bind(this)
  }

  onChangeServer(key) {
    return value => {
      this.setState(prev => ({
        newServer: {
          ...prev.newServer,
          [key]: value
        }
      }))
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('servers', (err, servers) => this.setState({
      servers: JSON.parse(servers) || []
    }))
  }

  componentDidUpdate() {
    console.log('Saving servers')
    AsyncStorage.setItem('servers', JSON.stringify(this.state.servers))
  }

  saveServer() {
    this.setState(prev => ({
      servers: prev.servers.concat([this.state.newServer]),
      newServer: {
        clientID: '',
        clientSecret: '',
        domain: ''
      }
    }))
  }

  deleteServer(key) {
    this.setState(prev => {
      prev.servers.splice(key, 1)
      return {
        servers: prev.servers
      }
    })
  }

  catchTokens({ url }) {
    let u = Url.parse(url, true)
    console.log('TOKENS', u)
    u.query.state = JSON.parse(u.query.state)

    if (u.query.state.confirm == this.confirmToken) {
      let server = this.state.servers[u.query.state.key]

      const client = new Ruqqus.Client({
        id: server.clientID,
        token: server.clientSecret,
        code: u.query.code
      });

      this.setState(prev => {
        prev.servers[u.query.state.key].code = u.query.code
        return {
          servers: prev.servers
        }
      })
    }
    else {
      throw new Error('Bad confirm token')
    }
  }

  async connectAccount(key) {
    this.listener = Linking.addEventListener('url', this.catchTokens)
    this.confirmToken = Math.random().toString(36).substring(2, 15)

    let returnUrl = await Linking.getInitialURL()

    console.log('RETURN URL', returnUrl)

    let server = this.state.servers[key]
   
    let authUrl = getAuthURL({
      id: server.clientID,
      redirect: `${returnUrl}`,
      state: JSON.stringify({
        confirm: this.confirmToken,
        key
      }),
      scopes: "identity,create,read,update,delete,vote,guildmaster",
      permanent: true,
      domain: server.domain
    })

    if (await Linking.canOpenURL(authUrl)) {
      console.log('OPENING URL', authUrl)
      Linking.openURL(authUrl)
    }
    else {
      throw new Error('Cannot open auth link')
    }
  }

  render() {
    return (
      <View style={Style.view}>
        <View style={Style.card}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: FONTSIZE(3)
            }}
          >
            Add New Server
          </Text>

          <Text style={{color: COLORS.text}}>
            Until somebody implements proper <LinkText url="https://oauth.net/2/grant-types/implicit/">implicit OAuth</LinkText>, you're going to have to apply for app keys with your ruqqus-compatible server admins. Type in the domain first to get a link to your app setting page.
          </Text>

          <Input 
            label="Domain"
            onChangeText={this.onChangeServer('domain')}
            autoCompleteType="off"
            autoCapitalize="none"
            value={this.state.newServer.domain}
          />

          {this.state.newServer.domain
          ? <Text style={{color: COLORS.text}}>Please tap <LinkText url={`https://${this.state.newServer.domain}/settings/apps`}>here</LinkText> to apply for the client ID and client secret</Text>
          : null}
         
          <Input 
            label="Client ID"
            onChangeText={this.onChangeServer('clientID')}
            autoCompleteType="off"
            autoCapitalize="none"
            value={this.state.newServer.clientID}
          />

          <Input 
            label="Client Secret"
            onChangeText={this.onChangeServer('clientSecret')}
            autoCompleteType="off"
            autoCapitalize="none"
            value={this.state.newServer.clientSecret}
          />

          <Button
            text="Save"
            onPress={() => this.saveServer()}
          />
        </View>

        {this.state.servers.map((server, i) => {
          return (
          <View key={`${i}`} style={{
            ...Style.card,
            marginTop: SPACE(2)
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  marginRight: SPACE(0.2)
                }}
                source={{
                  uri: `https://${server.domain}/assets/images/logo/favicon.png`
                }}
              />

              <Text style={{
                color: COLORS.text,
                fontSize: FONTSIZE(2),
                justifyContent: 'center'
              }}>
                {server.domain}
              </Text>

              <IconButton 
                icon="delete" 
                onPress={() => this.deleteServer(i)}
              />
            </View>
            

            <Text style={{
              color: COLORS.text,
            }}>
              <Text style={{color: COLORS.muted}}>Client ID:</Text> {server.clientID}
            </Text>

            <Button
              text="Connect account"
              onPress={() => this.connectAccount(i)}
            />
          </View>)
        })}
      </View>
    )
  }
}