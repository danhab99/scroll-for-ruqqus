import React, {useState, useEffect} from 'react';
import {usePost} from 'react-ruqqus';
import cheerio from 'react-native-cheerio';
import {ActivityIndicator, Pressable, Text, View, Linking} from 'react-native';
import ScaledImage from './ScaledImage';
import {useTheme} from '@contexts';
import HtmlMarkdown from './HtmlMarkdown';
import YoutubePlayer from 'react-native-youtube-iframe';

function PostAsImage() {
  const post = usePost();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string>();
  const theme = useTheme();

  useEffect(() => {
    fetch(post.url).then((resp) => {
      if (resp.ok) {
        let type = resp?.headers?.get?.('content-type');

        if (type?.includes('html')) {
          resp.text().then((html) => {
            var $ = cheerio.load(html);
            let l = $('meta[property="og:image"]').attr('content');
            if (l && l.length > 0) {
              setUrl(l);
              console.log('Url has OG image', l);
            } else {
              console.log('Unable to get OG image', l);
            }
            setLoading(false);
          });
        } else if (type?.includes('image')) {
          console.log('Url already an image', post.url);
          setUrl(url);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, [post.url]);

  return (
    <View>
      <View>
        {loading ? (
          <ActivityIndicator
            size={100}
            color={theme?.Colors?.primary}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
            }}
          />
        ) : (
          <ScaledImage url={url} />
        )}
      </View>
    </View>
  );
}

const YOUTUBE_VID = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export default function SubmissionContent() {
  const post = usePost();
  const theme = useTheme();

  if (post.url === '9pr5') debugger;
  if (post?.domain == undefined) {
    return <Text style={{color: 'red'}}>Content not supported</Text>;
  } else if (
    ['i.ruqqus.com', 'i.imgur.com', 'i.redd.it'].some((x) =>
      post?.domain?.includes(x),
    )
  ) {
    return <ScaledImage url={post.url} />;
  } else if (post.domain == 'text post') {
    return (
      <HtmlMarkdown
        html={
          post.body_html ||
          `<p style="color: ${theme?.Colors?.muted};">No body</p>`
        }
      />
    );
  } else if (post?.domain?.includes('youtu')) {
    let match = post?.url?.match(YOUTUBE_VID);
    let id = match && match[7].length == 11 ? match[7] : false;

    return <YoutubePlayer height={180} videoId={id || ''} />;
  } else {
    return (
      <View>
        <Pressable onPress={() => Linking.openURL(post?.url)}>
          <View
            style={{
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
                position: 'absolute',
                color: theme?.Colors.text,
                backgroundColor: theme?.Colors.primary,
                fontSize: theme?.FontSize.get?.(0.1),
                fontWeight: 'bold',
                zIndex: 1000,
                padding: theme?.Space.get?.(0.2),
                margin: theme?.Space.get?.(0.4),
                borderRadius: 8,
              }}>
              Link
            </Text>
          </View>
          <PostAsImage />
        </Pressable>
      </View>
    );
  }
}
