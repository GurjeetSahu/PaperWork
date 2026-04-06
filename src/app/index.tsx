import { Ionicons } from "@expo/vector-icons";
import { Directory, Paths } from "expo-file-system";
import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import SavedDocuments from "../components/savedDocuments";
import Camera from "../components/uploadSection";

export default function HomeScreen() {
  const directory = new Directory(Paths.document, "userData");
  useEffect(() => {
    if (directory.exists) {
    } else {
      directory.createDirectory("userData");
    }
  }, [directory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Camera />

        <Text style={styles.sectionTitle}>My Documents</Text>
        <View style={styles.grid}>
          <View style={styles.gridCard}>{/*Placec*/}</View>
        </View>
        <View style={styles.grid}>
          {/* <SavedDocuments directory={Paths.document} /> */}
          <SavedDocuments
            directory={new Directory(Paths.document, "userData")}
          />
          {/* {["Aadhaar", "PAN Card", "Driving License", "Education", "PAN"].map(
            (cat, i) => (
              <View key={i} style={styles.gridCard}>
                <TouchableOpacity>
                  <Text style={{ fontWeight: "500" }}>{cat}</Text>
                </TouchableOpacity>
              </View>
            ),
          )} */}
        </View>

        <Text style={styles.sectionTitle}>Recent Documents</Text>
        {[
          { name: "Aadhaar Card", date: "Updated Jan 2026" },
          { name: "PAN Card", date: "Updated Dec 2025" },
        ].map((doc, i) => (
          <View key={i} style={styles.listItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.iconBox}>
                <Ionicons name="document-text" size={20} color="#2563eb" />
              </View>
              <View>
                <Text>{doc.name}</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>{doc.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },

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
