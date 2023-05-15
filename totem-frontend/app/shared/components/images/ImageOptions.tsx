import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { DataTable, Dialog, Portal, Switch } from "react-native-paper";

import Slider from "@react-native-community/slider";

import { updateImageOptions } from "../../services/imageService";

export default function ImageOptions(props) {
  function onVisibleToggle() {
    props.onVisibleToggle(props.viewImage._id, !props.viewImage.visible);
  }

  function onDurationChange(value) {
    props.onDurationChange(props.viewImage._id, value);
  }

  function onBrightnessChange(value) {
    props.onBrightnessChange(props.viewImage._id, value);
  }

  return (
    <Portal>
      <Dialog
        visible={props.dialogVisible}
        onDismiss={props.onDismiss}
        style={styles.container}
      >
        <Dialog.Content>
          <DataTable>
            <DataTable.Row style={styles.row}>
              <DataTable.Cell style={styles.optionDescription}>
                Brightness
              </DataTable.Cell>
              <DataTable.Cell style={styles.optionValue}>
                {props.viewImage.brightness}
              </DataTable.Cell>
              <DataTable.Cell style={styles.optionAction}>
                <Slider
                  style={{ width: 80 }}
                  minimumValue={1}
                  maximumValue={100}
                  step={10}
                  value={props.viewImage.brightness}
                  maximumTrackTintColor="white"
                  onValueChange={(data) => onBrightnessChange(data)}
                />
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row style={styles.row}>
              <DataTable.Cell style={styles.optionDescription}>
                Time (sec)
              </DataTable.Cell>
              <DataTable.Cell style={styles.optionValue}>
                {props.viewImage.duration}
              </DataTable.Cell>
              <DataTable.Cell style={styles.optionAction}>
                <Slider
                  style={{ width: 80 }}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={props.viewImage.duration}
                  maximumTrackTintColor="white"
                  onValueChange={(data) => onDurationChange(data)}
                />
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row style={styles.row}>
              <DataTable.Cell>Visible</DataTable.Cell>
              <DataTable.Cell> </DataTable.Cell>
              <DataTable.Cell style={styles.optionAction}>
                <Switch
                  value={props.viewImage.visible}
                  onValueChange={() => onVisibleToggle()}
                />
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    width: "90%",
    bottom: 0,
  },
  row: {
    borderBottomWidth: 0,
  },
  optionDescription: {},
  optionValue: {
    justifyContent: "center",
  },
  optionAction: {
    flex: 1,
    justifyContent: "center",
  },
});
