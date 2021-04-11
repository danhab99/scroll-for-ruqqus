import React from 'react';
import {usePost, useVote} from '@react-ruqqus';
import {View, Text, Pressable, TextStyle} from 'react-native';
import {useTheme, useStyle} from '@contexts';
import TimeAgo from 'react-native-timeago';
import * as _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubmissionContent from 'components/PostBody';
import {IconButton} from 'components/Buttons';

function Head() {
  const post = usePost();
  const theme = useTheme();
  const style = useStyle();

  const headItems = [
    {
      label: '+' + post.guild.name,
      action: () => {}, // TODO: Do guild navigation
    },
    {
      label: post.author_name,
      action: () => {}, // TODO: Do user navigation
    },
    {
      label: post.domain,
    },
    {
      label: <TimeAgo time={post?.created_utc?.getSeconds?.()} hideAgo />,
    },
    {
      label: post.id,
    },
  ];

  const headComponents = headItems.map((obj, i) => (
    <Pressable onPress={obj.action}>
      <Text style={i === 0 ? style?.primaryHeadText : style?.headText}>
        {obj.label}
      </Text>
    </Pressable>
  ));

  const head = _.flatMap(headComponents, (value, index, array) =>
    array.length - 1 !== index
      ? [value, <Text style={style?.headBullet}>{' • '}</Text>]
      : value,
  );

  return <View style={style?.horizontal}>{head}</View>;
}

function Title() {
  const post = usePost();
  const style = useStyle();

  return (
    <View>
      <Text style={style?.title}>{post.title}</Text>
    </View>
  );
}

function Metas() {
  const post = usePost();
  const style = useStyle();
  const theme = useTheme();

  return (
    <View style={style?.horizontal}>
      <Icon
        name="arrow-circle-up"
        color={theme?.Colors.primaryLight}
        size={theme?.FontSize.get?.(2)}
      />
      <Text style={style?.upvotes}> {post.upvotes} </Text>
      <Icon
        name="arrow-circle-down"
        color={theme?.Colors.primaryDark}
        size={theme?.FontSize.get?.(2)}
      />
      <Text style={style?.downvotes}> {post.downvotes} </Text>
      <Text style={style?.headText}>({post.score})</Text>
    </View>
  );
}

function Controls() {
  const {} = useVote();
  const post = usePost();
  const style = useStyle();

  return (
    <View style={style?.controlrow}>
      <IconButton name="arrow-up" />
      <IconButton name="arrow-down" />
      <IconButton name="save" />
      <IconButton name="commenting" />
      <IconButton name="ellipsis-v" />
    </View>
  );
}

export default function DefaultPostcard() {
  // const post = usePost();
  const theme = useTheme();
  const style = useStyle();

  return (
    <View style={{marginBottom: theme?.Space.get?.(0.5)}}>
      <View style={style?.card}>
        <View style={{padding: theme?.Space.get?.(0.5)}}>
          <Head />
          <Title />
          <Metas />
        </View>
        <SubmissionContent />
        <Controls />
      </View>
    </View>
  );
}
