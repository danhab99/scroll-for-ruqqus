import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  BackHandler,
} from "react-native";
import { Button, IconButton } from "../components/Buttons";
import {
  useValue,
  useStyle,
  useTheme,
  IRealmAccount,
  useCreator,
  useFilter,
  useDestroyer,
  useGetter,
} from "@contexts";
import {
  AuthSiteWebview,
  useAuthSites,
  useOnWebviewClear,
  useLogin,
  TokenInterface,
} from "@react-ruqqus";
import { v4 } from "react-native-uuid";
import { useNavigation } from "@react-navigation/core";
import Icon from "react-native-vector-icons/FontAwesome";
import * as _ from "lodash";
import { StackNavigationProp } from "@react-navigation/stack";

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

const ConnectAccountContext = createContext<(id: string) => void>(
  (id: string) => {},
);

const PickAccountContext = createContext<(id: string) => void>(
  (id: string) => {},
);

function SiteAccounts(props: { site: Site }) {
  const style = useStyle();
  const theme = useTheme();
  const [activeAccount, setActiveAccount] = useValue<string>("active-account");
  const accounts = useFilter<IRealmAccount>(
    "account",
    `siteID == "${props.site._id}"`,
  );
  const deleter = useDestroyer<IRealmAccount>("account");
  const connectAccount = useContext(ConnectAccountContext);
  const pickAccount = useContext(PickAccountContext);

  return (
    <View style={[style?.card, { marginBottom: theme?.Space.get?.(1) }]}>
      <View style={{ padding: theme?.Space.get?.(1) }}>
        <Text
          style={{
            color: theme?.Colors?.text,
            fontSize: theme?.FontSize.get?.(2),
            fontWeight: "bold",
          }}>
          {props.site.domain}
        </Text>

        <View>
          {accounts
            ?.filter((x) => x.siteID === props.site._id)
            .map((account, i) => (
              <View
                key={`${i}`}
                style={{
                  marginTop: theme?.Space.get?.(1),
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    color: theme?.Colors.text,
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: "auto",
                    alignContent: "center",
                    fontSize: theme?.FontSize.get?.(1.5),
                    marginRight: theme?.Space.get?.(1),
                  }}>
                  {activeAccount === account._id ? (
                    <Icon name="star" size={theme?.FontSize?.get?.(2)} />
                  ) : null}{" "}
                  @{account.username}
                </Text>

                <Button
                  text="Login"
                  style={{
                    marginRight: theme?.Space.get?.(1),
                  }}
                  onPress={() => pickAccount(account._id)}
                />

                <IconButton
                  name="delete"
                  onPress={() => deleter(`_id == "${account._id}"`)}
                />
              </View>
            ))}
        </View>

        <Button
          text="Connect an account"
          onPress={() => connectAccount(props.site._id)}
          style={{
            marginTop: theme?.Space.get?.(1),
          }}
        />
      </View>
    </View>
  );
}

export default function ROALogin(props: any) {
  const [connecting, setConnecting] = useState(false);
  const [siteID, setSiteID] = useState<string>();
  const style = useStyle();
  const createAccount = useCreator<IRealmAccount>("account");
  const accounts = useGetter<IRealmAccount>("account");

  const [activeAccount, setActiveAccount] = useValue<string>("active-account");
  const { loading, sites, getAuthURL, refresh } = useAuthSites();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const login = useLogin();

  useOnWebviewClear((results) => {
    setConnecting(false);

    if (siteID) {
      let newAccount = {
        siteID,
        access_token: results.access_token,
        refresh_token: results.refresh_token,
        username: results.user.username,
        client_id: sites.filter((site) => site._id === siteID)[0].clientID,
        expires_at: results.expires_at,
      };
      createAccount(newAccount);
    }
  });

  useEffect(() => {
    if (connecting) {
      let h = (e?: any) => {
        e?.preventDefault();
        setConnecting(false);
        return true;
      };

      navigation.addListener("beforeRemove", h);
      BackHandler.addEventListener("hardwareBackPress", h);
      return () => {
        navigation.removeListener("beforeRemove", h);
        BackHandler.removeEventListener("hardwareBackPress", h);
      };
    }
  }, [connecting, navigation]);

  const pickAccount = (id: string) => {
    if (accounts) {
      let account: TokenInterface = accounts
        .filter((x) => x._id === id)[0]
        .toJSON();

      if (account) {
        login(account);
        setActiveAccount(id);
        navigation.navigate("Frontpage");
      } else {
        setActiveAccount("");
      }
    }
  };

  const connectAccount = (id: string) => {
    setConnecting(true);
    getAuthURL(id);
    setSiteID(id);
  };

  useEffect(() => {
    if (!_.isEmpty(activeAccount)) {
      pickAccount(activeAccount);
    }
  }, [activeAccount]);

  if (connecting) {
    return <AuthSiteWebview />;
  } else {
    return (
      <PickAccountContext.Provider value={pickAccount}>
        <ConnectAccountContext.Provider value={connectAccount}>
          <ScrollView
            style={style?.view}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refresh()}
              />
            }>
            {sites?.map?.((site: Site, i: number) => (
              <SiteAccounts site={site} key={i} />
            ))}
          </ScrollView>
        </ConnectAccountContext.Provider>
      </PickAccountContext.Provider>
    );
  }
}
