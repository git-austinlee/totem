import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer, List, Switch } from "react-native-paper";

export default function SettingsScreen(props: any) {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const toggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <SafeAreaView style={styles.root}>
      <List.Section title="Settings">
        <List.Item
          title="Enable/Disable script"
          right={(props) => (
            <Switch value={isSwitchOn} onValueChange={toggleSwitch} />
          )}
        />
        <List.Item title="Default settings" />
        <List.Item title="Change image order" />
        <List.Item title="Find me" />
      </List.Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#121212",
    flex: 1,
  },
});
