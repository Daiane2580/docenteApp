import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

interface Section {
  title: string;
  items: string[];
}

interface Props {
  section: Section;
  sectionIndex: number;
  respostas: Record<string, string>;
  errors: Record<string, boolean>;
  onSelect: (questionId: string, value: string) => void;
}

export default function QuestionSection({
  section,
  sectionIndex,
  respostas,
  errors,
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

            {/* Campo de Observações */}
            {isTextArea && (
              <TextInput
                style={[
                  styles.textArea,
                  errors[questionId] && styles.inputError,
                ]}
                value={selected}
                onChangeText={(v) => onSelect(questionId, v)}
                placeholder="Digite aqui..."
                multiline
              />
            )}

            {/* Opções */}
            {!isTextArea && (
              <View
                style={[
                  styles.optionsRow,
                  errors[questionId] && styles.errorBox,
                ]}
              >
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
  textArea: {
    minHeight: 80,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 10,
    borderRadius: 8,
    textAlignVertical: "top",
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    paddingLeft: 4,
    paddingVertical: 6,
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
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorBox: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 6,
    padding: 6,
  },
});
