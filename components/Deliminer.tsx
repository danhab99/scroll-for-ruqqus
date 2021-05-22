import React from "react";
import { useStyle } from "@contexts";
import TextBox from "components/TextBox";

export function Deliminer() {
  const style = useStyle();
  return <TextBox style={style?.headBullet}>{" • "}</TextBox>;
}
