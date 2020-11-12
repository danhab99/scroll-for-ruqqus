import { fromPairs } from 'lodash'
import React from 'react'
import { View, Text, Linking } from 'react-native'
import Style, { COLORS, FONTSIZE, SPACE } from '../theme'
import { LinkText, Button } from '../components'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      sites: []
    }
  }

  componentDidMount() {
    fetch('https://sfroa.danhab99.xyz/sites')
      .then(d => d.text())
      .then(d => {
        try {
          d = JSON.parse(d)
        }
        catch(e) {}
        return d
      })
      .then(sites => {
        console.log('AUTH SERVER SITES', sites)
        this.setState({sites})
      })
  }

  connectAccount(id) {
    fetch(`https://sfroa.danhab99.xyz/auth/${id}?state=${id}`, {
      redirect: 'manual'
    }).then(({url}) => {
        Linking.openURL(url)
      })
  }

  render() {
    return (<View style={Style.view}>
      {this.state.sites.map((site, i) => <View key={`${i}`} style={Style.card}>
        <Text style={{
          color: COLORS.text,
          fontSize: FONTSIZE(2),
          fontWeight: 'bold'
        }}>
          {site.name} <LinkText href={`https://${site.domain}`}>({site.domain})</LinkText>

          <Button
            text="Connect an account"
            onPress={() => this.connectAccount(site._id)}
            style={{
              marginTop: SPACE(1)
            }}
          />
        </Text>
      </View>)}
    </View>)
  }
}