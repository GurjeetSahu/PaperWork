import FabMenu from "@/src/components/FabMenu";
import TabBar from "@/src/components/TabBar";

import { Directory, Paths } from "expo-file-system";
import { useEffect } from "react";
import { Button, Image, ScrollView, StyleSheet, View } from "react-native";

import FileSystemDumpButton, { dir } from "@/src/components/DummyComp";
import User from "@/src/components/User";
import { Ionicons } from "@expo/vector-icons";

import MyComponent from "@/src/components/WebC";

export default function HomeScreen() {
  const Separator = () => <View style={styles.hr} />;
  useEffect(() => {
    new Directory(Paths.document, "userData").create({ idempotent: true });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View className="user">
            <User />
          </View>
          <View style={styles.headerTopRight}>
            <Ionicons name="search" size={40} color="white" />
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <TabBar />
        <View style={styles.grid}>
          <View>
            {/* <TouchableOpacity
              style={styles.gridCard}
              onPress={() => {
                new Directory(Paths.document, "userData").delete();
              }}
            >
              <Text>Delete Full User Data</Text>
            </TouchableOpacity> */}
            <FileSystemDumpButton
              root={dir(Paths.document, "userData")}
              title="Dump"
            />
            <View style={{ flex: 1 }}>
              <MyComponent />
              <Button title="focus" onPress={() => {}} />
            </View>
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
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    backgroundColor: "#2563eb",
    padding: 20,
    paddingTop: 50,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  hello: { color: "white" },
  name: { color: "white", fontSize: 20, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  headerTopRight: { flexDirection: "row", justifyContent: "space-between" },
  search: {
    backgroundColor: "white",
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
