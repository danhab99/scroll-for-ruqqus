import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import InitClient from '../init_client'
import Style, { COLORS, SPACE } from '../theme'
import { Input, Button } from '../components'

export default class Submit extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      ready: false,
      submitting: false,
      form: {
        board: '',
        url: '',
        title: '',
        body: ''
      }
    }

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    InitClient().then(client => {
      this._client = client
      this.setState({ready: true})
    }).catch(() => {
      this.props.navigation.navigate("Login")
    })
  }

  onChange(key) {
    return value => {
      this.setState(prev => ({
        form: {
          ...prev.form,
          [key]: value,
        }
      }))
    }
  }

  submit() {
    this.setState({
      submitting: true
    }, () => {
      this._client.submitPost(this.state.form.board, this.state.form.title, this.state.form.url, this.state.form.body).then(post => {
        console.log('SUBMITTED POST', post)
        this.setState({
          submitting: false
        }, () => {
          this.props.navigation.navigate('Comments', {
            post,
            navigation: this.props.navigation
          })
        })
      })
    })
  }

  get disabled() {
    return !(this.state.ready && this.state.form.board !== '' && this.state.form.title !== '' && (this.state.form.body !== '' || this.state.form.url !== ''))
  }

  render() {
    return (<View style={Style.view}>
      <Input 
        label="Board"
        onChangeText={this.onChange('board')}
        autoCompleteType="off"
        autoCapitalize="none"
        value={this.state.form.board}
      />

      <Input 
        label="Title"
        onChangeText={this.onChange('title')}
        value={this.state.form.title}
      />

      <Input 
        label="URL"
        onChangeText={this.onChange('url')}
        autoCompleteType="off"
        autoCapitalize="none"
        value={this.state.form.url}
      />

      <Input 
        label="Body"
        onChangeText={this.onChange('body')}
        value={this.state.form.body}
        multiline
      />

      <Button
        disabled={this.disabled}
        text="Submit"
        style={{
          marginTop: SPACE(1)
        }}
        onPress={() => this.submit()}
      />

      {this.state.submitting 
      ? <ActivityIndicator size="large" color={COLORS.primary} />
      : null}
    </View>)
  }
}