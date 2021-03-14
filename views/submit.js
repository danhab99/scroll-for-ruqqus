import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import InitClient from '../init_client';
import Style, {COLORS, SPACE} from '../theme';
import Input from '../components/Input';
import {Button} from '../components/Buttons';
import {useRuqqusClient} from '../components/ruqqus-client';
import {useNavigation} from '@react-navigation/core';

export default function Submit(props) {
  const client = useRuqqusClient();
  const navigation = useNavigation();

  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState();
  const [board, setBoard] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submit = () => {
    setSubmitting(true);

    client.submitPost(board, title, url, body).then((post) => {
      setSubmitting(false);
      navigation.navigate('Comments', {post});
    });
  };

  const disabled = !(
    this.state.ready && Object.values(this.state.form).every((x) => x !== '')
  );

  return (
    <View style={Style.view}>
      <Input
        label="Board"
        onChangeText={this.onChange('board')}
        autoCompleteType="off"
        autoCapitalize="none"
        value={this.state.form.board}
      />

      <Input
        label="Title"
        onChangeText={this.onChange('title')}
        value={this.state.form.title}
      />

      <Input
        label="URL"
        onChangeText={this.onChange('url')}
        autoCompleteType="off"
        autoCapitalize="none"
        value={this.state.form.url}
      />

      <Input
        label="Body"
        onChangeText={this.onChange('body')}
        value={this.state.form.body}
        multiline
      />

      <Button
        disabled={this.disabled}
        text="Submit"
        style={{
          marginTop: SPACE(1),
        }}
        onPress={() => this.submit()}
      />

      {this.state.submitting ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : null}
    </View>
  );
}
