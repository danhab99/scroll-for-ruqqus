import React, { useState } from 'react';
import { View, Pressable, Text, Image, Linking, Modal, ActivityIndicator, Share } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Style, { SPACE, FONTSIZE, COLORS, Lighten, Darken, MarkdownStyle, FONTS } from './theme'
import TimeAgo from 'react-native-timeago';
import YoutubePlayer from "react-native-youtube-iframe";
import Collection from './asyncstorage';
import HTML from 'react-native-render-html';
import cherrio from 'react-native-cheerio'


export function IconButton(props) {
  return (
    <View style={props.style}>
      <Pressable onPress={() => props.onPress && props.onPress()} onLongPress={() => props.onLongPress && props.onLongPress()}>
        <Icon name={props.icon} color={props.color || "white"} style={{
          fontSize: FONTSIZE(props.fontsize || 4)
        }} />
      </Pressable>
    </View>
  )
}

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

class ScaledImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      source: { 
        uri: this.props.uri 
      },
      aspectRatio: 1
    };
  }

  componentDidMount() {
    Image.getSize(this.props.url, (width, height) => {
      this.setState({
        aspectRatio: width / height
      })
    });
  }

  render() {
    return (
      <Image
        source={{uri: this.props.url}}
        style={{
          width: '100%',
          aspectRatio: this.state.aspectRatio
        }}
      />
    );
  }
}

export function HtmlMarkdown(props) {
  return (<HTML 
    html={props.html} 
    tagsStyles={MarkdownStyle}
    containerStyle={{
      paddingRight: SPACE(1/2),
      paddingLeft: SPACE(1/2),
      paddingBottom: SPACE(1/2)
    }}
    listsPrefixesRenderers={{
      ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return (
          <Text style={{ 
            color: COLORS.primary, 
            fontSize: FONTSIZE(1.5),
            fontWeight: 'bold',
            marginRight: SPACE(1/5)
          }}>•</Text>
        );
      }
    }}
    onLinkPress={(evt, href, attr) => Linking.openURL(href)}
    alterNode={node => {
      if (node.name == 'img' && node.attribs.src[0] == '/') {
        return Object.assign(node, {
          attribs: {
            src: `https://${props.domain || "ruqqus.com"}${node.attribs.src}`,
          },
        });
      }
      return node
    }}
  />)
}

class BackupThumbnail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: 'https://media.wired.com/photos/5a0201b14834c514857a7ed7/master/pass/1217-WI-APHIST-01.jpg'
    }
  }

  componentDidMount() {
    let url = this.props.content.url || this.props.content.domain
    fetch(url)
      .then(resp => {
        if (resp.ok) {
          resp.text().then(html => {
            var $ = cherrio.load(html)
            let l = $('meta[property="og:image"]').attr('content')
            if (l) {
              this.setState({url: l})
            }
          })
        }
      })
  }

  render() {
    return <ScaledImage
      url={this.state.url}
    />
  }
}

function SubmissionContent({content}) {
  if (content?.domain == undefined) {
    return <Text style={{color: 'red'}}>Content not supported</Text>
  }
  else if (['i.ruqqus.com', 'i.imgur.com'].includes(content.domain)) {
    return <ScaledImage
      url={content.url}
    />
  }
  else if (content.domain == 'text post') {
    return <HtmlMarkdown html={content.body.html}/>
  }
  else if (content.domain.includes('youtu')) {
    let s = content.url.split('/')
    let id = s[s.length - 1]
    return (<YoutubePlayer
      height={180}
      videoId={id}
    />)
  }
  else {
    return <Pressable onPress={() => Linking.openURL(content.url)}>
      <BackupThumbnail content={content} />
    </Pressable>
  }
}

export function PopupButton(props) {
  return <Pressable onPress={() => props.onPress()}>
    <View
      style={{
        display: 'flex',
        justifyContent: "flex-start",
        flexDirection: 'row',
        marginBottom: SPACE(0.5)
      }}
    >
      <Icon 
        name={props.icon}
        size={30}  
        color={COLORS.text}
      />
      <Text
        style={{
          color: COLORS.text,
          fontSize: FONTSIZE(2),
          marginLeft: SPACE(1)
        }}
      >
        {props.label}
      </Text>
    </View>
  </Pressable>
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

export class SubmissionCard extends React.Component {
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
            onPress={() => Share.share({message: this.state.post.full_link})}
          />

          <PopupButton
            label="Comments"
            icon="comment"
            onPress={() => this.gotoComments()}
          />

          <PopupButton
            label={`Go to @${post?.author?.username}`}
            icon="person"
            onPress={() => this.gotoUser()}
            />

          <PopupButton
            label={`Go to +${post?.guild?.name}`}
            icon="add"
            onPress={() => this.gotoGuild()}
          />

          <PopupButton
            label="Open In Browser"
            icon="open-in-browser"
            onPress={() => Linking.openURL(post?.full_link)}
          />

          <PopupButton
            label="Report"
            icon="flag"
          />

          <PopupButton
            label="Hide"
            icon="block"
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
              {post?.content?.title}
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

export function Input(props) {
  return (<View>
    <Text style={Style.inputLabel}>
      {props.label}
    </Text>
    <TextInput
      style={{
        ...props.style, 
        ...Style.input
      }}
      {...props}
    />
  </View>)
}

export function LinkText(props) {
  return <Text
    style={{
      color: Lighten(COLORS.primary),
      textDecorationColor: COLORS.primary,
      textDecorationStyle: "solid",
      textDecorationLine: 'underline',
      ...props.style
    }}
    onPress={() => Linking.openURL(props.url)}
  >
    {props.children}
  </Text>
}

export function Button(props) {
  return (<Pressable onPress={() => !props.disabled && props.onPress()}> 
    <Text
      style={{
        backgroundColor: props.disabled ? COLORS.muted : COLORS.primary,
        color: COLORS.text,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: FONTSIZE(1.5),
        padding: SPACE(0.5),
        borderRadius: 5,
        ...props.style
      }}
    >
      {props.text}
    </Text>
  </Pressable>)
}

export function Popup(props) {
  return (<Modal
    transparent={true}
    visible={props.visible}
    animationType="slide"
    onRequestClose={() => props.togglModal()}
  >
    <View style={{
      margin: SPACE(3),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.5,
      elevation: 5,
      flex: 1,
      justifyContent: 'center'
    }}>
      <View style={{
        backgroundColor: COLORS.backgroundDark,
        padding: SPACE(2),
        width: '100%',
        borderRadius: 10
      }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <IconButton
            icon="close"
            style={{
              marginBottom: SPACE(1)
            }}
            onPress={() => props.togglModal()}
          />
          <Text style={{
            color: COLORS.text,
            fontSize: FONTSIZE(1.5)
          }}>
            {props.title}
          </Text>
        </View>
        

        {props.children}
      </View>
    </View>
  </Modal>)
}