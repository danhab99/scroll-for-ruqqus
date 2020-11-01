import React from 'react';
import { View, Pressable, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Style, { SPACE, FONTSIZE, COLORS } from './theme'

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

export class SubmissionCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      post: {},
      id: props.pid
    }
  }

  render() {
    var { post } = this.props
    return (
      <View style={{
        backgroundColor: COLORS.backgroundDark,
        borderRadius: 4,
        marginBottom: SPACE(1),
        padding: SPACE(0.5)
      }}>
        <View style={Style.horizontal}>
          <Image 
            source={{ uri: post?.content?.guild?.icon_url }}
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
                {post?.content?.guild?.name}
              </Text>
            </Pressable>
          </View>
          
          <View>
            <Text style={{
              color: COLORS.text,
              marginRight: SPACE(0.5),
              marginLeft: SPACE(0.5)
            }}>
              •
            </Text>
          </View>
  
          <View>
            <Pressable>
              <Text style={{ color: COLORS.muted }}>
                {post?.author?.username}
              </Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={{
            fontSize: FONTSIZE(2),
            color: COLORS.text,
            marginLeft: SPACE(0.6)
          }}>
            {post?.content?.title}
          </Text>
        </View>
  
        <View>
          <Text style={{color: COLORS.muted}}>Temporary Content</Text>
        </View>

        <View style={{
          ...Style.horizontal,
          justifyContent: 'space-evenly'
        }}>
          <IconButton icon="arrow-upward" style={Style.bottomButtons} />
          <IconButton icon="arrow-downward" style={Style.bottomButtons} />
          <IconButton icon="save" style={Style.bottomButtons} />
          <IconButton icon="comment" style={Style.bottomButtons} />
          <IconButton icon="share" style={Style.bottomButtons} />
          <IconButton icon="open-in-browser" style={Style.bottomButtons} />
          <IconButton icon="flag" style={Style.bottomButtons} />
          <IconButton icon="block" style={Style.bottomButtons} />
        </View>
      </View>
    )
  }
}