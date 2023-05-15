import { View } from "react-native";
import { Drawer, List } from "react-native-paper";

export default function DrawerContent(props) {
  return (
    <View>
      <Drawer.Section title="System settings">
        <Drawer.Item label="Enable/Disable script" />
        <Drawer.Item label="Default settings" />
        <Drawer.Item label="Change image order" />
        <Drawer.Item label="Find me" />
      </Drawer.Section>
    </View>
  );
}
