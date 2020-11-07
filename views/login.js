import React from 'react'
import { View, Text, Image } from 'react-native'
import Style, { COLORS, FONTS, FONTSIZE, SPACE } from '../theme'
import { Input, LinkText, Button } from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    AsyncStorage.getItem('servers', servers => this.setState({
      servers: JSON.parse(servers) || []
    }))
  }

  saveServer() {
    this.setState(
      prev => ({servers: prev.servers.concat([this.state.newServer])}),
      () => AsyncStorage.setItem('servers', JSON.stringify(this.state.servers))
    )
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
            Until somebody implements proper <LinkText url="https://oauth.net/2/grant-types/implicit/">implicit OAuth</LinkText>, please tap <LinkText url="https://ruqqus.com/settings/apps">here</LinkText> to apply for app keys so you can login.
          </Text>
         
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

          <Input 
            label="Domain"
            onChangeText={this.onChangeServer('domain')}
            autoCompleteType="off"
            autoCapitalize="none"
            value={this.state.newServer.domain}
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
              flexDirection: 'row'
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
            </View>
            

            <Text style={{
              color: COLORS.text,
            }}>
              {server.clientID}
            </Text>

            <Button
              text="Connect account"
            />
          </View>)
        })}
      </View>
    )
  }
}