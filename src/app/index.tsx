import FabMenu from "@/src/components/FabMenu";
import TabBar from "@/src/components/TabBar";

import { Directory, Paths } from "expo-file-system";
import { useEffect } from "react";

import { Image, ScrollView, StyleSheet, View } from "react-native";

import FileSystemDumpButton, { dir } from "@/src/components/DummyComp";

import User from "@/src/components/User";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const Separator = () => <View style={styles.hr} />;

  useEffect(() => {
    new Directory(Paths.document, "userData").create({
      idempotent: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View className="user">
            <User />
          </View>

          <View style={styles.headerTopRight}>
            <Ionicons name="search" size={40} color="white" />

            <Image
              source={{
                uri: "https://i.pravatar.cc/100",
              }}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <TabBar />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.grid}>
          <View style={styles.mainColumn}>
            <FileSystemDumpButton root={dir(Paths.document, "userData")} title="Dump" />
          </View>
        </View>
      </ScrollView>

      <FabMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  hr: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
    marginVertical: 15,
  },

  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    backgroundColor: "#a2d5ab",
    padding: 20,
    paddingTop: 50,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  headerTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  search: {
    backgroundColor: "white",
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
  },

  contentContainer: {
    paddingBottom: 100,
  },

  grid: {
    width: "100%",
  },

  mainColumn: {
    width: "100%",
  },

  /*
   * IMPORTANT:
   * MyComponent needs a parent with an explicit height.
   */
  pdfContainer: {
    width: "100%",
    height: 70,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },

  gridCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
