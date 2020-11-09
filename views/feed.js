import React from 'react'
import { ScrollView, ActivityIndicator, View } from 'react-native'
import Style, { COLORS } from '../theme'
import { SubmissionCard } from '../components'
import InitClient from '../init_client'

export default class Feed extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      posts: []
    }
  } 
  componentDidMount() {
    InitClient().then(client => {
      this._client = client

      client.feeds.frontpage().then(frontpage => {
        console.log('CLIENT FRONT PAGE', frontpage)
        this.setState({
          posts: frontpage.posts
        })
      })
    })
  }
  
  render() {
    if (this.state.posts.length > 0) {
      return (
        <ScrollView style={Style.view}>
          {this.state.posts.map((post, i) => <SubmissionCard key={`${i}`} post={post} />)}
        </ScrollView>
      )
    }
    else {
      return <View style={Style.view}>
        <ActivityIndicator size="large" color={COLORS.primary}/>
      </View>
    }
  }
}