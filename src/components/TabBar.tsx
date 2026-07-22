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

import DocumentSection from "@/src/components/DocumentSection";
import { useUsers } from "@/src/components/User";

export default function TabBar() {
  const { currentUser } = useUsers();
  useEffect(() => {
    //console.log("Loading Tabs Of Current User: ", currentUser);
    const loadTabs = async () => {
      const entries = new Directory(
        Paths.document,
        "userData",
        currentUser,
      ).list();

      setTabs(
        entries
          .filter((entry) => entry instanceof Directory)
          .map((folder) => folder.name),
      );
    };

    loadTabs();
  }, [currentUser]);
  const [tabs, setTabs] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

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
    (index: number, tabName: string) => {
      setCurrentTab(tabName);
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
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <Pressable
              key={tab}
              style={styles.tab}
              onPress={() => selectTab(index, tab)}
              onLayout={(event) => onTabLayout(index, event)}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {/**Here's the Connection to all documents view via  activeTab.key */}
      <View style={styles.content}>
        <DocumentSection
          directory={new Directory(Paths.document, "userData", currentTab)}
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
