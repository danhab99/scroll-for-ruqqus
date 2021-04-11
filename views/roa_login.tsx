import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  BackHandler,
} from 'react-native';
import {Button, IconButton} from '../components/Buttons';
import {useValue, useStyle, useTheme} from '@contexts';
import {
  AuthSiteWebview,
  useAuthSites,
  useIdentity,
  useOnWebviewClear,
} from '@react-ruqqus';
import {v4} from 'react-native-uuid';
import {useValue} from '@contexts';

interface Site {
  _id: string;
  clientID: string;
  domain: string;
  name: string;
}

interface Account {
  id: string;
  username: string;
  access_token: string;
  refresh_token: string;
  siteID: string;
}

export default function ROALogin(props: any) {
  const [connecting, setConnecting] = useState(false);
  const [siteID, setSiteID] = useState<string>();
  const [newTokens, setNewTokens] = useState<any>();

  const style = useStyle();
  const theme = useTheme();
  const [accounts, setAccounts] = useValue<Account[]>('accounts');
  const {loading, sites, getAuthURL, refresh} = useAuthSites();

  useOnWebviewClear((results) => {
    console.log(results);
    setConnecting(false);

    if (siteID) {
      setAccounts((accounts = []) => [
        ...accounts,
        {
          id: v4(),
          siteID,
          access_token: results.access_token,
          refresh_token: results.refresh_token,
          username: results.user.username,
        },
      ]);
    }
  });

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((x) => x.id !== id));
  };

  if (connecting) {
    return <AuthSiteWebview />;
  } else {
    return (
      <ScrollView
        style={style?.view}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => refresh()} />
        }>
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
                      name="trash"
                      onPress={() => deleteAccount(account.id)}
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
