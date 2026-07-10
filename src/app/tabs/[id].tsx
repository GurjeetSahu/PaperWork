import DocumentSection from "@/src/components/DocumentSection";
import { Directory, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Users() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>User ID: {id}</Text>
      <DocumentSection directory={new Directory(Paths.document, String(id))} />
    </View>
  );
}
