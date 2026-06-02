import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";

export default function TabLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="imgPreview"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="camera/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </GluestackUIProvider>
  );
}
