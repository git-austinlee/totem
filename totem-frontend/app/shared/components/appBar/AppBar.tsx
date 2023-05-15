import * as React from "react";
import { Appbar } from "react-native-paper";

export default function AppBar(props: any) {
  let icon: string = props.nextView === "card" ? "view-list" : "view-agenda";
  return (
    <Appbar.Header mode="center-aligned" statusBarHeight={0}>
      <Appbar.Content title="LED Totem" />
      <Appbar.Action icon={icon} onPress={() => props.onPress()} />
    </Appbar.Header>
  );
}
