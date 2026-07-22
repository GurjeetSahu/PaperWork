import { Button } from "@/src/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Directory, Paths } from "expo-file-system";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";
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
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const { users: USERS, setCurrentUser, currentUser } = useUsers();

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
            <Text>Hello,</Text>
            <Text>{currentUser} 👋</Text>
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
      <MenuItem textValue="f">
        <View>
          <View style={styles.optionRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowModal(true);
              }}
            >
              <View style={styles.labelChip}>
                <Text style={styles.labelText}>New User</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            size="md"
          >
            <ModalBackdrop />

            <ModalContent style={styles.modal}>
              <ModalHeader style={styles.header}>
                <Text style={styles.title}>New User</Text>

                <ModalCloseButton>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </ModalCloseButton>
              </ModalHeader>

              <ModalBody>
                <TextInput
                  style={[
                    styles.primaryText,
                    {
                      borderColor: "black",
                      color: "black",
                      borderWidth: 2,
                      borderRadius: 10,
                      fontSize: 12,
                    },
                  ]}
                  onChangeText={(newText) => setUserName(newText)}
                  placeholder="Ex- Aadhar Card, Driving Licence etc."
                />
              </ModalBody>

              <ModalFooter style={styles.footer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancel]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.save]}
                  onPress={async () => {
                    setShowModal(false);
                    //work here
                    new Directory(Paths.document, "userData", userName).create({
                      idempotent: true,
                    });
                  }}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </View>
      </MenuItem>
    </Menu>
  );
}
const styles = StyleSheet.create({
  modal: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 380,
    borderWidth: 0,
    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },

  closeText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    gap: 12,
  },

  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  cancel: {
    backgroundColor: "#F3F4F6",
  },

  save: {
    backgroundColor: "#4F46E5",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  labelChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
});
