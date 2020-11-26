import React from 'react';
import { Text, Linking } from 'react-native';
import { SPACE, FONTSIZE, COLORS, MarkdownStyle } from '../theme';
import HTML from 'react-native-render-html';


export default function HtmlMarkdown(props) {
  return (<HTML
    html={props.html}
    tagsStyles={MarkdownStyle}
    containerStyle={{
      paddingRight: SPACE(1 / 2),
      paddingLeft: SPACE(1 / 2),
      paddingBottom: SPACE(1 / 2)
    }}
    listsPrefixesRenderers={{
      ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return (
          <Text style={{
            color: COLORS.primary,
            fontSize: FONTSIZE(1.5),
            fontWeight: 'bold',
            marginRight: SPACE(1 / 5)
          }}>•</Text>
        );
      }
    }}
    onLinkPress={(evt, href, attr) => {
      Linking.canOpenURL(href)
        .then(() => Linking.openURL(href))
        .catch(err => console.log('Cannot open markdown link', err))
    }}
    alterNode={node => {
      if (node.name == 'img' && node.attribs.src[0] == '/') {
        return Object.assign(node, {
          attribs: {
            src: `https://${props.domain || "ruqqus.com"}${node.attribs.src}`,
          },
        });
      }
      return node;
    }} />);
}
