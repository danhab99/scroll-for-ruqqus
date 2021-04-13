import React from 'react';
import {Text, Linking, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';
import {useRuqqusClient} from '../react-ruqqus/useRuqqusClient';
import {useTheme} from '../contexts/theme-context';

interface HtmlMarkdownProps {
  html: string;
}

export default function HtmlMarkdown(props: HtmlMarkdownProps) {
  const client = useRuqqusClient();
  const theme = useTheme();

  const MarkdownStyle = StyleSheet.create({
    p: {
      color: theme?.Colors?.text,
      fontSize: theme?.FontSize?.get?.(1),
      marginBottom: theme?.Space?.get?.(1 / 3),
    },
    a: {
      color: theme?.Colors?.primary,
      fontSize: theme?.FontSize?.get?.(1),
    },
    ul: {
      marginRight: theme?.Space?.get?.(1 / 4),
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
  });

  return (
    <HTML
      html={props.html}
      tagsStyles={MarkdownStyle}
      containerStyle={{
        paddingRight: theme?.Space?.get?.(1 / 2),
        paddingLeft: theme?.Space?.get?.(1 / 2),
        paddingBottom: theme?.Space?.get?.(1 / 2),
      }}
      listsPrefixesRenderers={{
        ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          return (
            <Text
              style={{
                color: theme?.Colors?.primary,
                fontSize: theme?.FontSize?.get?.(1.5),
                fontWeight: 'bold',
                marginRight: theme?.Space?.get?.(1 / 5),
              }}>
              •
            </Text>
          );
        },
      }}
      onLinkPress={(evt, href, attr) => {
        Linking.canOpenURL(href)
          .then(() => Linking.openURL(href))
          .catch((err) => console.log('Cannot open markdown link', err));
      }}
      alterNode={(node) => {
        if (node.name === 'img') {
          if (node?.attribs?.src[0] == '/') {
            return Object.assign(node, {
              attribs: {
                src: `https://${client.domain || 'ruqqus.com'}${
                  node.attribs.src
                }`,
              },
            });
          }
        }
        return node;
      }}
    />
  );
}
