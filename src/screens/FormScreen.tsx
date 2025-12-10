import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { sections, saveFormToStorage } from "../storage/formsStorage";
import QuestionSection from "../components/QuestionSection";
import SignatureModal from "../components/SignatureModal";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  const [openDocente, setOpenDocente] = useState(false);
  const [openCoordenador, setOpenCoordenador] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ERROS VISUAIS
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function update(key: string, value: string) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  }

  function updateAnswer(questionId: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      respostas: { ...prev.respostas, [questionId]: value },
    }));

    setErrors((prev) => ({ ...prev, [questionId]: false }));
  }

  function limparFormulario() {
    setForm({
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
    setErrors({});
  }

  // VALIDAR DATA AAAA-MM-DD
  function validarData(data: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false;

    const [ano, mes, dia] = data.split("-").map(Number);
    const dt = new Date(ano, mes - 1, dia);

    return (
      dt.getFullYear() === ano &&
      dt.getMonth() === mes - 1 &&
      dt.getDate() === dia
    );
  }

  function validarFormulario() {
    const erros: string[] = [];
    const novo = {} as Record<string, boolean>;

    const obrigatorios = [
      "curso",
      "turma",
      "unidade",
      "docente",
      "data",
      "conteudo",
    ];

    obrigatorios.forEach((campo) => {
      if (!form[campo] || form[campo].trim() === "") {
        erros.push(campo);
        novo[campo] = true;
      }
    });

    if (form.data && !validarData(form.data)) {
      erros.push("Data inválida (use AAAA-MM-DD)");
      novo["data"] = true;
    }

    sections.forEach((section, si) => {
      section.items.forEach((_, qi) => {
        const id = `q_${si}_${qi}`;
        if (!form.respostas[id]) {
          erros.push(`Pergunta: ${section.title} (Questão ${qi + 1})`);
          novo[id] = true;
        }
      });
    });

    if (!form.assinatura_docente.trim()) {
      erros.push("Assinatura do Docente");
      novo["assinatura_docente"] = true;
    }

    if (!form.assinatura_coordenador.trim()) {
      erros.push("Assinatura do Coordenador");
      novo["assinatura_coordenador"] = true;
    }

    setErrors(novo);

    if (erros.length > 0) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha corretamente:\n\n• " + erros.join("\n• ")
      );
      return false;
    }

    return true;
  }

  async function salvarFormulario() {
    if (!validarFormulario()) return;

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

      {/* CAMPOS PRINCIPAIS */}
      <Text style={styles.label}>Curso</Text>
      <TextInput
        style={[styles.input, errors.curso && styles.inputError]}
        value={form.curso}
        onChangeText={(v) => update("curso", v)}
      />

      <Text style={styles.label}>Turma</Text>
      <TextInput
        style={[styles.input, errors.turma && styles.inputError]}
        value={form.turma}
        onChangeText={(v) => update("turma", v)}
      />

      <Text style={styles.label}>Unidade Curricular</Text>
      <TextInput
        style={[styles.input, errors.unidade && styles.inputError]}
        value={form.unidade}
        onChangeText={(v) => update("unidade", v)}
      />

      <Text style={styles.label}>Docente</Text>
      <TextInput
        style={[styles.input, errors.docente && styles.inputError]}
        value={form.docente}
        onChangeText={(v) => update("docente", v)}
      />

      <Text style={styles.label}>Data</Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[styles.input, errors.data && styles.inputError]}
      >
        <Text style={{ color: form.data ? "#000" : "#888" }}>
          {form.data || "Selecione a data"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.data ? new Date(form.data) : new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              const ano = selectedDate.getFullYear();
              const mes = String(selectedDate.getMonth() + 1).padStart(2, "0");
              const dia = String(selectedDate.getDate()).padStart(2, "0");

              update("data", `${ano}-${mes}-${dia}`);
            }
          }}
        />
      )}

      <Text style={styles.label}>Conteúdo Abordado</Text>
      <TextInput
        style={[styles.input, errors.conteudo && styles.inputError]}
        value={form.conteudo}
        onChangeText={(v) => update("conteudo", v)}
      />

      {/* PERGUNTAS */}
      {sections.map((section, si) => (
        <QuestionSection
          key={si}
          section={section}
          sectionIndex={si}
          respostas={form.respostas}
          errors={errors}
          onSelect={updateAnswer}
        />
      ))}

      {/* ASSINATURAS */}
      <Text style={styles.label}>Assinatura do Docente</Text>
      <TouchableOpacity
        style={styles.btnAssinar}
        onPress={() => setOpenDocente(true)}
      >
        <Text style={styles.btnAssinarText}>Assinar</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Assinatura do Coordenador</Text>
      <TouchableOpacity
        style={styles.btnAssinar}
        onPress={() => setOpenCoordenador(true)}
      >
        <Text style={styles.btnAssinarText}>Assinar</Text>
      </TouchableOpacity>

      {/* BOTÕES */}
      <TouchableOpacity style={styles.btn} onPress={salvarFormulario}>
        <Text style={styles.btnText}>Salvar Formulário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => navigation.navigate("Saved")}
      >
        <Text style={styles.btnText}>Ver Formulários Salvos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnNew} onPress={limparFormulario}>
        <Text style={styles.btnText}>Novo Formulário</Text>
      </TouchableOpacity>

      {/* MODAIS */}
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
    backgroundColor: "#fdfdfdff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  btnAssinar: {
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  btnAssinarText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#053578ff",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  btnSecondary: {
    backgroundColor: "#576570ff",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  btnNew: {
    backgroundColor: "#848604ff",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 40,
  },
  btnText: {
    color: "#fbfafaff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
