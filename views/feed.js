import React from 'react'
import { FlatList, ActivityIndicator, View, Image, Text, Vibration, RefreshControl } from 'react-native'
import Style, { COLORS, Darken, FONTSIZE, Lighten, SPACE } from '../theme'
import Postcard from '../components/Postcard'
import { IconButton, Button } from '../components/Buttons'
import Popup, { PopupButton } from '../components/Popup'
import HtmlMarkdown from '../components/HtmlMarkdown'
import Input from '../components/Input'
import InitClient from '../init_client'

function GuildHeader(props) {
  if (props.enabled) {
    return (<View
      style={{
        backgroundColor: COLORS.background,
        marginBottom: SPACE(1.5)
      }}
    >
      <Image
        source={{uri: props.guild.banner_url}}
        style={{
          width: '100%',
          aspectRatio: 3.4092307692307693
        }}
      />
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}>
        <Image
          source={{uri: props.guild.icon_url}}
          style={{
            width: 64,
            aspectRatio: 1,
            borderRadius: 100,
            margin: SPACE(1)
          }}
        />
        <View style={{margin: SPACE(1)}}>
          <Text style={{
            color: COLORS.text,
            fontSize: FONTSIZE(4/3),
            fontWeight: 'bold',
          }}>+{props.guild.name}</Text>
          <Text style={{
            color: COLORS.text,
            flexShrink: 1
          }}>{props.guild.subscribers} subscribers</Text>
        </View>
      </View>
      <Button text="Subscribe"/>
      <HtmlMarkdown html={props.guild?.description?.html} />
    </View>)
  }
  else {
    return <View></View>
  }
}

export default class Feed extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      page: 1,
      loadingMore: false,
      refreshing: true,
      sortingVisible: false,
      searchVisible: false,
      sorting: 'hot',
      guildHeader: this.props.route.params.guildHeader || false,
      guild: {
        icon_url: '',
        name: '',
        color: '',
        subscribers: -1,
        banner_url: '',
        description: {
          html: ''
        }
      },
      searchVal: ''
    }

    this.flatlist = React.createRef()
  }

  componentDidMount() {
    this.refresh()
    this.props.navigation.setOptions({
      title: `${this.props.route.params.prefix || ''}${this.props.route.name}`,
      headerRight: () => (
        <View style={{
          display: 'flex',
          flexDirection: 'row-reverse'
        }}>
          <IconButton
            icon="refresh"
            style={{
              marginRight: SPACE(1.3)
            }}
            onPress={() => this.refresh()}
            onLongPress={() => this.getMore()}
            
          />

          <IconButton
            icon="sort"
            style={{
              marginRight: SPACE(1.1)
            }}
            onPress={() => this.toggleSorting()}
          />

          <IconButton
            icon="search"
            style={{
              marginRight: SPACE(1.1)
            }}
            onPress={() => this.toggleSearch()}
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

      if (this.props.route.params.guildHeader) {
        this._client.guilds.fetch(this.props.route.params.name).then(guild => {
          console.log('GUILD HEADER', guild)
          this.setState({guild}, () => {
            this.props.navigation.setOptions({
              title: `+${this.state.guild.name}`,
            })
          })
        })
      }
    }
    else {
      InitClient().then(client => {
        this._client = client
        this.refresh()
      }).catch(() => {
        this.props.navigation.navigate("Login")
      })
    }

    this.setState({
      refreshing: true
    })
  }

  getMore() {
    if (this.state.posts.length > 1 && !this.state.loadingMore) {
      Vibration.vibrate(100)
      this.setState(prev => ({
        page: prev.page + 1,
        loadingMore: true,
        refreshing: true
      }),
      () => {
        this.flatlist.current.scrollToEnd({
          animated: true
        })
  
        this.fetch().then(more => {
          this.setState((prev) => ({
            posts: prev.posts.concat(more.posts),
            loadingMore: false,
            refreshing: false
          }))
        }).catch(e => console.error('CANNOT GET MORE', e))
      })
    }
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

  toggleSearch() {
    this.setState(prev => ({searchVisible: !prev.searchVisible}))
  }

  search() {
    let screen = {
      '+': 'Guild',
      '@': 'User'
    }[this.state.searchVal[0]]
    this.props.navigation.navigate(screen, {
      name: this.state.searchVal.substring(1, this.state.searchVal.length),
      prefix: this.state.searchVal[0]
    })
    this.setState({searchVisible: false})
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
            onPress={() => this.setSorting('disputed')}
          />
          
          <PopupButton
            label="Activity"
            icon="chat"
            onPress={() => this.setSorting('activity')}
          />
        </Popup>

        <Popup
          visible={this.state.searchVisible}
          title="Go To"
          togglModal={() => this.toggleSearch()}
        >
          <Input 
            label="+guild or @user"
            onChangeText={t => this.setState(prev => ({searchVal: t}))}
            autoCompleteType="off"
            autoCapitalize="none"
            value={this.state.searchVal}
          />

          <Button
            disabled={!(this.state.searchVal[0] == '+' || this.state.searchVal[0] == '@')}
            text="Go to"
            style={{
              marginTop: SPACE(1)
            }}
            onPress={() => this.search()}
          />
        </Popup>

        <FlatList
          ref={this.flatlist}
          data={this.state.posts}
          renderItem={props => <Postcard post={props.item} navigation={this.props.navigation}/>}
          onEndReached={() => this.getMore()}
          onEndReachedThreshold={1}
          initialNumToRender={26}
          ListHeaderComponent={<GuildHeader guild={this.state.guild} enabled={this.state.guildHeader} />}
          ListFooterComponent={<View>
            {this.state.loadingMore 
            ? <View /* style={{position: 'absolute', bottom: 0, width: '100%'}} */>
                <ActivityIndicator 
                  size="large" 
                  color={COLORS.primary}
                />
              </View> 
            : null}
          </View>}
          style={{
            paddingTop: this.state.guildHeader ? 0 : SPACE(1)
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl 
            refreshing={this.state.refreshing}
            onRefresh={() => this.refresh()}
            title="Pull to refresh"
            colors={[COLORS.primary, Lighten(COLORS.primary), Darken(COLORS.primary)]}
          />}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    )
  }
}