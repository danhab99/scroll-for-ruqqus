import React from 'react'
import { FlatList, ActivityIndicator, View, TouchableHighlightBase } from 'react-native'
import Style, { COLORS } from '../theme'
import { SubmissionCard } from '../components'
import InitClient from '../init_client'

export default class Feed extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      page: 1,
      loadingMore: false
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

  getMore() {
    this.setState(prev => ({
      page: prev.page + 1,
      loadingMore: true
    }),
    () => {
      this._client.feeds.frontpage(this.state.page).then(more => {
        this.setState((prev) => ({
          posts: prev.posts.concat(more.posts),
          loadingMore: false
        }))
      })
    })
  }
  
  render() {
    if (this.state.posts.length > 0) {
      return (
        <View style={{
          ...Style.view,
          paddingBottom: 0
        }}>
          <FlatList
            data={this.state.posts}
            renderItem={props => <SubmissionCard post={props.item}/>}
            onEndReached={() => this.getMore()}
            onEndReachedThreshold={0.5}
            initialNumToRender={26}
          />
          {this.state.loadingMore 
            ? <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <ActivityIndicator 
                  size="large" 
                  color={COLORS.primary}
                />
              </View> 
            : null}
        </View>
      )
    }
    else {
      return <View style={Style.view}>
        <ActivityIndicator size="large" color={COLORS.primary}/>
      </View>
    }
  }
}