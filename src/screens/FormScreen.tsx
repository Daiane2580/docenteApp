import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { sections, saveFormToStorage } from "../storage/formsStorage";
import QuestionSection from "../components/QuestionSection";
import SignatureModal from "../components/SignatureModal";

export default function FormScreen({ navigation }: any) {
  const [form, setForm] = useState<any>({
    curso: "",
    turma: "",
    unidade: "",
    docente: "",
    data: "",
    conteudo: "",
    observacoes: "",
    assinatura_docente: "",
    assinatura_coordenador: "",
    respostas: {},
  });

  // Estados de modais
  const [openDocente, setOpenDocente] = useState(false);
  const [openCoordenador, setOpenCoordenador] = useState(false);

  // Atualiza qualquer campo
  function update(key: string, value: string) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  // Atualiza respostas das perguntas
  function updateAnswer(questionId: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      respostas: { ...prev.respostas, [questionId]: value },
    }));
  }

  // Salvar formulário
  async function salvarFormulario() {
    const ok = await saveFormToStorage(form);

    if (ok) {
      Alert.alert("Sucesso", "Formulário salvo com sucesso!");
      navigation.navigate("Saved");
    } else {
      Alert.alert("Erro", "Não foi possível salvar o formulário.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Acompanhamento da Ação Docente</Text>

      {/* ===================== CAMPOS PRINCIPAIS ===================== */}
      <Text style={styles.label}>Curso</Text>
      <TextInput
        style={styles.input}
        value={form.curso}
        onChangeText={(v) => update("curso", v)}
      />

      <Text style={styles.label}>Turma</Text>
      <TextInput
        style={styles.input}
        value={form.turma}
        onChangeText={(v) => update("turma", v)}
      />

      <Text style={styles.label}>Unidade Curricular</Text>
      <TextInput
        style={styles.input}
        value={form.unidade}
        onChangeText={(v) => update("unidade", v)}
      />

      <Text style={styles.label}>Docente</Text>
      <TextInput
        style={styles.input}
        value={form.docente}
        onChangeText={(v) => update("docente", v)}
      />

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        value={form.data}
        onChangeText={(v) => update("data", v)}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Conteúdo Abordado</Text>
      <TextInput
        style={styles.input}
        value={form.conteudo}
        onChangeText={(v) => update("conteudo", v)}
      />

      {/* ===================== PERGUNTAS ===================== */}
      {sections.map((section, si) => (
        <QuestionSection
          key={si}
          section={section}
          sectionIndex={si}
          respostas={form.respostas}
          onSelect={updateAnswer}
        />
      ))}

      {/* ===================== ASSINATURA DOCENTE ===================== */}
      <Text style={styles.label}>Assinatura do Docente</Text>

      <TouchableOpacity
        style={styles.btnAssinar}
        onPress={() => setOpenDocente(true)}
      >
        <Text style={styles.btnAssinarText}>Assinar</Text>
      </TouchableOpacity>

      {form.assinatura_docente !== "" && (
        <Text style={styles.previewText}>Assinatura registrada ✔</Text>
      )}

      {/* ===================== ASSINATURA COORDENADOR ===================== */}
      <Text style={styles.label}>Assinatura do Coordenador</Text>

      <TouchableOpacity
        style={styles.btnAssinar}
        onPress={() => setOpenCoordenador(true)}
      >
        <Text style={styles.btnAssinarText}>Assinar</Text>
      </TouchableOpacity>

      {form.assinatura_coordenador !== "" && (
        <Text style={styles.previewText}>Assinatura registrada ✔</Text>
      )}

      {/* ===================== BOTÕES ===================== */}
      <TouchableOpacity style={styles.btn} onPress={salvarFormulario}>
        <Text style={styles.btnText}>Salvar Formulário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => navigation.navigate("Saved")}
      >
        <Text style={styles.btnText}>Ver Formulários Salvos</Text>
      </TouchableOpacity>

      {/* ===================== MODAIS ===================== */}
      <SignatureModal
        visible={openDocente}
        onClose={() => setOpenDocente(false)}
        onSave={(img) => update("assinatura_docente", img)}
        title="Assinatura do Docente"
      />

      <SignatureModal
        visible={openCoordenador}
        onClose={() => setOpenCoordenador(false)}
        onSave={(img) => update("assinatura_coordenador", img)}
        title="Assinatura do Coordenador"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 70,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },

  btnAssinar: {
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  btnAssinarText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  previewText: {
    color: "green",
    fontSize: 13,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: "#0b6efd",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  btnSecondary: {
    backgroundColor: "#6c757d",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 40,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
