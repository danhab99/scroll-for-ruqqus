import React, { useEffect } from "react";
import {
  Text,
  Linking,
  StyleSheet,
  Image,
  Pressable,
  View,
} from "react-native";
import HTML, {
  HtmlAttributesDictionary,
  NonRegisteredStylesProp,
  PassProps,
} from "react-native-render-html";
import { useRuqqusClient } from "../react-ruqqus/useRuqqusClient";
import { useTheme, useStyle } from "@contexts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePost } from "react-ruqqus";
import TextBox from "./TextBox";
import URL from "url-parse";
import _ from "lodash";
import { useContextPost } from "../react-ruqqus/RuqqusFeed";
import ScaledImage from "./ScaledImage";

function Bullet() {
  const theme = useTheme();
  return (
    <Text
      style={{
        color: theme?.Colors?.primary,
        fontSize: theme?.FontSize?.get?.(1.5),
        fontWeight: "bold",
        marginRight: theme?.Space?.get?.(1 / 2),
      }}>
      •
    </Text>
  );
}

interface HtmlMarkdownProps {
  html: string;
}

export default function HtmlMarkdown(props: HtmlMarkdownProps) {
  const client = useRuqqusClient();
  const theme = useTheme();
  const style = useStyle();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  const post = useContextPost();

  useEffect(() => {
    if (post && post.id === "ad6u") {
      console.log("HTML TEST POST", props.html);
    }
  }, []);

  return (
    <HTML
      source={{ html: props.html }}
      tagsStyles={{
        p: {
          color: theme?.Colors?.text,
          fontSize: theme?.FontSize?.get?.(1),
          // marginBottom: theme?.Space?.get?.(1 / 3),
          margin: 0,
        },
        a: {
          color: theme?.Colors?.primary,
          fontSize: theme?.FontSize?.get?.(1),
          margin: 0,
        },
        ul: {
          marginRight: theme?.Space?.get?.(1 / 5),
          color: theme?.Colors?.primary,
        },
        ol: {
          marginRight: theme?.Space?.get?.(1 / 5),
          color: theme?.Colors?.primary,
        },
        li: {
          color: theme?.Colors?.text,
          fontSize: theme?.FontSize?.get?.(1),
        },
        h1: {
          color: theme?.Colors?.text,
        },
        h2: {
          color: theme?.Colors?.text,
        },
        h3: {
          color: theme?.Colors?.text,
        },
        h4: {
          color: theme?.Colors?.text,
        },
        h5: {
          color: theme?.Colors?.text,
        },
        h6: {
          color: theme?.Colors?.text,
        },
        code: {
          backgroundColor: theme?.Colors.backgroundHighlight,
          color: theme?.Colors.primary,
        },
      }}
      classesStyles={{
        "profile-pic-20": {
          width: theme?.FontSize.get?.(1),
          height: theme?.FontSize.get?.(1),
          marginRight: theme?.FontSize.get?.(0.5),
          textAlign: "center",
          objectFit: "cover",
          backgroundColor: "rgba(0,0,0,0)",
        },
        "align-middle": {
          verticalAlign: "middle",
        },
        "mr-1": {
          marginRight: 2,
        },
        "in-comment-image": {
          width: 100,
          height: 100,
        },
        "rounded-sm": {
          borderRadius: 10,
        },
        "my-2": {
          marginTop: 5,
        },
      }}
      renderers={{
        img: {
          renderer: (
            htmlAttribs: HtmlAttributesDictionary,
            children: React.ReactNode,
            convertedCSSStyles: NonRegisteredStylesProp<any>,
            passProps: PassProps<any>,
          ) => {
            let classes = `${htmlAttribs.class}`.split(" ");
            let classStyles = classes.map((x) => passProps.classesStyles?.[x]);

            return (
              <View>
                <Image
                  source={{ uri: `${htmlAttribs.src}` }}
                  style={[convertedCSSStyles, ...classStyles]}
                />
              </View>
            );
          },
          wrapper: "Text",
        },
      }}
      containerStyle={style?.paddedCard}
      listsPrefixesRenderers={{
        ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          return <Bullet />;
        },
        ol: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          // debugger;
          return <Bullet />;
        },
      }}
      onLinkPress={(evt, href, attr) => {
        let u = new URL(href);
        try {
          if (
            u.hostname.length === 0 ||
            u.hostname === client.domain ||
            u.hostname.includes("localhost")
          ) {
            let edges = _.compact(_.split(u.pathname, "/"));
            let param = edges[0].slice(1);

            switch (edges[0][0]) {
              case "+":
                navigation.push(route.name, {
                  feed: { guild: param },
                });
                break;
              case "@":
                navigation.push(route.name, {
                  feed: { user: param },
                });
                break;
              default:
                console.warn("Unable to parse navigation action ");
            }
          } else {
            Linking.canOpenURL(href).then(() => Linking.openURL(href));
          }
        } catch (err) {
          console.warn("Cannot open markdown link", err);
        }
      }}
      alterNode={(node) => {
        if (node.name === "img") {
          if (node?.attribs?.src[0] == "/") {
            _.set(
              node,
              ["attribs", "src"],
              `https://${client.domain}${node.attribs.src}`,
            );
          }
        }
        return node;
      }}
    />
  );
}
