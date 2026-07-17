import { Directory } from "expo-file-system";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  root: Directory;
  title?: string;
};

export default function FileSystemDumpButton({
  root,
  title = "Dump File System",
}: Props) {
  async function walk(dir: Directory, indent = ""): Promise<string> {
    let output = `${indent}📁 ${dir.uri}\n`;

    try {
      const entries = await dir.list();

      for (const entry of entries) {
        if (entry instanceof Directory) {
          output += await walk(entry, indent + "  ");
        } else {
          const info = await entry.info();
          output += `${indent}  📄 ${entry.name} (${info.size ?? 0} bytes)\n`;
        }
      }
    } catch (e: any) {
      output += `${indent}❌ ${e.message}\n`;
    }

    return output;
  }

  return (
    <TouchableOpacity
      onPress={async () => {
        console.log(await walk(root));
      }}
      style={{
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#222",
      }}
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>{title}</Text>
    </TouchableOpacity>
  );
}

/**
 * Helper for nested directories.
 * Example:
 * dir(Paths.document, "myapp", "images", "avatars")
 */
export function dir(base: Directory, ...parts: string[]): Directory {
  return parts.reduce((current, part) => new Directory(current, part), base);
}
