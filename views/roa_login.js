import React from 'react'
import { View, Text, Linking, ScrollView, ActivityIndicator } from 'react-native'
import Style, { BODYTEXT, COLORS, FONTSIZE, SPACE } from '../theme'
import { LinkText } from '../components/LinkText'
import { Button, IconButton } from '../components/Buttons'
import { WebView } from 'react-native-webview';
import Collection, { Value } from '../asyncstorage'
import InitClient from '../init_client'

const CAPTURE_TOKENS = `
window.ReactNativeWebView.postMessage(document.body.innerText)
// window.addEventListener('load', () => {
//   window.ReactNativeWebView.postMessage(document.body.innerText)
// })
`
export default class ROALogin extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      sites: [],
      connectTo: '',
      connecting: false,
      loggingIn: false
    }

    this.webview = React.createRef()
    this.tokenLock = false
  }

  componentDidMount() {
    this.accounts = new Collection('accounts')
    this.servers = new Collection('servers')

    this.setState({fetchingServers: true}, () => {
      fetch('https://sfroa.danhab99.xyz/sites')
        .then(d => d.text())
        .then(sites => {
          try {
            sites = JSON.parse(sites)
          }
          catch(e) {}

          console.log('AUTH SERVER SITES', sites)

          this.setState({
            fetchingServers: false
          })

          return sites
        })
        .then(sites => Promise.all(
          sites.map(site => {
            return this.servers.findOne({_id: site._id}).then(server => {
              return server ? server : this.servers.create(site)
            })
          })
        ))
        .then(servers => Promise.all(
          servers.map(server => this.accounts.find({serverID: server._id}).then(accounts => {
            server.accounts = accounts
            return server
          }))
        ))
        .then(sites => this.setState({sites}))
    })
  }

  connectAccount(id) {
    fetch(`https://sfroa.danhab99.xyz/auth/${id}?state=${id}`, {
      redirect: 'manual'
    }).then(({url}) => {
      this.setState({
        connecting: this.state.sites.find(x => x._id == id),
        connectTo: url
      })
    })
  }

  catchTokens(msg) {
    console.log('WEBVIEW', msg)
    let data = msg.nativeEvent.data

    if (!this.tokenLock) {
      try {
        data = JSON.parse(data)
  
        if (data['access_token']) {
          console.log('TOKENS', data)
          this.tokenLock = true
          let connecting = this.state.connecting

          this.setState({
            connecting: false,
            loggingIn: true
          })
  
          InitClient({
            ...connecting,
            id: connecting._id,
            auth_domain: `sfroa.danhab99.xyz`,
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }).then(client => {
            this.accounts.create({
              serverID: connecting._id,
              username: client.user.username,
              keys: {
                access: data.access_token,
                refresh: data.refresh_token
              }
            })
            this.setState({loggingIn: false})
            this.tokenLock = false
            this.componentDidMount()
          })
        }
      }
      catch (e) {}
    }
  }

  deleteAccount(id) {
    this.accounts.delete({_id: id})
    this.componentDidMount()
  }

  useAccount(id) {
    console.log('Using account', id)
    Value.setValue('activeAccount', id).then(() => {
      this.props.navigation.replace('Frontpage')
      this.props.navigation.navigate('Frontpage')
    })
  }

  render() {
    if (this.state.connecting) {
      return <WebView
        ref={this.webview}
        source={{uri: this.state.connectTo}}
        injectedJavaScript={CAPTURE_TOKENS}
        injectJavaScript={CAPTURE_TOKENS}
        onMessage={msg => this.catchTokens(msg)}
        onNavigationStateChange={() => {
          this.webview.current.injectJavaScript(CAPTURE_TOKENS)
        }}
        renderLoading={() => <ActivityIndicator size="large" color={COLORS.primary} />}
        startInLoadingState={true}
      />
    }
    else if (this.state.fetchingServers) {
      return <View style={Style.view}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    }
    else if (!this.state.fetchingServers && this.state.site?.length <= 0) {
      return <View>
        <Text style={{...BODYTEXT, fontSize: FONTSIZE(2)}}>
          Error: No sites have been retrieved
        </Text>

        <Button
          text="Try again"
          onPress={() => this.componentDidMount()}
        />
      </View>
    }
    else {
      return (<ScrollView style={Style.view}>
        {this.state.loggingIn ? <View>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View> : null}

        {this.state.sites.map((site, i) => <View key={`${i}`} style={Style.card}>
          <Text style={{
            color: COLORS.text,
            fontSize: FONTSIZE(2),
            fontWeight: 'bold'
          }}>
            {site.domain}
          </Text>

          <View>
            {(site.accounts || []).map((account, i) => <View 
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
                onPress={() => this.useAccount(account._id)}
              />

              <IconButton 
                icon="delete" 
                onPress={() => this.deleteAccount(account._id)}
              />
            </View>)}
          </View>
  
          <Button
            text="Connect an account"
            onPress={() => this.connectAccount(site._id)}
            style={{
              marginTop: SPACE(1)
            }}
          /> 
        </View>)}
      </ScrollView>)
    }
  }
}