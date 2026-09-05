import { Image, StyleSheet, Text, View } from "react-native";
import { useUsers } from "../components/User";

export default function ProfileScreen() {
  const { currentUser } = useUsers();
  const user = {
    name: "Gurjeet Sahu",
    age: 20,
    email: "gurjeet@example.com",
    bio: "Tech enthusiast exploring AI, software, and innovation.",
    image: "https://i.pravatar.cc/100",
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image source={{ uri: user.image }} style={styles.image} />

      {/* Name */}
      <Text style={styles.name}>{currentUser}</Text>

      {/* Age */}
      <Text style={styles.info}>Age: {user.age}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 100,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 3,
  },
  bio: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});
