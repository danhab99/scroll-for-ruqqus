import React, { useEffect } from "react";
import { Text, Linking, StyleSheet, Image, Pressable } from "react-native";
import HTML from "react-native-render-html";
import { useRuqqusClient } from "../react-ruqqus/useRuqqusClient";
import { useTheme, useStyle } from "@contexts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePost } from "react-ruqqus";
import TextBox from "./TextBox";
import URL from "url-parse";
import _ from "lodash";
import { useContextPost } from "../react-ruqqus/RuqqusFeed";

function AlignedTextBox(
  htmlAttribs: any,
  children: any,
  convertedCSSStyles: any,
  passProps: any,
): HTML.RendererDeclaration<unknown> {
  if (htmlAttribs.href) {
    return (
      <Pressable onPress={() => passProps.onLinkPress(null, htmlAttribs.href)}>
        <TextBox
          color="primary"
          key="HTMLLINK"
          style={{
            marginBottom: -1,
            padding: 0,
          }}>
          {children}
        </TextBox>
      </Pressable>
    );
  } else {
    return <TextBox>{children}</TextBox>;
  }
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
      }}
      renderers={{
        // p: AlignedTextBox,
        // li: AlignedTextBox,
        // a: AlignedTextBox,
        img: {
          renderer: (htmlAttribs, children) => {
            // debugger;
            return <Image source={{ uri: `${htmlAttribs.src}` }} />;
          },
          wrapper: "Text",
        },
      }}
      containerStyle={style?.paddedCard}
      listsPrefixesRenderers={{
        ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          return (
            <Text
              style={{
                color: theme?.Colors?.primary,
                fontSize: theme?.FontSize?.get?.(1.5),
                fontWeight: "bold",
                marginRight: theme?.Space?.get?.(1 / 5),
              }}>
              •
            </Text>
          );
        },
      }}
      onLinkPress={(evt, href, attr) => {
        let u = new URL(href);
        if (
          u.hostname.length === 0 ||
          u.hostname.includes(client.domain) ||
          u.hostname.includes("localhost")
        ) {
          let edges = _.compact(_.split(u.pathname, "/"));

          switch (edges[0][0]) {
            case "+":
              navigation.push(route.name, { feed: { guild: edges[1] } });
              break;
            case "@":
              navigation.push(route.name, {
                feed: { user: edges[0].slice(1) },
              });
              break;
            default:
              console.warn("Unable to parse navigation action ");
          }
        } else {
          Linking.canOpenURL(href)
            .then(() => Linking.openURL(href))
            .catch((err) => console.warn("Cannot open markdown link", err));
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
