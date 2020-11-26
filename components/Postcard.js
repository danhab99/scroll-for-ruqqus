import React from 'react';
import { View, Pressable, Text, Image, Linking, ActivityIndicator, Share } from 'react-native';
import Style, { SPACE, FONTSIZE, COLORS, Lighten, Darken } from '../theme'
import TimeAgo from 'react-native-timeago';
import YoutubePlayer from "react-native-youtube-iframe";
import Collection from '../asyncstorage';
import cherrio from 'react-native-cheerio'
import HtmlMarkdown from './HtmlMarkdown';
import ScaledImage from './ScaledImage';
import { IconButton } from './Buttons';
import Popup, { PopupButton } from './Popup';

function Delimiter(props) {
  return (<View>
    <Text style={{
      color: COLORS.text,
      marginRight: SPACE(0.5),
      marginLeft: SPACE(0.5)
    }}>
      •
    </Text>
  </View>)
}

class BackupThumbnail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: 'https://media.wired.com/photos/5a0201b14834c514857a7ed7/master/pass/1217-WI-APHIST-01.jpg',
      loading: true
    }
  }

  componentDidMount() {
    let url = this.props.content.url
    fetch(url)
      .then(resp => {
        if (resp.ok) {
          if (resp.headers.get('content-type').includes('html')) {
            resp.text().then(html => {
              var $ = cherrio.load(html)
              let l = $('meta[property="og:image"]').attr('content')
              if (l) {
                this.setState({url: l})
                console.log('Url has OG image', url)
              }
              else {
                console.log('Unable to get OG image', url)
              }
              this.setState({loading: false})
            })
          }
          else if (resp.headers.get('content-type').includes('image')) {
            console.log('Url already an image', url)
            this.setState({url, loading: false})
          }
        }
      })
  }

  render() {
    return <View>
      <View>
        {this.state.loading ? <ActivityIndicator 
          size={100} 
          color={COLORS.primary} 
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        /> : null}
        <ScaledImage
          url={this.state.url}
        />
      </View>
    </View>
  }
}

function SubmissionContent({content}) {
  const YOUTUBE_VID = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  if (content?.domain == undefined) {
    return <Text style={{color: 'red'}}>Content not supported</Text>
  }
  else if (['i.ruqqus.com', 'i.imgur.com', 'i.redd.it'].some(x => content.domain.includes(x))) {
    
    return <ScaledImage
      url={content.url}
    />
  }
  else if (content.domain == 'text post') {
    return <HtmlMarkdown html={content?.body?.html || `<h6 style="color: ${COLORS.muted};">No body</h6>`}/>
  }
  else if (content.domain.includes('youtu')) {
    let match = content.url.match(YOUTUBE_VID)
    let id = (match && match[7].length == 11) ? match[7] : false

    return (<YoutubePlayer
      height={180}
      videoId={id}
    />)
  }
  else {
    return <View>    
      <Pressable onPress={() => Linking.openURL(content.url)}>
        <View style={{
          alignSelf: 'flex-start',
        }}>
          <Text style={{
            position: 'absolute',
            color: COLORS.text,
            backgroundColor: COLORS.primary,
            fontSize: FONTSIZE(0.1),
            fontWeight: 'bold',
            zIndex: 1000,
            padding: SPACE(0.2),
            margin: SPACE(0.4),
            borderRadius: 8,
          }}>
            Link
          </Text>
        </View>
        <BackupThumbnail content={content} />
      </Pressable>
    </View>
  }
}

class SubmissionDelayControl extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      waiting: false
    }
  }

  onPress() {
    this.setState({waiting: true}, () => {
      Promise.resolve(this.props.onPress()).then(() => {
        this.setState({waiting: false})
      })
    })
  }

  render() {
    if (this.state.waiting) {
      return <ActivityIndicator size="small" color={COLORS.primary} />
    }
    else {
      return <IconButton 
        icon={this.props.icon}
        style={Style.bottomButtons}
        color={this.props.active ? COLORS.primary : 'white'}
        onPress={() => this.onPress()}
      />
    }
  }
}

export default class Postcard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      post: this.props.post,
      id: props.pid,
      modalVisible: false,
      saved: false
    }

    this._savedPosts = new Collection('saved')
    this._savedPosts.onChange(() => {
      this._savedPosts.findOne({pid: this.state.post.id}).then(saved => this.setState({saved}))
    })
  }

  toggleSaved() {
    let bod = {pid: this.state.post.id}
    return this._savedPosts
      .findOne(bod)
      .then(saved => {
        if (saved) {
          return this._savedPosts.delete(bod)
        }
        else {
          return this._savedPosts.create({
            ...bod,
            savedat: Date.now()
          })
        }
      })
  }

  togglModal() {
    this.setState(prev => ({modalVisible: !prev.modalVisible}))
  }

  upvote() {
    return this.state.post[this.state.post.votes.voted === 0 ? 'upvote' : 'removeVote']().then(post => {
      this.setState({post})
    })
  }

  downvote()  {
    return this.state.post[this.state.post.votes.voted === 0 ? 'downvote' : 'removeVote']().then(post => {
      this.setState({post})
    })
  }

  gotoGuild() {
    this.props.navigation.navigate('Guild', {
      name: this.state.post.guild.name
    })
  }

  gotoComments() {
    this.props.navigation.navigate('Comments', {
      post: this.state.post
    })
  }

  gotoUser() {
    this.props.navigation.navigate('User', {
      name: this.state.post.author.username
    })
  }

  render() {
    var { post } = this.state
    return (
      <View style={{
        ...Style.card,
        padding: 0,
        marginBottom: SPACE(1),
      }}>
        <Popup
          togglModal={() => this.togglModal()}
          visible={this.state.modalVisible}
          title="More"
        >
          <PopupButton
            label="Share"
            icon="share"
            onPress={() => {
              Share.share({message: this.state.post.full_link})
              this.togglModal()
            }}
          />

          <PopupButton
            label="Comments"
            icon="comment"
            onPress={() => {
              this.gotoComments()
              this.togglModal()
            }}
          />

          <PopupButton
            label={`Go to @${post?.author?.username}`}
            icon="person"
            onPress={() => {
              this.gotoUser()
              this.togglModal()
            }}
            />

          <PopupButton
            label={`Go to +${post?.guild?.name}`}
            icon="add"
            onPress={() => {
              this.gotoGuild()
              this.togglModal()
            }}
          />

          <PopupButton
            label="Open In Browser"
            icon="open-in-browser"
            onPress={() => {
              if (post?.content?.url) {
                Linking.openURL(post?.content?.url)
                this.togglModal()
              }
            }}
          />

          <PopupButton
            label="Report"
            icon="flag"
          />

          <PopupButton
            label="Hide"
            icon="block"
          />

          <PopupButton
            label="console.log(post)"
            icon="save"
            onPress={() => console.log(this.state.post)}
          />
        </Popup>

        <View style={{padding: SPACE(1/2)}}>
          <View style={Style.horizontal}>
            <Image 
              source={{ uri: post?.guild?.icon_url }}
              style={{
                width: 20,
                height: 20,
                marginRight: SPACE(0.5),
                borderRadius: 4
              }}
            />
    
            <View>
              <Pressable onPress={() => this.gotoGuild()}>
                <Text style={{
                  color: COLORS.primary
                }}>
                  +{post?.guild?.name}
                </Text>
              </Pressable>
            </View>
            
            <Delimiter />
    
            <View>
              <Pressable onPress={() => this.gotoUser()}>
                <Text style={{ color: COLORS.muted }}>
                  {post?.author?.username}
                </Text>
              </Pressable>
            </View>

            <Delimiter />

            <View>
              <Text style={{ color: COLORS.muted }}>
                {post?.content?.domain}
              </Text>
            </View>

            <Delimiter />

            <View>
              <Text style={{ color: COLORS.muted }}>
                <TimeAgo time={post?.created_at * 1000}/> {post?.edited > 0 ? "(edited)" : ""}
              </Text>
            </View>
          </View>

          <View>
            <Text style={{
              fontSize: FONTSIZE(2),
              color: COLORS.text,
            }}>
              {post?.content?.title.replace('&amp;', '&')}
            </Text>
          </View>

          <View style={Style.horizontal}>
            <Text style={{
              color: COLORS.text,
              fontSize: FONTSIZE(1.2)
            }}>
              <Text style={{color: Lighten(COLORS.primary)}}>{post?.votes?.upvotes}↑</Text> <Text style={{color: Darken(COLORS.primary, 1/10)}}>{post?.votes?.downvotes}↓</Text>  <Text style={{color: COLORS.muted}}>({post?.votes?.score})</Text>
            </Text>

            {/* <Text style={{
              color: COLORS.text,
              fontSize: FONTSIZE(1)
            }}>
              // TODO: COMMENNT COUNT HERE
            </Text> */}
          </View>
        </View>

        <View>
          <SubmissionContent content={post?.content} />
        </View>

        <View style={{
          ...Style.horizontal,
          justifyContent: 'space-around',
        }}>
          <SubmissionDelayControl 
            icon="arrow-upward"
            active={this.state?.post?.votes?.voted === 1}
            onPress={() => this.upvote()}
          />
          <SubmissionDelayControl 
            icon="arrow-downward"
            active={this.state?.post?.votes?.voted === -1}
            onPress={() => this.downvote()}
          />
          <SubmissionDelayControl 
            icon="save"
            active={this.state.saved}
            onPress={() => this.toggleSaved()}
          />
          <IconButton 
            icon="comment" 
            style={Style.bottomButtons} 
            onPress={() => this.gotoComments()}
          />
          <IconButton 
            icon="more-vert" 
            style={Style.bottomButtons} 
            onPress={() => this.togglModal()} 
          />
        </View>
      </View>
    )
  }
}
