import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {writeFile} from 'react-native-fs';

interface ScaledImageProps {
  url: string;
}

const ErrorImage = require('../assets/noimage.jpg');

export default function ScaledImage(props: ScaledImageProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [source, setSource] = useState<any>();

  const getImageSize = () => {
    Image.getSize(
      props.url,
      (width, height) => {
        setAspectRatio(width / height);
        setSource({uri: props.url});
      },
      (err) => {
        console.log('Unable to get image size', props, err);
        // debugger;
        setSource(ErrorImage);
      },
    );
  };

  useEffect(() => {
    getImageSize();
  }, []);

  return (
    <Image
      source={source}
      style={{
        width: '100%',
        aspectRatio: aspectRatio,
        height: null,
        resizeMode: 'contain',
      }}
      onLoad={() => {}}
    />
  );
}
