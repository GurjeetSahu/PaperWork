import { Text } from "react-native";

import type { MergePdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type MergeMenuProps = {
  visible: boolean;
  fileCount: number;
  onClose: () => void;
  onSubmit: (data: MergePdfFormData) => void;
};

export default function MergeMenu({ visible, fileCount, onClose, onSubmit }: MergeMenuProps) {
  const handleSubmit = () => {
    onSubmit({});
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Merge PDFs" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>
        {fileCount < 2
          ? "Pick at least two PDFs with Pick File, then run merge."
          : `${fileCount} files will be merged in the order shown above.`}
      </Text>
    </ToolFormModal>
  );
}
