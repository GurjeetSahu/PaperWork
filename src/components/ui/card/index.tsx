import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CloseableCard({ title, description, onClose }: { title: any; description: any; onClose: any }) {
  return (
    <View style={styles.cardContainer}>
      {/* Close Button Container */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7} accessibilityLabel="Close card">
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Card Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    position: "relative", // Ensures absolute children anchor properly

    // Cross-platform shadows
    elevation: 4, // Android shadow
    shadowColor: "#000000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10, // Keeps it tapable above content
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6", // Light gray circle background
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b5563",
    lineHeight: 16, // Centers the character cleanly
  },
  contentContainer: {
    paddingRight: 24, // Prevents text from clipping beneath the button
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});
