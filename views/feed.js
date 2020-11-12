import React from 'react'
import { FlatList, ActivityIndicator, View, Modal } from 'react-native'
import Style, { COLORS, SPACE } from '../theme'
import { SubmissionCard, IconButton, Popup, PopupButton } from '../components'
import InitClient from '../init_client'

export default class Feed extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      page: 1,
      loadingMore: false,
      refreshing: true,
      sortingVisible: false,
      sorting: 'hot'
    }

    this.flatlist = React.createRef()
  }

  componentDidMount() {
    this.refresh()
    this.props.navigation.setOptions({
      title: this.props.route.params.name ? `${this.props.route.params.prefix}${this.props.route.params.name}` : 'Frontpage',
      headerRight: () => (
        <View style={{
          display: 'flex',
          flexDirection: 'row-reverse'
        }}>
          <IconButton
            icon="refresh"
            style={{
              marginRight: SPACE(1)
            }}
            onPress={() => this.refresh()}
            onLongPress={() => this.getMore()}
          />

          <IconButton
            icon="sort"
            style={{
              marginRight: SPACE(1)
            }}
            onPress={() => this.toggleSorting()}
          />
        </View>
      )
    })
  }

  fetch() {
    return this.props.route.params.fetch(this._client, {
      page: this.state.page,
      name: this.props.route.params.name,
      sort: this.state.sorting
    })
  }

  refresh() {
    if (this._client) {
      this.fetch().then(frontpage => {
        try {
          this.flatlist.current.scrollToIndex({
            animated: true,
            index: 0
          })
        }
        catch (e) {}
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
      this.flatlist.current.scrollToEnd({
        animated: true
      })

      this.fetch().then(more => {
        this.setState((prev) => ({
          posts: prev.posts.concat(more.posts),
          loadingMore: false
        }))
      })
    })
  }
  
  toggleSorting() {
    this.setState(prev => ({sortingVisible: !prev.sortingVisible}))
  }

  setSorting(sorting) {
    this.setState({sorting}, () => {
      this.refresh()
      this.toggleSorting()
    })
  }
  
  render() {
    return (
      <View style={{
        ...Style.view,
        paddingBottom: 0,
        paddingTop: 0
      }}>
        <Popup
          title="Sort"
          visible={this.state.sortingVisible}
          togglModal={() => this.toggleSorting()}
        >
          <PopupButton
            label="Hot"
            icon="whatshot"
            onPress={() => this.setSorting('hot')}
          />
          
          <PopupButton
            label="New"
            icon="star"
            onPress={() => this.setSorting('new')}
          />

          <PopupButton
            label="Disputed"
            icon="announcement"
            onPress={() => this.setSorting('dispted')}
          />
          
          <PopupButton
            label="Activity"
            icon="chat"
            onPress={() => this.setSorting('activity')}
          />
        </Popup>

        <FlatList
          ref={this.flatlist}
          data={this.state.posts}
          renderItem={props => <SubmissionCard post={props.item} navigation={this.props.navigation}/>}
          onEndReached={() => this.getMore()}
          onEndReachedThreshold={1}
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