import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Section {
  title: string;
  items: string[];
}

interface Props {
  section: Section;
  sectionIndex: number;
  respostas: Record<string, string>;
  onSelect: (questionId: string, value: string) => void;
}

export default function QuestionSection({
  section,
  sectionIndex,
  respostas,
  onSelect,
}: Props) {
  const options = ["Sim", "Não", "Em Parte", "NA"];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>

      {section.items.map((question, qi) => {
        const questionId = `q_${sectionIndex}_${qi}`;
        const selected = respostas[questionId] || "";

        const isTextArea = question.includes("Observações");

        return (
          <View key={qi} style={styles.questionContainer}>
            {/* Pergunta */}
            <Text style={styles.questionText}>{question}</Text>

            {/* Campo de observações (quando necessário) */}
            {isTextArea && (
              <Text style={styles.obsHint}>
                (Este campo será preenchido lá no formulário principal)
              </Text>
            )}

            {/* Opções (Radio buttons customizados) */}
            {!isTextArea && (
              <View style={styles.optionsRow}>
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => onSelect(questionId, opt)}
                    style={styles.optionBtn}
                  >
                    <View style={styles.radioCircle}>
                      {selected === opt && (
                        <View style={styles.radioSelected} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fbfdff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0eaff",
    marginTop: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },

  questionContainer: {
    marginBottom: 14,
  },

  questionText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },

  obsHint: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#777",
    marginBottom: 10,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    paddingLeft: 4,
  },

  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },

  optionText: {
    fontSize: 13,
  },

  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0b6efd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#0b6efd",
  },
});
