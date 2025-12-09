import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Signature from "react-native-signature-canvas";

interface Props {
  label: string;
  onSave: (base64: string) => void;
}

export default function SignaturePad({ label, onSave }: Props) {
  const ref = useRef<any>(null);

  // Quando o usuário clica em "Salvar"
  const handleSignature = (signature: string) => {
    onSave(signature);
  };

  // Limpar assinatura
  const handleClear = () => {
    ref.current?.clearSignature();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.signatureContainer}>
        <Signature
          ref={ref}
          onOK={handleSignature}
          onEmpty={() => console.log("Assinatura vazia")}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={webStyle}
        />
      </View>

      <TouchableOpacity style={styles.btnClear} onPress={handleClear}>
        <Text style={styles.btnText}>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
}

const webStyle = `
  .m-signature-pad {
    border: 1px solid #333 !important;
    border-radius: 6px;
    padding: 0;
  }
  .m-signature-pad--body {
    border: none !important;
    height: 180px;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  signatureContainer: {
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    overflow: "hidden",
  },
  btnClear: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#6c757d",
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
