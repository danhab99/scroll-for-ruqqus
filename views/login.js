import React from 'react'
import { Linking, View, Text } from 'react-native'
import { getAuthURL, Client } from 'ruqqus-js'
import { ClientID, ClientSecret } from '../secrets'
import parse from 'url-parse'

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.catchTokens = this.catchTokens.bind(this)
  }

  async catchTokens({ url }) {
    url = parse(url, true)
    console.log(url)

    if (url.query.state == this.stateToken) {
      console.log('CODE', url.query.code)

      const client = new Client({
        id: ClientID,
        token: ClientSecret,
        code: url.query.code
      })

      setTimeout(async () => {
        debugger
        // let a1 = await client.guilds.isAvailable('ruqqus')
        let a2 = await client.guilds.isAvailable('+ruqqus')

        console.log('IS WORKING', a2)
      }, 3000)
      
    }
    else {
      // Try login procedure again
      this.componentWillUnmount()
      this.componentDidMount()
    }
  }

  async componentDidMount() {
    this.listener = Linking.addEventListener('url', this.catchTokens)
    this.stateToken = Math.random().toString(36).substring(2, 15)

    let returnUrl = await Linking.getInitialURL()

    console.log('RETURN URL', returnUrl)

    let authUrl = getAuthURL({
      id: ClientID,
      redirect: `${returnUrl}`,
      state: this.stateToken,
      scopes: "identity,create,read,update,delete,vote,guildmaster",
      permanent: true
    })

    if (await Linking.canOpenURL(authUrl)) {
      console.log('OPENING URL', authUrl)
      Linking.openURL(authUrl)
    }
    else {
      throw new Error('Cannot open auth link')
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.listener)
  }

  render() {
    return (
      <View>
        <Text style={{color: 'white'}}>Login screen</Text>
      </View>
    )
  }
}