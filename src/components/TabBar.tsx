import { Directory, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import SavedDocuments from "./DocumentSection";

const TABS = [
  {
    key: "userData",
    label: "userData",
    preview: "userData",
  },
  {
    key: "cache",
    label: "cache",
    preview: "cache",
  },
] as const;

export default function TabBar() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
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

  // const selectTab = (index: string) => {
  //   router.replace({
  //     pathname: "/tabs/[id]",
  //     params: {
  //       id: index,
  //     },
  //   });
  //   console.log(index);
  // };
  const selectTab = useCallback(
    (index: number) => {
      setActiveIndex(index);
      moveIndicator(index);
      pagerRef.current?.setPage(index);
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

  const onPageSelected = useCallback(
    (index: number) => {
      setActiveIndex(index);
      moveIndicator(index);
    },
    [moveIndicator],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {TABS.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <Pressable
              key={tab.key}
              style={styles.tab}
              // onPress={() => selectTab(JSON.stringify(tab))}
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

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(event) => onPageSelected(event.nativeEvent.position)}
      >
        {TABS.map((tab) => (
          <View key={tab.key} style={styles.page}>
            <Text style={styles.preview}>{tab.preview}</Text>
            <SavedDocuments
              directory={new Directory(Paths.document, "userData")}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    gap: 10,
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "rgba(255, 115, 0, 0.92)",
    borderRadius: 14,
    padding: 4,
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
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
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
  },
  tabLabelActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
  pager: {
    height: 28,
  },
  page: {
    flex: 1,
    justifyContent: "center",
  },
  preview: {
    color: "rgba(0, 0, 0, 0.92)",
    fontSize: 13,
    fontWeight: "500",
  },
});
