import React, { useRef } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SignatureScreen from "react-native-signature-canvas";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  title: string;
}

export default function SignatureModal({
  visible,
  onClose,
  onSave,
  title,
}: Props) {
  const ref = useRef<any>(null);

  function handleOK(signature: string) {
    if (signature) {
      onSave(signature);
      onClose();
    }
  }

  function handleClear() {
    ref.current?.clearSignature();
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {/* ÁREA BRANCA DE ASSINATURA */}
        <View style={styles.signatureBox}>
          <SignatureScreen
            ref={ref}
            onOK={handleOK}
            onClear={handleClear}
            autoClear={false}
            descriptionText=""
            backgroundColor="#ffffff"
            webStyle={signatureWebStyle}
          />
        </View>

        {/* BOTÕES */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnClear} onPress={handleClear}>
            <Text style={styles.btnText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSave}
            onPress={() => ref.current?.readSignature()}
          >
            <Text style={styles.btnText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
          <Text style={styles.btnCloseText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const signatureWebStyle = `
  .m-signature-pad {
    border: 1px solid #ccc !important;
    border-radius: 8px;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  btnClear: {
    backgroundColor: "#dc3545",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginRight: 6,
  },

  btnSave: {
    backgroundColor: "#198754",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginLeft: 6,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  btnClose: {
    backgroundColor: "#6c757d",
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  btnCloseText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
