import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { sections, exportToPdf, exportToZip } from "../storage/formsStorage";

export default function PreviewScreen({ route }) {
  const { form } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visualização do Formulário</Text>

      {/* ==== Cabeçalho ==== */}
      <View style={styles.box}>
        <Text style={styles.item}>
          <Text style={styles.bold}>Curso: </Text>
          {form.curso}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Turma: </Text>
          {form.turma}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Unidade: </Text>
          {form.unidade}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Docente: </Text>
          {form.docente}
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Data: </Text>
          {form.data}
        </Text>
      </View>

      {/* ==== Conteúdo ==== */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Conteúdo Abordado</Text>
        <Text style={styles.item}>{form.conteudo}</Text>
      </View>

      {/* ==== Respostas das Perguntas ==== */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Respostas</Text>

        {sections.map((sec, si) => (
          <View key={si} style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>{sec.title}</Text>

            {sec.items.map((q, qi) => {
              const qid = `q_${si}_${qi}`;
              const resposta = form.respostas?.[qid] || "-";

              return (
                <View key={qi} style={styles.questionItem}>
                  <Text style={styles.questionText}>{q}</Text>
                  <Text style={styles.answerText}>Resposta: {resposta}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* ==== Observações ==== */}
      {form.observacoes ? (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.item}>{form.observacoes}</Text>
        </View>
      ) : null}

      {/* ==== Assinaturas ==== */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Assinaturas</Text>

        <Text style={styles.bold}>Docente:</Text>
        {form.assinatura_docente ? (
          <Image
            source={{ uri: form.assinatura_docente }}
            style={styles.signature}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.item}>Sem assinatura</Text>
        )}

        <Text style={[styles.bold, { marginTop: 20 }]}>Coordenador:</Text>
        {form.assinatura_coordenador ? (
          <Image
            source={{ uri: form.assinatura_coordenador }}
            style={styles.signature}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.item}>Sem assinatura</Text>
        )}
      </View>

      {/* ==== Botões ==== */}
      <TouchableOpacity style={styles.btn} onPress={() => exportToPdf(form)}>
        <Text style={styles.btnText}>Exportar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => exportToZip(form)}
      >
        <Text style={styles.btnText}>Exportar ZIP</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  box: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },

  item: {
    fontSize: 14,
    marginBottom: 4,
  },

  bold: {
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  sectionBlock: {
    marginBottom: 16,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  questionItem: {
    marginBottom: 10,
    backgroundColor: "#f5f8ff",
    padding: 8,
    borderRadius: 6,
  },

  questionText: {
    fontSize: 14,
    marginBottom: 2,
  },

  answerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b6efd",
  },

  signature: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#0b6efd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  btnSecondary: {
    backgroundColor: "#6c757d",
    padding: 14,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
