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
  async function walk(
    dir: Directory,
    prefix = "",
    isLast = true,
    isRoot = true,
  ): Promise<string> {
    let output = isRoot
      ? `📁 ${dir.uri}\n`
      : `${prefix}${isLast ? "└── " : "├── "}📁 ${dir.name}\n`;

    try {
      const entries = await dir.list();

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const last = i === entries.length - 1;
        const childPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");

        if (entry instanceof Directory) {
          output += await walk(entry, childPrefix, last, false);
        } else {
          const info = await entry.info();
          output += `${childPrefix}${last ? "└── " : "├── "}📄 ${
            entry.name
          } (${info.size ?? 0} bytes)\n`;
        }
      }
    } catch (e: any) {
      output += `${prefix}❌ ${e.message}\n`;
    }

    return output;
  }
  return (
    <TouchableOpacity
      onPress={async () => {
        console.log("\n", await walk(root));
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
