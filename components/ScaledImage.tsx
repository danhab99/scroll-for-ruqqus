import React, { useState, useEffect } from "react";
import { Modal, Image, View, Pressable, Dimensions } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

interface ScaledImageProps {
  url: string;
  scalable: boolean;
}

const ErrorImage = require("../assets/noimage.jpg");

export default function ScaledImage(props: ScaledImageProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

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
  }, [props.url]);

  const source = props.url ? { uri: props.url } : ErrorImage;

  const component = (
    <Image
      source={source}
      style={{
        width: "100%",
        aspectRatio: aspectRatio,
        height: null,
        resizeMode: "contain",
      }}
    />
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
          }}>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
            imageWidth={Dimensions.get("window").width}
            imageHeight={Dimensions.get("window").width / aspectRatio}
            onClick={() => setModalVisible(false)}
            onSwipeDown={() => setModalVisible(false)}
            enableSwipeDown
            enableDoubleClickZoom>
            {component}
          </ImageZoom>
        </View>
      </Modal>

      {props.scalable ? (
        <Pressable onPress={() => setModalVisible(true)}>{component}</Pressable>
      ) : (
        component
      )}
    </View>
  );
}
