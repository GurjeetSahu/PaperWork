import { Directory, Paths } from "expo-file-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import SavedDocuments from "./DocumentSection";

const TABS = [
  { key: "userData", label: "My Documents" },
  { key: "cache", label: "Cache" },
] as const;

export default function TabBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  useEffect(() => {
    TABS.forEach((tab) => {
      new Directory(Paths.document, tab.key).create({ idempotent: true });
    });
  }, []);

  const moveIndicator = useCallback(
    (index: number) => {
      const layout = tabLayouts.current[index];
      if (!layout) return;

      indicatorX.value = withSpring(layout.x);
      indicatorWidth.value = withSpring(layout.width);
    },
    [indicatorX, indicatorWidth],
  );

  const selectTab = useCallback(
    (index: number) => {
      setActiveIndex(index);
      moveIndicator(index);
    },
    [moveIndicator],
  );

  const onTabLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      tabLayouts.current[index] = { x, width };

      if (index === activeIndex) {
        indicatorX.value = x;
        indicatorWidth.value = width;
      }
    },
    [activeIndex, indicatorX, indicatorWidth],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const activeTab = TABS[activeIndex];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Saved Documents</Text>

      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {TABS.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <Pressable
              key={tab.key}
              style={styles.tab}
              onPress={() => selectTab(index)}
              onLayout={(event) => onTabLayout(index, event)}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.content}>
        <SavedDocuments
          key={activeTab.key}
          directory={new Directory(Paths.document, activeTab.key)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 4,
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    backgroundColor: "#2563eb",
    borderRadius: 9,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  content: {
    minHeight: 120,
  },
});
