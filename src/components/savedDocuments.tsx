import { Directory } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, View } from "react-native";

export default function SavedDocuments({
  directory,
}: {
  directory: Directory;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const contents = directory.list();
      setFiles(contents.map((item) => item.name));
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  }, [directory]);

  return (
    <View>
      {files.map((file, index) => (
        <View key={index}>
          <Button
            title={file}
            onPress={async () => {
              console.log("Pushing to view not modal");
              router.push({
                pathname: "/fwdCamera",
                params: {
                  uri: "file:///data/user/0/host.exp.exponent/files/" + file,
                },
              });
            }}
          />
        </View>
      ))}
    </View>
  );
}
