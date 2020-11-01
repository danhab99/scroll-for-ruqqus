import React from 'react'
import { Linking, View, Text } from 'react-native'
import { getAuthURL } from 'ruqqus-js'
import { ClientID } from '../secrets'
import * as Url from 'url'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  catchTokens({ url }) {
    let u = Url(url)
    console.log(u)
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