import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {writeFile} from 'react-native-fs';

interface ScaledImageProps {
  url: string;
}

export default function ScaledImage(props: ScaledImageProps) {
  const [aspectRatio, setAspectRatio] = useState(1);

  const getImageSize = () => {
    Image.getSize(
      props.url,
      (width, height) => {
        setAspectRatio(width / height);
      },
      (err) => {
        console.log('Unable to get image size', props, err);
      },
    );
  };

  useEffect(() => {
    getImageSize();
  }, []);

  // TODO: Determine if this logic is necessesary
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.props.url !== nextProps.url ||
  //     this.state.aspectRatio !== nextState.aspectRatio
  //   );
  // }

  return (
    <Image
      source={{uri: props.url}}
      style={{
        width: '100%',
        aspectRatio: aspectRatio,
      }}
      onLoad={() => {}}
    />
  );
}
