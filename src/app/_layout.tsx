import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={require("../../assets/images/react-logo.png")} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon src={require("../../assets/images/react-logo.png")} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
