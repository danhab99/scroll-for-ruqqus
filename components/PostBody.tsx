import React, { useState, useEffect } from "react";
import { useContextPost } from "react-ruqqus";
import cheerio from "react-native-cheerio";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  Linking,
  Image,
} from "react-native";
import ScaledImage from "./ScaledImage";
import { useTheme } from "@contexts";
import HtmlMarkdown from "./HtmlMarkdown";
import YoutubePlayer from "react-native-youtube-iframe";

function PostAsImage() {
  const post = useContextPost();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string>(post.thumb_url);
  const theme = useTheme();

  useEffect(() => {
    const controller = new AbortController();

    fetch(post.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69 [FBAN/FBIOS;FBAV/59.0.0.51.142;FBBV/33266808;FBRV/0;FBDV/iPhone7,1;FBMD/iPhone;FBSN/iPhone OS;FBSV/9.3.2;FBSS/3;FBCR/Telkomsel;FBID/phone;FBLC/en_US;FBOP/5] evaliant",
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    }).then((resp) => {
      if (resp.ok) {
        let type = resp?.headers?.get?.("content-type");

        if (type?.includes("html")) {
          resp.text().then((html) => {
            var $ = cheerio.load(html);
            let l = $('meta[property="og:image"]').attr("content");
            if (l && l.length > 0) {
              setUrl(l);
              console.log("Url has OG image", l);
            } else {
              if (post.id === "a8xf") debugger;
              console.log("Unable to get OG image", post.url);
            }
            setLoading(false);
          });
        } else if (type?.includes("image")) {
          console.log("Url already an image", post.url);
          setUrl(url);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      controller.abort();
    };
  }, [post.url]);

  return (
    <View style={{ aspectRatio: 2 }}>
      {loading ? (
        <ActivityIndicator color={theme?.Colors?.primary} size="large" />
      ) : (
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      )}
    </View>
  );
}

const YOUTUBE_VID =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

const VALID_IMAGE_DOMAINS = [
  "backdatassup.com",
  "cdn.discordapp.com",
  "docs.google.com",
  "external-content.duckduckgo.com",
  "files.explosm.net",
  "grrrgraphics.com",
  "ibb.co",
  "i.ibb.co",
  "i.imgflip.com",
  "i.imgur.com",
  "imgs.xkcd.com",
  "i.redd.it",
  "i.ruqqus.com",
  "media.discordapp.net",
  "media.gab.com",
  "media.giphy.com",
  "media.tenor.com",
  "puu.sh",
  "tenor.com",
];

export default function SubmissionContent() {
  const post = useContextPost();
  const theme = useTheme();

  if (post?.domain == undefined) {
    return <Text style={{ color: "red" }}>Content not supported</Text>;
  } else if (VALID_IMAGE_DOMAINS.some((x) => post?.domain?.includes(x))) {
    return (
      <View>
        <ScaledImage url={post.url} scalable />
      </View>
    );
  } else if (post.domain == "text post") {
    return (
      <HtmlMarkdown
        html={
          post.body_html ||
          `<p style="color: ${theme?.Colors?.muted};">No body</p>`
        }
      />
    );
  } else if (post?.domain?.includes("youtu")) {
    let match = post?.url?.match(YOUTUBE_VID);
    let id = match && match[7].length == 11 ? match[7] : false;

    return <YoutubePlayer height={180} videoId={id || ""} />;
  } else {
    return (
      <View>
        <Pressable onPress={() => Linking.openURL(post?.url)}>
          <View
            style={{
              alignSelf: "flex-start",
            }}>
            <Text
              style={{
                position: "absolute",
                color: theme?.Colors.text,
                backgroundColor: theme?.Colors.primary,
                fontSize: theme?.FontSize.get?.(0.1),
                fontWeight: "bold",
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
