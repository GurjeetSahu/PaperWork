import { Directory, Paths } from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Pressable } from "@/src/components/ui/pressable";
import { useUsers } from "@/src/components/User";

export default function DocumentSection({
  user,
  category,
}: {
  user: string;
  category: string;
}) {
  const router = useRouter();
  const { foldersVersion } = useUsers();
  const [files, setFiles] = useState<string[]>([]);

  const directory = useMemo(
    () => new Directory(Paths.document, "userData", user, category),
    [user, category],
  );

  const loadFiles = useCallback(() => {
    try {
      const contents = directory.list();
      setFiles(contents.map((item) => item.name));
    } catch (error) {
      console.error("Error reading directory:", error);
      setFiles([]);
    }
  }, [directory]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [loadFiles]),
  );

  useEffect(() => {
    loadFiles();
  }, [loadFiles, foldersVersion]);

  return (
    <View style={styles.grid}>
      {files.map((file, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gridCard}
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: "/imgPreview",
              params: {
                uris: JSON.stringify(new Directory(directory, file).list()),
                viewMode: true.toString(),
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
                //usual suspects
                <Pressable
                  {...(triggerProps ?? {})}
                  onPress={(e) => {
                    e.stopPropagation?.();

                    if (typeof triggerProps?.onPress === "function") {
                      triggerProps.onPress(e);
                    }
                  }}
                >
                  <Text style={styles.kebab}>⋮</Text>
                </Pressable>
              )}
            >
              <MenuItem textValue="export" onPress={() => {}}>
                <MenuItemLabel>Export To PDF</MenuItemLabel>
              </MenuItem>
              <MenuItem
                textValue="Rename"
                onPress={() => {
                  console.log(new Directory(directory, file));
                }}
              >
                <MenuItemLabel>Rename</MenuItemLabel>
                {/* <Rename prevName={""} /> */}
              </MenuItem>

              <MenuItem
                textValue="Delete"
                onPress={() => {
                  new Directory(directory, file).delete();
                  loadFiles();
                }}
              >
                <MenuItemLabel style={{ color: "red" }}>Delete</MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
        </TouchableOpacity>
      ))}
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
