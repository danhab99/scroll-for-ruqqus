import React, { useEffect } from "react";
import { View } from "react-native";
import { useRuqqusClient } from "../react-ruqqus/useRuqqusClient";
import { useTheme, useStyle } from "@contexts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePost } from "react-ruqqus";
import _ from "lodash";
import AutoHeightWebView from "react-native-autoheight-webview";

interface HtmlMarkdownProps {
  html: string;
}

export default function HtmlMarkdown(props: HtmlMarkdownProps) {
  const client = useRuqqusClient();
  const theme = useTheme();
  const style = useStyle();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const post = usePost();

  useEffect(() => {
    if (post && post.id === "ad6u") {
      console.log("HTML TEST POST", props.html);
    }
  }, []);

  const CSS_STYLE = `
p, pre, li {
  color: ${theme?.Colors.text}
}

h1, h2, h3, h4, h5, h6 {
  color: ${theme?.Colors.text}
}

a {
  color: ${theme?.Colors.primary}
}

code {
  color: ${theme?.Colors.primary};
  backgroundColor: ${theme?.Colors.backgroundDark};
}

.profile-pic-20 {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  object-fit: cover;
  background-color: #1f2023
}

.in-comment-image {
  max-height: 100px!important;
  max-width: 100px!important
}
`;

  return (
    <View>
      <AutoHeightWebView
        source={{ html: props.html }}
        customStyle={CSS_STYLE}
      />
    </View>
  );
}
