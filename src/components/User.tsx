import { Button, ButtonText } from "@/src/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Directory, Paths } from "expo-file-system";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextValue = {
  users: string[];
  setUsers: React.Dispatch<React.SetStateAction<string[]>>;
  currentUser: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    const r: string[] = [];
    const usersList = new Directory(Paths.document, "userData").list();
    usersList.forEach((element) => {
      r.push(element.uri.split("/").filter(Boolean).pop() as string);
    });
    setUsers(r);
  }, []);

  return (
    <UserContext.Provider
      value={{ users, setUsers, currentUser, setCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within UserProvider");
  }
  return context;
}

export default function User() {
  const { users: USERS, setCurrentUser } = useUsers();

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
            setCurrentUser(user);
          }}
        >
          <MenuItemLabel size="sm">{user}</MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
}
