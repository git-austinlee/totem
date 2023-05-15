import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MyTabs from "./bottomNav/BottomNav";

/* stash code for selecting multiple items after long press
const [selectedItems, setSelectedItems] = useState<typeof ImageCard[]>([]);

  function selectItems(item) {
    if (selectedItems.includes(item.id)) {
      setSelectedItems((prevItems) => {
        return prevItems.filter((i) => {
          return i != item.id;
        });
      });
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  }

  function getSelected(item) {
    return selectedItems.includes(item.id);
  }

  function deselectItems() {
    setSelectedItems([]);
  }

  function handleOnPress(item) {
    if (selectedItems.length) {
      console.log(`handleOnPress::selectedItems: ${selectedItems}`);
      return selectItems(item);
    }
    console.log("onpress");
  }
*/

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <MyTabs />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#121212",
    flex: 1,
  },
});
