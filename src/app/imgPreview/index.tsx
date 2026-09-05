import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SaveMenu from "@/src/components/SaveMenu";

export default function Index() {
  const { uris, viewMode } = useLocalSearchParams<{
    uris?: string;
    viewMode: string;
  }>();
  const uriList = uris ? JSON.parse(uris) : [];
  return (
    <View style={styles.container}>
      {/* Image Section */}
      {/* <PagerView style={styles.container} initialPage={0}>
        {uriList.map((uri: string, index: string) => (
          <View style={styles.imageWrapper} key={index.toString()}>
            <View style={styles.imageCard}>
              <Image source={uri} style={styles.image} contentFit="contain" />
            </View>
          </View>
        ))}
      </PagerView> */}
      {/* Footer Actions */}
      {viewMode !== "true" && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.secondary]}>
            <Text style={styles.secondaryText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.outline]}>
            <Text style={styles.outlineText}>Add More</Text>
          </TouchableOpacity>
          <SaveMenu fromCamera={false} uriList={uriList} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06113d",
  },

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  imageCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    color: "#999",
    fontSize: 16,
  },

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 10,
    backgroundColor: "#000",
  },

  button: {
    height: 46,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#fff",
  },

  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  secondary: {
    backgroundColor: "#ef4444",
  },

  secondaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  outline: {
    borderWidth: 1,
    borderColor: "#444",
  },

  outlineText: {
    color: "#fff",
    fontSize: 15,
  },

  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
