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
  useLogin,
  TokenInterface,
} from '@react-ruqqus';
import {v4} from 'react-native-uuid';
import {useNavigation} from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Site {
  _id: string;
  clientID: string;
  domain: string;
  name: string;
}

interface Account extends TokenInterface {
  id: string;
  username: string;
  siteID: string;
}

export default function ROALogin(props: any) {
  const [connecting, setConnecting] = useState(false);
  const [siteID, setSiteID] = useState<string>();
  const style = useStyle();
  const theme = useTheme();
  const [accounts, setAccounts] = useValue<Account[]>('accounts');
  const [activeAccount, setActiveAccount] = useValue<string>('active-account');
  const {loading, sites, getAuthURL, refresh} = useAuthSites();
  const navigation = useNavigation();
  const login = useLogin();

  useOnWebviewClear((results) => {
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
          client_id: '',
          expires_at: 0,
        },
      ]);
    }
  });

  useEffect(() => {
    if (connecting) {
      let h = (e?: any) => {
        e?.preventDefault();
        setConnecting(false);
        return true;
      };

      navigation.addListener('beforeRemove', h);
      BackHandler.addEventListener('hardwareBackPress', h);
      return () => {
        navigation.removeListener('beforeRemove', h);
        BackHandler.removeEventListener('hardwareBackPress', h);
      };
    }
  }, [connecting, navigation]);

  const connectAccount = (id: string) => {
    setConnecting(true);
    getAuthURL(id);
    setSiteID(id);
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((x) => x.id !== id));
  };

  const pickAccount = (id: string) => {
    setActiveAccount(id);
    login(accounts.filter((x) => x.id === id)[0] as TokenInterface);
    navigation.navigate('Frontpage');
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
                      {activeAccount === account.id ? (
                        <Icon name="star" size={theme?.FontSize?.get?.(2)} />
                      ) : null}{' '}
                      @{account.username}
                    </Text>

                    <Button
                      text="Login"
                      style={{
                        marginRight: theme?.Space.get?.(1),
                      }}
                      onPress={() => pickAccount(account.id)}
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
