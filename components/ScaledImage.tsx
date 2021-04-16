import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { writeFile } from "react-native-fs";
import { usePost } from "@react-ruqqus";

interface ScaledImageProps {
  url: string;
}

const ErrorImage = require("../assets/noimage.jpg");

export default function ScaledImage(props: ScaledImageProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [source, setSource] = useState<any>();
  const post = usePost();

  var realUrl = "";

  if (props?.url?.length > 0) {
    realUrl = props?.url;
  } else if (post?.url?.length > 0) {
    realUrl = post?.url;
  } else if (post?.thumb_url?.length > 0) {
    realUrl = post?.thumb_url;
  } else {
    console.warn("Unable to get image", props, post);
  }

  const getImageSize = () => {
    Image.getSize(
      realUrl,
      (width, height) => {
        setAspectRatio(width / height);
        setSource({ uri: realUrl });
      },
      (err) => {
        console.log("Unable to get image size", props, err, post);
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
        width: "100%",
        aspectRatio: aspectRatio,
        height: null,
        resizeMode: "contain",
      }}
      onLoad={() => {}}
    />
  );
}
