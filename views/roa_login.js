import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Linking, ScrollView, ActivityIndicator} from 'react-native';
import Style, {BODYTEXT, COLORS, FONTSIZE, SPACE} from '../theme';
import {LinkText} from '../components/LinkText';
import {Button, IconButton} from '../components/Buttons';
import {WebView} from 'react-native-webview';
import Collection, {Value} from '../asyncstorage';
import InitClient from '../init_client';
import {useNavigation} from '@react-navigation/core';

const CAPTURE_TOKENS = `
window.ReactNativeWebView.postMessage(document.body.innerText)
`;

export default function ROALogin(props) {
  const navigation = useNavigation();

  const [sites, setSites] = useState([]);
  const [connectTo, setConnectTo] = useState();
  const [connecting, setConnecting] = useState(false);
  const [logginIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const webViewRef = useRef();
  const tokenLock = useRef();

  const accounts = new Collection('accounts');
  const servers = new Collection('servers');

  const fetchSites = () => {
    setLoading(true);

    fetch('https://sfroa.danhab99.xyz/sites')
      .then((d) => d.json())
      .then((sites) =>
        Promise.all(
          sites.map((site) =>
            servers
              .findOne({_id: site._id})
              .then((server) => (server ? server : servers.create(site))),
          ),
        ),
      )
      .then((servers) =>
        Promise.all(
          servers.map((server) =>
            accounts.find({serverID: server._id}).then((accounts) => {
              server.accounts = accounts;
              return server;
            }),
          ),
        ),
      )
      .then((sites) => {
        setSites(sites);
        setLoading(false);
      });
  };

  useEffect(() => fetchSites(), []);

  const connectAccount = (id) => {
    fetch(`https://sfroa.danhab99.xyz/auth/${id}?state=${id}`, {
      redirect: 'manual',
    }).then(({url}) => {
      setConnectTo(url);
      setConnecting(sites.find((x) => x._id == id));
    });
  };

  const catchTokens = (msg) => {
    console.log('WEBVIEW', msg);
    let data = msg.nativeEvent.data;

    if (!tokenLock.current) {
      try {
        data = JSON.parse(data);

        if (data['access_token']) {
          console.log('TOKENS', data);
          tokenLock.current = true;

          setLoggingIn(true);

          InitClient({
            ...connecting,
            id: connecting._id,
            auth_domain: `sfroa.danhab99.xyz`,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          }).then((client) => {
            accounts.create({
              serverID: connecting._id,
              username: client.user.username,
              keys: {
                access: data.access_token,
                refresh: data.refresh_token,
              },
            });
            setLoggingIn(false);
            setConnecting(false);
            tokenLock.current = false;
            fetchSites();
          });
        }
      } catch (e) {
        console.error('UNABLE TO CATCH TOKEN', e);
      }
    }
  };

  const deleteAccount = (id) =>
    accounts.delete({_id: id}).then(() => fetchSites());

  const pickAccount = (id) => {
    Value.setValue('activeAccount', id).then(() => {
      navigation.navigate('Frontpage');
    });
  };

  if (connecting) {
    return (
      <WebView
        ref={webViewRef.current}
        source={{uri: connectTo}}
        injectedJavaScript={CAPTURE_TOKENS}
        injectJavaScript={CAPTURE_TOKENS}
        onMessage={(msg) => catchTokens(msg)}
        onNavigationStateChange={() => {
          webViewRef.current.injectJavaScript(CAPTURE_TOKENS);
        }}
        renderLoading={() => (
          <ActivityIndicator size="large" color={COLORS.primary} />
        )}
        startInLoadingState={true}
      />
    );
  } else if (loading) {
    return (
      <View style={Style.view}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  } else if (!loading && site?.length <= 0) {
    return (
      <View>
        <Text style={{...BODYTEXT, fontSize: FONTSIZE(2)}}>
          Error: No sites have been retrieved
        </Text>

        <Button text="Try again" onPress={() => fetchSites()} />
      </View>
    );
  } else {
    return (
      <ScrollView style={Style.view}>
        {loggingIn ? (
          <View>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        ) : null}

        {sites.map((site, i) => (
          <View key={`${i}`} style={Style.card}>
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONTSIZE(2),
                fontWeight: 'bold',
              }}>
              {site.domain}
            </Text>

            <View>
              {(site.accounts || []).map((account, i) => (
                <View
                  key={`${i}`}
                  style={{
                    marginTop: SPACE(1),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      margin: 'auto',
                      alignContent: 'center',
                      fontSize: FONTSIZE(1.5),
                      marginRight: SPACE(1),
                    }}>
                    @{account.username}
                  </Text>

                  <Button
                    text="Login"
                    style={{
                      marginRight: SPACE(1),
                    }}
                    onPress={() => pickAccount(account._id)}
                  />

                  <IconButton
                    icon="delete"
                    onPress={() => deleteAccount(account._id)}
                  />
                </View>
              ))}
            </View>

            <Button
              text="Connect an account"
              onPress={() => connectAccount(site._id)}
              style={{
                marginTop: SPACE(1),
              }}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}
