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
      servers: [],
      error: ''
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
        this.setState(prev => {
          accounts.forEach(account => {
            for (let i in prev.servers) {
              if (account.serverID == prev.servers[i]._id) {
                if (!prev.servers[i].accounts) {
                  prev.servers[i].accounts = []
                }
                prev.servers[i].accounts.push(account)
              }
            }
          })

          return prev.servers
        })
      })
    })
  }

  displayError(error) {
    this.setState({
      error
    }, () => {
      setTimeout(() => {
        this.setState({error: ''})
      }, 3000)
    })
  }

  saveServer() {
    if (this.state.newServer.clientID !== '' && this.state.newServer.clientSecret !== '' && this.state.newServer.domain !==  '') {
      this._servers.create(this.state.newServer)

      this.setState({
        newServer: {
          clientID: '',
          clientSecret: '',
          domain: 'ruqqus.com'
        }
      })
    }
    else {
      this.displayError("Please fill out the domain, client ID, and client secret")
    }
  }

  deleteServer(id) {
    this._servers.delete({_id: id})
  }

  async catchTokens({ url }) {
    let u = Url.parse(url, true)
    console.log('TOKENS', u)
    let serverID = u.query.state
    let server = await this._servers.findById(serverID)

    const client = new Client({
      id: server.clientID,
      token: server.clientSecret,
      code: u.query.code,
      domain: server.domain
    });

    Promise.all([
      new Promise(resolve => {
        client.on("login", () => {
          console.log('Logged in')
          resolve()
        })
      }),
      new Promise(resolve => {
        client.on('refresh', () => {
          console.log('Refreshed tokens')
          resolve()
        })
      })
    ]).then(() => {
      this._accounts.create({
        serverID,
        username: client.user.username,
        keys: {
          access: client.keys.refresh.access_token,
          refresh: client.keys.refresh.refresh_token
        }
      })
      console.log("Saved user named", client.user.username)
    })
  }

  async connectAccount(id) {
    this.listener = Linking.addEventListener('url', this.catchTokens)
    let returnUrl = await Linking.getInitialURL()
    console.log('RETURN URL', returnUrl)
    let server = await this._servers.findById(id)
    
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
      this.displayError(`Cannot open ${server.domain}`)
    }
  }

  deleteAccount(id) {
    this._accounts.delete({_id: id})
  }

  render() {
    return (
      <ScrollView style={Style.view}>
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
            style={{
              marginTop: SPACE(1)
            }}
          />

          {this.state.error !== ''
            ? <Text style={{
                color: COLORS.text,
                backgroundColor: 'rgba(255,0,0,0.5)',
                marginTop: SPACE(0.5),
                borderRadius: 10,
                borderColor: 'red',
                borderWidth: 2,
                padding: SPACE(0.5)
              }}>
                {this.state.error}
              </Text>
            : null}
        </View>
        
        <View>
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
                style={{
                  marginTop: SPACE(1)
                }}
              />

              <View>
                {(server.accounts || []).map((account, i) => <View 
                  key={`${i}`}
                  style={{
                    marginTop: SPACE(1),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    alignItems: 'center',
                    
                  }}
                >
                  <Text style={{
                    color: COLORS.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    margin: 'auto',
                    alignContent: 'center',
                    fontSize: FONTSIZE(1.5),
                    marginRight: SPACE(1)
                  }}>
                    @{account.username}
                  </Text>

                  <Button 
                    text="Login"
                    style={{
                      marginRight: SPACE(1)
                    }}
                  />

                  <IconButton 
                    icon="delete" 
                    onPress={() => this.deleteAccount(account._id)}
                  />
                </View>)}
              </View>
            </View>)
          })}
        </View>
      </ScrollView>
    )
  }
}