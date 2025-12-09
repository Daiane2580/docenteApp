import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Signature from "react-native-signature-canvas";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (base64: string) => void;
  title?: string;
}

export default function SignatureModal({
  visible,
  onClose,
  onSave,
  title = "Assine abaixo",
}: Props) {
  const ref = useRef<any>(null);

  function handleOK(signature: string) {
    onSave(signature);
    onClose();
  }

  function handleClear() {
    ref.current?.clearSignature();
  }

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalArea}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.signatureBox}>
          <Signature
            ref={ref}
            onOK={handleOK}
            onEmpty={() => console.log("Assinatura vazia")}
            descriptionText="Assine aqui"
            clearText="Limpar"
            confirmText="Salvar"
            webStyle={webStyle}
          />
        </View>

        {/* Botões */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={handleClear}>
            <Text style={styles.btnText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const webStyle = `
  .m-signature-pad {
    border: 2px solid #444 !important;
    border-radius: 6px;
  }
  .m-signature-pad--body {
    height: 300px !important;
  }
  .m-signature-pad--footer {
    display: none; 
  }
`;

const styles = StyleSheet.create({
  modalArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  signatureBox: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  btn: {
    backgroundColor: "#0b6efd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },

  btnClose: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
