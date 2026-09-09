import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Directory, Paths } from "expo-file-system";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
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
  currentUser: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
  refreshUsers: () => void;
  foldersVersion: number;
  refreshFolders: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function loadUsersFromDisk(): string[] {
  //this guy isreturn string list of all users in main dir
  try {
    return new Directory(Paths.document, "userData")
      .list()
      .filter((entry) => entry instanceof Directory)
      .map((folder) => folder.name)
      .filter((name) => name !== "temp");
  } catch {
    return [];
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [foldersVersion, setFoldersVersion] = useState(0);

  const refreshUsers = useCallback(() => {
    const loadedUsers = loadUsersFromDisk();
    setUsers(loadedUsers);
    setCurrentUser((previousUser) => {
      if (previousUser && loadedUsers.includes(previousUser)) {
        return previousUser;
      }
      return loadedUsers[0] ?? "";
    });
  }, []);

  const refreshFolders = useCallback(() => {
    setFoldersVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const value = useMemo<UserContextValue>(
    () => ({
      users,
      currentUser,
      setCurrentUser,
      refreshUsers,
      foldersVersion,
      refreshFolders,
    }),
    [users, currentUser, refreshUsers, foldersVersion, refreshFolders],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
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
  const { users, currentUser, setCurrentUser, refreshUsers } = useUsers();

  const resetModal = () => {
    setShowModal(false);
    setUserName("");
  };

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
          <View style={styles.user}>
            <Text style={styles.greeting}>Hello, {currentUser} 👋</Text>
            <Pressable {...triggerProps}>
              <Ionicons name="caret-down" size={40} color="white" />
            </Pressable>
          </View>
        );
      }}
    >
      {users.map((user) => (
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

          <Modal isOpen={showModal} onClose={resetModal} size="md">
            <ModalBackdrop />

            <ModalContent style={styles.modal}>
              <ModalHeader style={styles.header}>
                <Text style={styles.title}>New User</Text>

                <ModalCloseButton>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={resetModal}
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
                  //value={userName}
                  onChangeText={setUserName}
                  placeholder="Ex- John Doe"
                />
              </ModalBody>

              <ModalFooter style={styles.footer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancel]}
                  onPress={resetModal}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.save]}
                  onPress={async () => {
                    const trimmedName = userName.trim();
                    if (!trimmedName) return;

                    new Directory(
                      Paths.document,
                      "userData",
                      trimmedName,
                    ).create({
                      idempotent: true,
                    });
                    setCurrentUser(trimmedName);
                    refreshUsers();
                    resetModal();
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
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.15)",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  user: { flexDirection: "row" },
  greeting: { color: "white" },
});
