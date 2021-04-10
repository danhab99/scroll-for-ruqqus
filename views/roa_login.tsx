import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Linking, ScrollView, ActivityIndicator} from 'react-native';
import {Button, IconButton} from '../components/Buttons';
import {useSetValue, useStyle, useTheme} from '@contexts';
import {
  AuthSiteWebview,
  useAuthSites,
  useIdentity,
  useOnWebviewClear,
} from '@react-ruqqus';
import {useValue} from '@contexts';

interface Site {
  _id: string;
  clientID: string;
  domain: string;
  name: string;
}

interface Account {
  username: string;
  access_token: string;
  refresh_token: string;
  siteID: string;
}

export default function ROALogin() {
  const style = useStyle();
  const theme = useTheme();
  const accounts = useValue<Account[]>('accounts');
  const setAccounts = useSetValue<Account[]>('accounts');
  const {loading, sites, getAuthURL} = useAuthSites();
  const {body: identity, resp} = useIdentity();

  const [connecting, setConnecting] = useState(false);
  const [siteID, setSiteID] = useState<string>();
  const [newTokens, setNewTokens] = useState<any>();

  const connectAccount = (id: string) => {
    setConnecting(true);
    getAuthURL(id);
    setSiteID(id);
  };

  useOnWebviewClear((user) => {
    console.log(user);
    setConnecting(false);
    setNewTokens(user);
  });

  useEffect(() => {
    if (newTokens && identity && siteID && resp) {
      if (resp.ok) {
        debugger;
        setAccounts((accounts = []) => [
          ...accounts,
          {
            ...newTokens,
            siteID,
            username: identity.username,
          },
        ]);
      }
    }
  }, [newTokens, identity, siteID, resp]);

  useEffect(() => console.log('ACCOUNTS', accounts), [accounts]);

  if (loading) {
    <View style={style?.view}>
      <ActivityIndicator color={theme?.Colors.primary} size="large" />;
    </View>;
  } else if (connecting) {
    return <AuthSiteWebview />;
  } else {
    return (
      <ScrollView style={style?.view}>
        {sites?.map((site: Site, i: number) => (
          <View key={`${i}`} style={style?.card}>
            <Text
              style={{
                color: theme?.Colors?.text,
                fontSize: theme?.FontSize.get?.(2),
                fontWeight: 'bold',
              }}>
              {site.domain}
            </Text>

            <View>
              {(Array.isArray(accounts) ? accounts : [])
                .filter((x) => x.siteID === site._id)
                .map((account, i) => (
                  <View
                    key={`${i}`}
                    style={{
                      marginTop: theme?.Space.get?.(1),
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: theme?.Colors.text,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: 'auto',
                        alignContent: 'center',
                        fontSize: theme?.FontSize.get?.(1.5),
                        marginRight: theme?.Space.get?.(1),
                      }}>
                      @{account.username}
                    </Text>

                    <Button
                      text="Login"
                      style={{
                        marginRight: theme?.Space.get?.(1),
                      }}
                      // onPress={() => pickAccount(account._id)}
                    />

                    <IconButton
                      name="delete"
                      // onPress={() => deleteAccount(account._id)}
                    />
                  </View>
                ))}
            </View>

            <Button
              text="Connect an account"
              onPress={() => connectAccount(site._id)}
              style={{
                marginTop: theme?.Space.get?.(1),
              }}
            />
          </View>
        ))}
      </ScrollView>
    );
  }

  return <View></View>;
}
