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

  const getImageSize = () => {
    Image.getSize(
      props.url,
      (width, height) => {
        setAspectRatio(width / height);
      },
      (err) => {
        console.log("Unable to get image size", props, err, post);
      },
    );
  };

  useEffect(() => {
    getImageSize();
  }, []);

  return (
    <Image
      source={props.url ? { uri: props.url } : ErrorImage}
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
