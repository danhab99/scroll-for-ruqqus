import React from 'react';
import {Image} from 'react-native';

export default class ScaledImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aspectRatio: 1,
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.url !== nextProps.url ||
      this.state.aspectRatio !== nextState.aspectRatio
    );
  }

  componentDidUpdate() {
    Image.getSize(
      this.props.url,
      (width, height) => {
        this.setState({
          aspectRatio: width / height,
        });
      },
      (err) => {
        console.log('Unable to get image size', this.props, err);
      },
    );
  }

  render() {
    return (
      <Image
        source={{uri: this.props.url}}
        style={{
          width: '100%',
          aspectRatio: this.state.aspectRatio,
        }}
        onLoad={() => {}}
      />
    );
  }
}
