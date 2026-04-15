import { Directory, Paths } from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Pressable } from "@/src/components/ui/pressable";

export default function SavedDocuments({
  directory,
}: {
  directory: Directory;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);

  const loadFiles = () => {
    try {
      const contents = directory.list();
      setFiles(contents.map((item) => item.name));
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [directory]),
  );

  return (
    <View style={styles.grid}>
      {files.map((file, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gridCard}
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: "/fwdCamera",
              params: {
                uris: JSON.stringify(
                  new Directory(Paths.document, "userData", file).list(),
                ),
              },
            });
          }}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file}
            </Text>

            {/* Kebab Menu */}
            <Menu
              trigger={(triggerProps) => (
                <Pressable
                  {...triggerProps}
                  onPress={(e) => {
                    e.stopPropagation(); // 🔥 prevents card click
                    triggerProps.onPress?.(e);
                  }}
                >
                  <Text style={styles.kebab}>⋮</Text>
                </Pressable>
              )}
            >
              {/* <MenuItem
                textValue="f"
                onPress={() => console.log("Rename", file)}
              >
                <MenuItemLabel>Rename</MenuItemLabel>
              </MenuItem> */}

              <MenuItem
                textValue="f"
                onPress={() => {
                  console.log("Delete", file);
                  new Directory(Paths.document, "userData", file).delete();
                }}
              >
                <MenuItemLabel style={{ color: "red" }}>Delete</MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.8}
        onPress={() => {
          const contents = new Directory(
            Paths.document,
            "userData",
            "Y",
          ).list();
          setFiles(contents.map((item) => item.name));
        }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.fileName} numberOfLines={1}>
            {"F"}
          </Text>
        </View>
      </TouchableOpacity>
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
    padding: 7,
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  fileName: {
    fontWeight: "500",
    flex: 1,
    marginRight: 6,
  },

  kebab: {
    fontSize: 18,
    paddingHorizontal: 6,
  },

  openArea: {
    backgroundColor: "#eef4ff",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
  },

  openText: {
    fontSize: 13,
    opacity: 0.8,
  },
});
