import React from 'react';
import {Text, Linking} from 'react-native';
import {SPACE, FONTSIZE, COLORS, MarkdownStyle} from '../theme';
import HTML from 'react-native-render-html';
import {useRuqqusClient} from '../react-ruqqus/useRuqqusClient';
import {useTheme} from '../contexts/theme-context';

interface HtmlMarkdownProps {
  html: string;
  domain?: string;
}

export default function HtmlMarkdown(props: HtmlMarkdownProps) {
  const client = useRuqqusClient();
  const theme = useTheme();

  return (
    <HTML
      html={props.html}
      tagsStyles={MarkdownStyle}
      containerStyle={{
        paddingRight: SPACE(1 / 2),
        paddingLeft: SPACE(1 / 2),
        paddingBottom: SPACE(1 / 2),
      }}
      listsPrefixesRenderers={{
        ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          return (
            <Text
              style={{
                color: COLORS.primary,
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
        console.log('HTML', node);
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
