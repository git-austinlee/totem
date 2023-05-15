import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FindMeScreen(props: any) {
  return <SafeAreaView style={styles.root}></SafeAreaView>;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#121212",
    flex: 1,
  },
});
