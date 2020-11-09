import React from 'react'
import { View, Text, Image, Linking, ScrollView } from 'react-native'
import Style, { COLORS, FONTS, FONTSIZE, SPACE } from '../theme'
import { Input, LinkText, Button, IconButton } from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuthURL, Client } from 'ruqqus-js'
import * as Url from 'url'
import Collection from '../asyncstorage'

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newServer: {
        clientID: '',
        clientSecret: '',
        domain: 'ruqqus.com'
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
    this._servers = new Collection('servers')
    this._servers.onChange(() => {
      this._servers.find().then(servers => {
        this.setState({servers})
      })
    })

    this._accounts = new Collection('accounts')
    this._accounts.onChange(() => {
      this._accounts.find().then(accounts => {

      })
    })
  }

  saveServer() {
    this._servers.create(this.state.newServer)

    this.setState({
      newServer: {
        clientID: '',
        clientSecret: '',
        domain: 'ruqqus.com'
      }
    })
  }

  deleteServer(id) {
    this._servers.delete({_id: id})
  }

  catchTokens({ url }) {
    let u = Url.parse(url, true)
    console.log('TOKENS', u)
    let serverID = u.query.state

    let server = this._servers

    const client = new Client({
      id: server.clientID,
      token: server.clientSecret,
      code: u.query.code,
      domain: server.domain
    });

    client.on("login", () => {
      console.log(`Logged in!`, client);
      this._accounts.create({

      })
    })    
  }

  async connectAccount(id) {
    this.listener = Linking.addEventListener('url', this.catchTokens)

    let returnUrl = await Linking.getInitialURL()

    console.log('RETURN URL', returnUrl)

    let server = this.state.servers[key]
   
    let authUrl = getAuthURL({
      id: server.clientID,
      redirect: `${returnUrl}`,
      state: id,
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
            Until somebody implements proper <LinkText url="https://oauth.net/2/grant-types/implicit/">implicit OAuth</LinkText>, you're going to have to apply for app keys with your ruqqus-compatible server admins.
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
        
        <ScrollView>
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
                  onPress={() => this.deleteServer(server._id)}
                />
              </View>
              

              <Text style={{
                color: COLORS.text,
              }}>
                <Text style={{color: COLORS.muted}}>Client ID:</Text> {server.clientID}
              </Text>

              <Button
                text="Connect account"
                onPress={() => this.connectAccount(server._id)}
              />
            </View>)
          })}
        </ScrollView>
      </View>
    )
  }
}