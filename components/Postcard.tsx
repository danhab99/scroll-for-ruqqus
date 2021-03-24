import React, {useState} from 'react';
import {
  View,
  Pressable,
  Text,
  Image,
  Linking,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import Style, {SPACE, FONTSIZE, COLORS, Lighten, Darken} from '../theme';
import TimeAgo from 'react-native-timeago';
import YoutubePlayer from 'react-native-youtube-iframe';
import Collection from '../asyncstorage';
// import cherrio from 'react-native-cheerio';
import HtmlMarkdown from './HtmlMarkdown';
import ScaledImage from './ScaledImage';
import {IconButton} from './Buttons';
import Popup, {PopupButton} from './Popup';
import BackupThumbnail from './postcard/BackupThumbnail';
import {useNavigation} from '@react-navigation/core';
import Delimiter from './postcard/Delimiter';

interface SubmissionContentProps {
  content: {
    domain: string;
    url: string;
    body:
      | string
      | {
          html: string;
        };
  };
}

function SubmissionContent({content}: SubmissionContentProps) {
  const YOUTUBE_VID = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  if (content?.domain == undefined) {
    return <Text style={{color: 'red'}}>Content not supported</Text>;
  } else if (
    ['i.ruqqus.com', 'i.imgur.com', 'i.redd.it'].some((x) =>
      content.domain.includes(x),
    )
  ) {
    return <ScaledImage url={content.url} />;
  } else if (content.domain == 'text post') {
    return (
      <HtmlMarkdown
        domain={content.domain}
        html={
          content?.body?.html ||
          `<p style="color: ${COLORS.muted};">No body</p>`
        }
      />
    );
  } else if (content.domain.includes('youtu')) {
    let match = content.url.match(YOUTUBE_VID);
    let id = match && match[7].length == 11 ? match[7] : '';

    return <YoutubePlayer height={180} videoId={id} />;
  } else {
    return (
      <View>
        <Pressable onPress={() => Linking.openURL(content.url)}>
          <View
            style={{
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
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
    );
  }
}

interface SubmissionDelayControlProps {
  onPress: () => void;
  icon: string;
  active: boolean;
}

function SubmissionDelayControl(props: SubmissionDelayControlProps) {
  const [waiting, setWaiting] = useState(false);

  const onPress = () => {
    setWaiting(true);
    Promise.resolve(props.onPress()).then(() => {
      setWaiting(false);
    });
  };

  if (waiting) {
    return <ActivityIndicator size="small" color={COLORS.primary} />;
  } else {
    return (
      <IconButton
        icon={props.icon}
        style={Style.bottomButtons}
        color={props.active ? COLORS.primary : 'white'}
        onPress={onPress}
      />
    );
  }
}

interface PostcardProps {
  post: any;
  pid: string;
}

export default function Postcard(props: PostcardProps) {
  const navigation = useNavigation();

  const [post, setPost] = useState(props.post);
  const [id, setID] = useState(props.pid);
  const [modalVisible, setModalVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const savedPosts = new Collection('saved');
  savedPosts.onChange(() => {
    savedPosts
      .findOne({pid: id})
      .then((saved: any) => setSaved(Boolean(saved)));
  });

  const toggleSaved = () => {
    let bod = {pid: post.id};
    return savedPosts.findOne(bod).then((saved: any) => {
      if (saved) {
        return savedPosts.delete(bod);
      } else {
        return savedPosts.create({
          ...bod,
          savedat: Date.now(),
        });
      }
    });
  };

  const togglModal = () => {
    setModalVisible((x) => !x);
  };

  const upvote = () => {
    // TODO refactor this with the new client
    // return this.state.post[
    //   this.state.post.votes.voted !== 1 ? 'upvote' : 'removeVote'
    // ]().then((post) => {
    //   this.setState({post});
    // });
  };

  const downvote = () => {
    // TODO refactor this with the new client
    // return this.state.post[
    //   this.state.post.votes.voted !== -1 ? 'downvote' : 'removeVote'
    // ]().then((post) => {
    //   this.setState({post});
    // });
  };

  const gotoGuild = () => {
    navigation.navigate('Guild', {
      name: post.guild_name,
    });
  };

  const gotoComments = () => {
    navigation.navigate('Comments', {
      post: post,
    });
  };

  const gotoUser = () => {
    navigation.navigate('User', {
      name: post.author_username,
    });
  };

  return (
    <View
      style={{
        ...Style.card,
        padding: 0,
        marginBottom: SPACE(1),
      }}>
      <Popup
        toggleModal={() => togglModal()}
        visible={modalVisible}
        title="More">
        <PopupButton
          label="Share"
          icon="share"
          onPress={() => {
            Share.share({message: post.full_link});
            togglModal();
          }}
        />

        <PopupButton
          label="Comments"
          icon="comment"
          onPress={() => {
            gotoComments();
            togglModal();
          }}
        />

        <PopupButton
          label={`Go to @${post?.author_username}`}
          icon="person"
          onPress={() => {
            gotoUser();
            togglModal();
          }}
        />

        <PopupButton
          label={`Go to +${post?.guild_name}`}
          icon="add"
          onPress={() => {
            gotoGuild();
            togglModal();
          }}
        />

        <PopupButton
          label="Open In Browser"
          icon="open-in-browser"
          onPress={() => {
            let u = post?.content?.url || post?.full_link;
            Linking.canOpenURL(u).then(() => Linking.openURL(u));
            togglModal();
          }}
        />

        {/* <PopupButton label="Report" icon="flag" />

          <PopupButton label="Hide" icon="block" /> */}

        <PopupButton
          label="console.log(post)"
          icon="save"
          onPress={() => {
            Alert.alert(JSON.stringify(post, null, 2));
            console.log(post);
            togglModal();
          }}
        />
      </Popup>

      <View style={{padding: SPACE(1 / 2)}}>
        <View style={Style.horizontal}>
          <Image
            source={{uri: post?.guild?.profile_url}}
            style={{
              width: 20,
              height: 20,
              marginRight: SPACE(0.5),
              borderRadius: 4,
            }}
          />

          <View>
            <Pressable onPress={() => gotoGuild()}>
              <Text
                style={{
                  color: COLORS.primary,
                }}>
                +{post?.guild_name}
              </Text>
            </Pressable>
          </View>

          <Delimiter />

          <View>
            <Pressable onPress={() => gotoUser()}>
              <Text style={{color: COLORS.muted}}>{post?.author_username}</Text>
            </Pressable>
          </View>

          <Delimiter />

          <View>
            <Text style={{color: COLORS.muted}}>{post?.content?.domain}</Text>
          </View>

          <Delimiter />

          <View>
            <Text style={{color: COLORS.muted}}>
              <TimeAgo time={post?.created_at * 1000} />{' '}
              {post?.edited > 0 ? '(edited)' : ''}
            </Text>
          </View>

          <Delimiter />

          <View>
            <Text style={{color: COLORS.muted}}>{post?.id}</Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: FONTSIZE(2),
              color: COLORS.text,
            }}>
            {post?.content?.title.replace('&amp;', '&')}
          </Text>
        </View>

        <View style={Style.horizontal}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: FONTSIZE(1.2),
            }}>
            <Text style={{color: Lighten(COLORS.primary)}}>
              {post?.votes?.upvotes}↑
            </Text>{' '}
            <Text style={{color: Darken(COLORS.primary, 1 / 10)}}>
              {post?.votes?.downvotes}↓
            </Text>{' '}
            <Text style={{color: COLORS.muted}}>({post?.votes?.score})</Text>
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

      <View
        style={{
          ...Style.horizontal,
          justifyContent: 'space-around',
        }}>
        <SubmissionDelayControl
          icon="arrow-upward"
          active={post?.votes?.voted === 1}
          onPress={() => upvote()}
        />
        <SubmissionDelayControl
          icon="arrow-downward"
          active={post?.votes?.voted === -1}
          onPress={() => downvote()}
        />
        <SubmissionDelayControl
          icon="save"
          active={saved}
          onPress={() => toggleSaved()}
        />
        <IconButton
          icon="comment"
          style={Style.bottomButtons}
          onPress={() => gotoComments()}
        />
        <IconButton
          icon="more-vert"
          style={Style.bottomButtons}
          onPress={() => togglModal()}
        />
      </View>
    </View>
  );
}
