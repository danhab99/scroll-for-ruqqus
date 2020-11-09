import React from 'react';
import { View, Pressable, Text, Image, Linking, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Style, { SPACE, FONTSIZE, COLORS, Lighten, Darken, FONTS } from './theme'
import TimeAgo from 'react-native-timeago';
import YoutubePlayer from "react-native-youtube-iframe";

export function IconButton(props) {
  return (
    <View style={props.style}>
      <Pressable onPress={() => props.onPress && props.onPress()}>
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

function SubmissionContent({content}) {
  if (['i.ruqqus.com', 'i.imgur.com'].includes(content.domain)) {
    return <ScaledImage
      url={content.url}
    />
  }
  else if (content.domain == 'text post') {
    return <Text style={{
      color: COLORS.text,
      backgroundColor: COLORS.background,
      padding: SPACE(0.5),
      borderRadius: 5
    }}>
      {content.body.text}
    </Text>
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
      <ScaledImage
        url={content.thumbnail}
      />
    </Pressable>
  }
}

function SubmissionMoreButton(props) {
  return <Pressable onPress={() => props.onPress}>
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

export class SubmissionCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      post: {},
      id: props.pid,
      modalVisible: false
    }
  }

  togglModal() {
    this.setState(prev => ({modalVisible: !prev.modalVisible}))
  }

  render() {
    var { post } = this.props
    return (
      <View style={{
        ...Style.card,
        padding: 0,
        marginBottom: SPACE(1),
      }}>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          animationType="slide"
          onRequestClose={() => this.togglModal()}
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
              backgroundColor: COLORS.background,
              padding: SPACE(2),
              width: '100%',
              borderRadius: 10
            }}>
              <IconButton
                icon="close"
                style={{
                  marginBottom: SPACE(1)
                }}
                onPress={() => this.togglModal()}
              />

              <SubmissionMoreButton
                label="Share"
                icon="share"
              />

              <SubmissionMoreButton
                label="Comments"
                icon="comment"
              />

              <SubmissionMoreButton
                label={`Go to ${post?.author?.username}`}
                icon="person"
              />

              <SubmissionMoreButton
                label={`Go to +${post?.guild?.name}`}
                icon="add"
              />

              <SubmissionMoreButton
                label="Open In Browser"
                icon="open-in-browser"
              />

              <SubmissionMoreButton
                label="Report"
                icon="flag"
              />

              <SubmissionMoreButton
                label="Hide"
                icon="block"
              />
            </View>
          </View>
        </Modal>

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
              <Pressable>
                <Text style={{
                  color: COLORS.primary
                }}>
                  +{post?.guild?.name}
                </Text>
              </Pressable>
            </View>
            
            <Delimiter />
    
            <View>
              <Pressable>
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
          <IconButton icon="arrow-upward" style={Style.bottomButtons} />
          <IconButton icon="arrow-downward" style={Style.bottomButtons} />
          <IconButton icon="save" style={Style.bottomButtons} />
          <IconButton icon="comment" style={Style.bottomButtons} />
          <IconButton icon="more-vert" style={Style.bottomButtons} onPress={() => this.togglModal()} />
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
  return (<Pressable onPress={props.onPress}> 
    <Text
      style={{
        backgroundColor: COLORS.primary,
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