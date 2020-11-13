import React from 'react';
import { Image } from 'react-native';

export default class ScaledImage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      source: {
        uri: this.props.uri
      },
      aspectRatio: 1
    };
  }

  componentDidMount() {
    Image.getSize(this.props.url, (width, height) => {
      this.setState({
        aspectRatio: width / height
      });
    });
  }

  render() {
    return (
      <Image
        source={{ uri: this.props.url }}
        style={{
          width: '100%',
          aspectRatio: this.state.aspectRatio
        }} />
    );
  }
}
