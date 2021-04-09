import React from 'react';
import {View, Image, Text} from 'react-native';
import {COLORS, FONTSIZE, SPACE} from '../theme';
import {Button} from './Buttons';
import HtmlMarkdown from './HtmlMarkdown';

interface GuildHeaderProps {
  guild: {
    banner_url: string;
    icon_url: string;
    name: string;
    subscribers: number;
    description: {
      html: string;
    };
  };
  enabled: boolean;
}

export function GuildHeader(props: GuildHeaderProps) {
  if (props.enabled) {
    return (
      <View
        style={{
          backgroundColor: COLORS.background,
          marginBottom: SPACE(1.5),
        }}>
        <Image
          source={{uri: props.guild.banner_url}}
          style={{
            width: '100%',
            aspectRatio: 3.4092307692307693,
          }}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Image
            source={{uri: props.guild.icon_url}}
            style={{
              width: 64,
              aspectRatio: 1,
              borderRadius: 100,
              margin: SPACE(1),
            }}
          />
          <View style={{margin: SPACE(1)}}>
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONTSIZE(4 / 3),
                fontWeight: 'bold',
              }}>
              +{props.guild.name}
            </Text>
            <Text
              style={{
                color: COLORS.text,
                flexShrink: 1,
              }}>
              {props.guild.subscribers} subscribers
            </Text>
          </View>
        </View>
        <Button text="Subscribe" />
        <HtmlMarkdown html={props.guild?.description?.html} />
      </View>
    );
  } else {
    return <View></View>;
  }
}
