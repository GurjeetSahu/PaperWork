import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SaveMenu from "@/src/components/SaveMenu";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";

export default function Index() {
  const { uris, viewMode } = useLocalSearchParams<{
    uris?: string;
    viewMode: string;
  }>();
  const uriList = uris ? JSON.parse(uris) : [];
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <PagerView style={styles.container} initialPage={0}>
        {uriList.map((uri: string, index: string) => (
          <View style={styles.imageWrapper} key={index.toString()}>
            <View style={styles.imageCard}>
              <Image source={uri} style={styles.image} />
            </View>
          </View>
        ))}
      </PagerView>
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
    backgroundColor: "#0f172a", // dark modern bg
    justifyContent: "space-between",
  },

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  imageCard: {
    width: "100%",
    height: "90%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1e293b",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  placeholder: {
    color: "#94a3b8",
    fontSize: 16,
  },

  footer: {
    padding: 20,
    gap: 12,
  },

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

  secondary: {
    backgroundColor: "#ef4444",
  },

  secondaryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },

  outline: {
    borderWidth: 1,
    borderColor: "#475569",
  },

  outlineText: {
    color: "#cbd5f5",
    fontSize: 15,
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
