import { useEffect } from "react";
import { useValue } from "@contexts";
import { useNavigation } from "@react-navigation/core";
import * as _ from "lodash";
import { StackNavigationProp } from "@react-navigation/stack";

export function useEnforceLogin() {
  const [activeAccount] = useValue<string>("active-account");
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    let h = () => {
      if (_.isEmpty(activeAccount)) {
        navigation.navigate("Login");
      }
    };

    navigation.addListener("focus", h);
    return () => navigation.removeListener("focus", h);
  }, [activeAccount]);
}
