import { Directory, Paths } from "expo-file-system";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import DocumentSection from "@/src/components/DocumentSection";
import { useUsers } from "@/src/components/User";

export default function TabBar() {
  const { currentUser, foldersVersion } = useUsers();
  const [tabs, setTabs] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  useEffect(() => {
    if (!currentUser) {
      setTabs([]);
      setCurrentTab("");
      setActiveIndex(0);
      tabLayouts.current = [];
      return;
    }

    const entries = new Directory(Paths.document, "userData", currentUser).list();

    const nextTabs = entries.filter((entry) => entry instanceof Directory).map((folder) => folder.name);

    setTabs((previousTabs) => {
      const sameTabs = previousTabs.length === nextTabs.length && previousTabs.every((tab, index) => tab === nextTabs[index]);

      return sameTabs ? previousTabs : nextTabs;
    });

    setCurrentTab((previousTab) => {
      if (previousTab && nextTabs.includes(previousTab)) {
        return previousTab;
      }

      const nextCurrentTab = nextTabs[0] ?? "";
      return nextCurrentTab === previousTab ? previousTab : nextCurrentTab;
    });
    tabLayouts.current = [];
  }, [currentUser, foldersVersion]);

  useEffect(() => {
    const index = tabs.indexOf(currentTab);
    if (index >= 0) {
      setActiveIndex(index);
    }
  }, [tabs, currentTab]);

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
            <Pressable key={tab} style={styles.tab} onPress={() => selectTab(index, tab)} onLayout={(event) => onTabLayout(index, event)}>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>
      {/**Here's the Connection to all documents view via  activeTab.key */}
      <View style={styles.content}>{currentUser && currentTab ? <DocumentSection user={currentUser} category={currentTab} /> : null}</View>
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
    padding: 4,
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    backgroundColor: "#39AEA9",
    borderRadius: 9,
    boxShadow: "0px 2px 4px rgba(30, 64, 175, 0.2)",
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
