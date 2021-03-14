import React from 'react';
import {ActivityIndicator, RefreshControl, View} from 'react-native';
import WebView from 'react-native-webview';
import Style, {COLORS, SPACE} from '../theme';
// import Postcard from '../components/Postcard'
// import Style from '../theme'

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  // componentDidMount() {
  //   console.log('POST CLIENT', this.props.route.params.post.client)
  //   this.props.route.params.post.client.APIRequest({ type: "GET", path: `front/comments` }).then(d => console.log('TEST COMMENTS', d))
  // }

  render() {
    return (
      <WebView
        style={Style.view}
        source={{
          uri: `https://${this.props.route.params.post.client.domain}/post/${this.props.route.params.post.id}`,
        }}
        renderLoading={() => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              padding: SPACE(1),
            }}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        )}
        javaScriptEnabled
        startInLoadingState
        domStorageEnabled
      />
    );
    // return  (
    //   <ScrollView style={Style.view}>
    //     <Postcard post={this.props.route.params.post} />
    //   </ScrollView>
    // )
  }
}
