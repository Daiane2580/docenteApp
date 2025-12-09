import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import {
  getSavedForms,
  deleteForm,
  exportToPdf,
  exportToZip,
} from "../storage/formsStorage";

export default function SavedFormsScreen({ navigation }) {
  const [forms, setForms] = useState<any[]>([]);

  async function loadForms() {
    const data = await getSavedForms();
    setForms(data.reverse()); // Mostrar mais recentes primeiro
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadForms);
    return unsubscribe;
  }, [navigation]);

  async function handleDelete(index: number) {
    Alert.alert(
      "Confirmar",
      "Deseja realmente apagar este formulário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            await deleteForm(forms.length - 1 - index); // Corrige por causa do reverse
            await loadForms();
          },
        },
      ],
      { cancelable: true }
    );
  }

  function renderItem({ item, index }: any) {
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.curso || "(Curso não informado)"} — {item.turma || ""}
          </Text>
          <Text style={styles.date}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Preview", { form: item })}
          >
            <Text style={styles.btnText}>Abrir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => exportToPdf(item)}
          >
            <Text style={styles.btnText}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => exportToZip(item)}
          >
            <Text style={styles.btnText}>ZIP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => handleDelete(index)}
          >
            <Text style={styles.btnText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Formulários Salvos</Text>

      {forms.length === 0 && (
        <Text style={styles.empty}>Nenhum formulário salvo.</Text>
      )}

      <FlatList
        data={forms}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  btnGroup: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
  },

  btn: {
    backgroundColor: "#0b6efd",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  btnDelete: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
