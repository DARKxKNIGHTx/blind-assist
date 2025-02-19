import React, { useState, useRef, useEffect } from "react";
import { View, Text, Animated, PanResponder, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";

const DragCircle = () => {
  const [activeMode, setActiveMode] = useState<string | null>("Blind Assistance");
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastMode = useRef<string | null>(null);
  const dragStarted = useRef(false);

  useEffect(() => {
    speak("Blind Assistance");
  }, []);

  const speak = (text: string) => {
    Speech.speak(text, { language: "en-US", pitch: 1.0, rate: 1.0 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!dragStarted.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          dragStarted.current = true;
        }

        Animated.timing(position, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });

        let selectedMode = null;
        if (gesture.dy < -50) {
          selectedMode = "Face Recognition Mode";
        } else if (gesture.dx > 50) {
          selectedMode = "Book Reading Mode";
        } else if (gesture.dy > 50) {
          selectedMode = "Object Detection Mode";
        } else if (gesture.dx < -50) {
          selectedMode = "Privacy Mode";
        }

        if (selectedMode && lastMode.current !== selectedMode) {
          setActiveMode(selectedMode);
          lastMode.current = selectedMode;
          speak(`${selectedMode}`);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      },
      onPanResponderRelease: () => {
        if (lastMode.current) {
          speak(`${lastMode.current} selected`);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        dragStarted.current = false;

        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 24, position: "absolute", top: 50 }}>{activeMode}</Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          width: 120,
          height: 120,
          backgroundColor: activeMode !== "Blind Assistance" ? "white" : "gray",
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateX: position.x }, { translateY: position.y }],
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "black" }}>Hold</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DragCircle;
