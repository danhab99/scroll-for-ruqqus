import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Style, {COLORS, SPACE} from '../theme';
import Input from '../components/Input';
import {Button} from '../components/Buttons';
import {useNavigation} from '@react-navigation/core';

export default function Submit(props) {
  const navigation = useNavigation();

  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [board, setBoard] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submit = () => {
    setSubmitting(true);

    // client.submitPost(board, title, url, body).then((post) => {
    //   setSubmitting(false);
    //   navigation.navigate('Comments', {post});
    // });
  };

  const disabled = !(ready && [board, url, title, body].every((x) => x !== ''));

  return (
    <View style={Style.view}>
      <Input
        label="Board"
        onChangeText={(x: string) => setBoard(x)}
        autoCompleteType="off"
        autoCapitalize="none"
        value={board}
      />

      <Input label="Title" onChangeText={setTitle} value={title} />

      <Input
        label="URL"
        onChangeText={setUrl}
        autoCompleteType="off"
        autoCapitalize="none"
        value={url}
      />

      <Input label="Body" onChangeText={setBody} value={body} multiline />

      <Button
        disabled={disabled}
        text="Submit"
        style={{
          marginTop: SPACE(1),
        }}
        onPress={() => submit()}
      />

      {submitting ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : null}
    </View>
  );
}
