import { Directory, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SavedDocuments({
  directory,
}: {
  directory: Directory;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    try {
      console.log(directory);
      const contents = directory.list();
      console.log(contents.map((item) => item.name));
      setFiles(contents.map((item) => item.name));
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  }, [directory]);

  return (
    <View style={styles.grid}>
      {files.map((file, index) => (
        <View key={index} style={styles.gridCard}>
          <TouchableOpacity
            onPress={async () => {
              // console.log(directory);
              const l = new Directory(Paths.document, "userData", file).list();
              router.push({
                pathname: "/fwdCamera",
                params: {
                  uris: JSON.stringify(l.map((x) => x.uri)),
                },
              });
            }}
          >
            <Text style={{ fontWeight: "500" }}>{file} (Directory)</Text>
          </TouchableOpacity>
        </View>
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
