import React from 'react'
import { FlatList, ActivityIndicator, View, TouchableHighlightBase } from 'react-native'
import Style, { COLORS, SPACE } from '../theme'
import { SubmissionCard, IconButton } from '../components'
import InitClient from '../init_client'

export default class Feed extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      page: 1,
      loadingMore: false,
      refreshing: true
    }
  }

  componentDidMount() {
    this.refresh()
    this.props.navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="refresh"
          style={{
            marginRight: SPACE(1)
          }}
          onPress={() => this.refresh()}
        />
      )
    })
  }

  refresh() {
    if (this._client) {
      this._client.feeds.frontpage().then(frontpage => {
        this.setState({
          posts: frontpage.posts,
          refreshing: false
        })
      })
    }
    else {
      InitClient().then(client => {
        this._client = client
        this.refresh()
      })
    }

    this.setState({
      refreshing: true
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
    return (
      <View style={{
        ...Style.view,
        paddingBottom: 0,
        paddingTop: 0
      }}>
        <FlatList
          data={this.state.posts}
          renderItem={props => <SubmissionCard post={props.item}/>}
          onEndReached={() => this.getMore()}
          onEndReachedThreshold={0}
          initialNumToRender={26}
          onRefresh={() => this.refresh()}
          refreshing={this.state.refreshing}
          style={{
            paddingTop: SPACE(1)
          }}
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
}