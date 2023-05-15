import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getImageList,
  setImageOrder,
  updateImageBrightness,
  updateImageDuration,
  updateImageOptions,
  updateImageVisible,
} from "../../services/imageService";
import { ImageType } from "../../utils/types";
import AppBar from "../appBar/AppBar";
import ImageItem from "../images/ImageItem";
import ImageOptions from "../images/ImageOptions";

export default function MainScreen(props: any) {
  const [data, setData] = useState<ImageType[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [viewImage, setViewImage] = useState<ImageType>({
    _id: "",
    title: "",
    visible: false,
    duration: 0,
    brightness: 0,
    current: false,
  });
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    const fetchImageList = async () => {
      const images = await getImageList();
      setData(images);
    };
    fetchImageList();
  }, []);

  function toggleViewMode() {
    viewMode === "card" ? setViewMode("list") : setViewMode("card");
  }

  function handleOnPress(item) {
    setViewImage(item);
    setDialogVisible(true);
  }

  async function handleOnDragEnd(images) {
    setData(images);
    let idArray: string[] = [];
    images.forEach((image: ImageType) => {
      idArray.push(image._id);
    });
    setImageOrder(idArray);
    const newOrder = await getImageList();
    setData(newOrder);
  }

  async function updateDuration(id: string, duration: number) {
    viewImage.duration = duration;
    setViewImage(viewImage);
    const response = await updateImageOptions(id, duration);
    if (response) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i]._id === id) {
          data[i] = response;
        }
        break;
      }
      setData([...data]);
      let view: any = data.find((image) => image._id === id);
      setViewImage(view);
    }
  }

  async function updateBrightness(id: string, brightness: number) {
    viewImage.brightness = brightness;
    setViewImage(viewImage);
    const response = await updateImageOptions(id, brightness);
    if (response) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i]._id === id) {
          data[i] = response;
        }
        break;
      }
      setData([...data]);
      console.log(`data: ${data}`);
      let view: any = data.find((image) => image._id === id);
      setViewImage(view);
    }
  }

  async function updateVisible(id: string, visible: boolean) {
    viewImage.visible = visible;
    setViewImage(viewImage);
    const response = await updateImageVisible(id, visible);
    if (response) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i]._id === id) {
          data[i] = response;
        }
        break;
      }
      setData([...data]);
      let view: any = data.find((image) => image._id === id);
      setViewImage(view);
    }
  }

  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        onPress={() => handleOnPress(item)}
        disabled={isActive}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <ImageItem
          key={item._id}
          id={item._id}
          title={item.title}
          path={item.path}
          visible={item.visible}
          viewMode={viewMode}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <SafeAreaView style={styles.root}>
      <AppBar onPress={toggleViewMode} nextView={viewMode} />
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onDragEnd={({ data }) => handleOnDragEnd(data)}
          autoscrollSpeed={200}
        />
      </View>

      <ImageOptions
        dialogVisible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
        }}
        updateImage={() => {}}
        viewImage={viewImage}
        onBrightnessChange={updateBrightness}
        onDurationChange={updateDuration}
        onVisibleToggle={updateVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
