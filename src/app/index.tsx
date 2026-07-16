import FabMenu from "@/src/components/FabMenu";

import TabBar from "@/src/components/TabBar";
import { Directory, Paths } from "expo-file-system";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const Separator = () => <View style={styles.hr} />;
  const directory = new Directory(Paths.document, "userData");
  useEffect(() => {
    directory.create({
      idempotent: true,
    });
  }, [directory]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>Gurjeet 👋</Text>
          </View>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.search}>
          <Ionicons name="search" size={20} color="gray" />
          <Text style={styles.searchText}>Search documents</Text>
        </View>
      </View> */}

      <ScrollView style={styles.content}>
        <TabBar />
        {/*<Text style={styles.sectionTitle}>Upload Documents</Text>

       *<Camera /> 
        <Text style={styles.sectionTitle}>My Docucments</Text>*/}
        <View style={styles.grid}>
          {/* <DocumentSection
            directory={new Directory(Paths.document, "userData")}
          /> */}
          <Separator />
          {/** <TouchableOpacity
            style={styles.gridCard}
            onPress={() => {
              new Directory(Paths.document, "userData").delete();
            }}
          >
            <Text>Delete Full User Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => {
              new Directory(Paths.document, "userData/temp").create();
            }}
          >
            <Text>Delete Temp</Text>
          </TouchableOpacity>
          <Separator />
          */}
        </View>
      </ScrollView>
      <FabMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  hr: {
    borderBottomColor: "#cccccc", // Line color
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin native line thickness
    width: "100%", // Full width alignment
    marginVertical: 15, // Spacing above and below the line
  },
  container: { flex: 1, backgroundColor: "#f3f4f6", marginTop: 50 },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#6366f1",
  },

  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  hello: { color: "white" },
  name: { color: "white", fontSize: 20, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  search: {
    backgroundColor: "white",
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: { marginLeft: 10, color: "gray" },

  content: { padding: 15 },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    backgroundColor: "white",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
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

  listItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    backgroundColor: "#dbeafe",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
});
