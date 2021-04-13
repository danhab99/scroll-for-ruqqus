import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '@contexts';
import {IconButton} from 'components/Buttons';

interface LoadingControlProps {
  name: string;
  onPress: (cb: () => any) => Promise<any>;
  highlighted: boolean;
}
export function LoadingControl(props: LoadingControlProps) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const press = () => {
    setLoading(true);

    let cb = () => {
      setLoading(false);
    };

    Promise.resolve(props.onPress(cb)).then(cb);
  };

  return loading ? (
    <ActivityIndicator color={theme?.Colors.primary} size="small" />
  ) : (
    <IconButton
      onPress={() => {
        press();
      }}
      name={props.name}
      color={props.highlighted ? theme?.Colors.primary : theme?.Colors.text}
    />
  );
}
