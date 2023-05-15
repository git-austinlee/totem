import * as React from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

export default function AddButton(props: any) {
  return <FAB icon="plus" onPress={() => console.log("pressed")} />;
}
