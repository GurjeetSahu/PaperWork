import { Button, ButtonText } from "@/src/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Directory, Paths } from "expo-file-system";
import { useEffect, useState } from "react";

export default function User() {
  const [USERS, setUsers] = useState<string[]>([]);
  useEffect(() => {
    const r: string[] = [];
    const users = new Directory(Paths.document, "userData").list();
    users.forEach((element) => {
      r.push(element.uri.split("/").filter(Boolean).pop() as string);
    });
    setUsers(r);
  }, []);

  return (
    <Menu
      placement="bottom left"
      selectionMode="single"
      offset={5}
      className="p-1.5"
      onSelectionChange={(keys: any) => {
        //console.log(keys.currentKey);
      }}
      closeOnSelect={true}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps}>
            <ButtonText>User</ButtonText>
          </Button>
        );
      }}
    >
      {USERS.map((user) => (
        <MenuItem
          key={user}
          textValue={user}
          className="p-2 web:min-w-[294px] min-w-[225px]"
          onPress={() => {
            console.log(user);
          }}
        >
          <MenuItemLabel size="sm">{user}</MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
}
