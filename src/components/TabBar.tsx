import { Link } from "expo-router";

import { View } from "react-native";

export default function MyTabs() {
  return (
    <View>
      <Link href="/tabs/bacon" className="bg-green-700 btn btn-primary">
        View user (id inline)
      </Link>
    </View>
  );
}
