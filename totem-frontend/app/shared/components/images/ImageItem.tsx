import * as React from "react";
import { StyleSheet } from "react-native";
import { Card, List, MD3Colors } from "react-native-paper";

import { localhost } from "../../utils/utils";

export default function ImageItem(props) {
  let viewMode: string = props.viewMode;

  if (viewMode === "card") {
    return (
      <Card
        style={[
          styles.card,
          props.visible ? styles.notSelected : styles.disabled,
        ]}
        onLongPress={props.onLongPress}
      >
        <Card.Cover source={{ uri: `${localhost}/images/${props.title}` }} />
        <Card.Content>
          <Card.Title title={props.title} titleNumberOfLines={1} />
        </Card.Content>
      </Card>
    );
  } else {
    return (
      <List.Item
        title={props.title}
        onLongPress={props.onLongPress}
        style={[
          styles.list,
          props.visible ? styles.notSelected : styles.disabled,
        ]}
        right={(props) => <List.Icon {...props} icon="menu" />}
      />
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
  },
  list: {
    borderWidth: 2,
    margin: 2,
    borderRadius: 4,
    borderColor: "#696969",
  },
  selected: {
    opacity: 0.7,
    backgroundColor: MD3Colors.primary90,
  },
  notSelected: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.2,
  },
});
