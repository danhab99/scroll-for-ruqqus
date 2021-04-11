import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Input from '../components/Input';
import {Button} from '../components/Buttons';
import {useTheme, useStyle} from '@contexts';

export default function Submit() {
  const theme = useTheme();
  const style = useStyle();

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
    <View style={style?.view}>
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
          marginTop: theme?.Space.get?.(1),
        }}
        onPress={() => submit()}
      />

      {submitting ? (
        <ActivityIndicator size="large" color={theme?.Colors?.primary} />
      ) : null}
    </View>
  );
}
