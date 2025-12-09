import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import JSZip from "jszip";

// ======================================================
// 1. SEÇÕES E PERGUNTAS
// ======================================================

export const sections = [
  {
    title: "I. PLANEJAMENTO",
    items: [
      "1.1 O Plano de Ensino está de acordo com a Metodologia Plano de Curso.",
      "1.2 O Plano de Ensino está atualizado e coerente com o cronograma de aulas.",
      "1.3 Houve preparação de materiais e/ou ambiente de ensino.",
    ],
  },
  {
    title: "II. INTRODUÇÃO",
    items: [
      "1.1 Inicia a aula com alguma técnica de motivação e/ou mediação dos alunos.",
      "1.2 Explicita de forma clara os objetivos da aula e as tarefas a serem realizadas.",
      "1.3 Efetua a articulação das aprendizagens a realizar com aprendizagens anteriores.",
    ],
  },
  {
    title: "III. DESENVOLVIMENTO",
    items: [
      "1.1 Os conhecimentos apresentados seguem o previsto em Plano de Ensino.",
      "1.3 Mostra clareza e rigor científico na apresentação dos conhecimentos.",
      "1.4 Recorre a exemplos pertinentes na exploração dos conhecimentos relacionados com as vivências dos alunos.",
      "1.5 Valoriza com destaque os conhecimentos abordados e resolve exemplos de exercícios ou atividades com os alunos.",
      "1.5 Explicita os conteúdos de forma clara, facilitando o entendimento do aluno.",
    ],
  },
  {
    title: "III-2 Estratégias de ensino e aprendizagem",
    items: [
      "2.1 Mantém os alunos ativamente envolvidos e atentos.",
      "2.2 Organiza o ambiente de ensino com base em instruções precisas.",
      "2.3 Promove a participação ativa e motivada.",
      "2.4 Propõe atividades de apoio e reforço a alunos com dificuldades.",
      "2.5 Utiliza recursos didáticos diversificados.",
      "2.6 Proporciona alternativas diversificadas de trabalho aos alunos.",
      "2.7 Administra o tempo da aula de forma eficaz.",
    ],
  },
  {
    title: "III-3 Relação pedagógica, comunicação e clima",
    items: [
      "3.1 Expressa-se de forma correta, clara e audível.",
      "3.2 Mantém atualizado e disponível aos alunos o Controle de Frequência e de Aproveitamento no Portal Educacional.",
      "3.3 Administra com segurança e flexibilidade situações problemáticas e conflitos interpessoais.",
      "3.4 Mostra-se firme em relação ao respeito e cumprimento das regras e normas da instituição.",
      "3.5 Possui habilidade para conduzir a classe, demonstrando autoconfiança e dinamismo.",
    ],
  },
  {
    title: "IV. SÍNTESE",
    items: [
      "1.1 Realiza a correção dos exercícios propostos em sala.",
      "1.2 Efetua uma síntese global dos conteúdos tratados na aula.",
      "1.3 Disponibiliza exercícios complementares.",
      "1.4 Indica fontes de pesquisa complementar para reforço dos conhecimentos.",
      "1.5 Ressalta a importância da assiduidade dos alunos e incentiva a frequência.",
    ],
  },
  {
    title: "V. AVALIAÇÃO",
    items: [
      "1.1 As avaliações estão de acordo com o estabelecido no Plano de Ensino.",
      "1.2 Proporciona oportunidades para os alunos identificarem os seus progressos e dificuldades.",
      "1.3 Comunica e analisa com os alunos os resultados da avaliação das aprendizagens.",
      "1.4 Proporciona recuperação imediata aos alunos com rendimento insatisfatório.",
    ],
  },
  {
    title: "VI. CONCLUSÃO",
    items: ["Observações e Orientações (texto livre)."],
  },
];

// ======================================================
// 2. SALVAR FORMULÁRIO
// ======================================================

const STORAGE_KEY = "senai_forms_v1";

export async function saveFormToStorage(form: any) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const arr = stored ? JSON.parse(stored) : [];

    form.timestamp = new Date().toISOString();
    arr.push(form);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.log("Erro ao salvar formulário:", err);
    return false;
  }
}

// ======================================================
// 3. LER FORMULÁRIOS
// ======================================================

export async function getSavedForms() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// ======================================================
// 4. EXCLUIR FORMULÁRIO
// ======================================================

export async function deleteForm(index: number) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  let arr = stored ? JSON.parse(stored) : [];

  arr.splice(index, 1);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ======================================================
// 5. EXPORTAR PARA PDF (100% EXPO)
// ======================================================

export async function exportToPdf(form: any) {
  const html = `
    <h1 style="text-align:center;">ESCOLA SENAI DE LENÇÓIS PAULISTA</h1>
    <h2 style="text-align:center;">ACOMPANHAMENTO DA AÇÃO DOCENTE</h2>

    <h3>Dados Gerais</h3>
    <p><strong>Curso:</strong> ${form.curso}</p>
    <p><strong>Turma:</strong> ${form.turma}</p>
    <p><strong>Unidade Curricular:</strong> ${form.unidade}</p>
    <p><strong>Docente:</strong> ${form.docente}</p>
    <p><strong>Data:</strong> ${form.data}</p>

    <h3>Conteúdo Abordado</h3>
    <p>${form.conteudo}</p>

    <h3>Respostas</h3>
    <ul>
      ${Object.keys(form.respostas || {})
        .map(
          (key) =>
            `<li><strong>${key}:</strong> ${form.respostas[key] || ""}</li>`
        )
        .join("")}
    </ul>

    <h3>Observações</h3>
    <p>${form.observacoes || ""}</p>

    <h3>Assinatura do Docente</h3>
    ${
      form.assinatura_docente
        ? `<img src="${form.assinatura_docente}" width="300" />`
        : "<p>(Sem assinatura)</p>"
    }

    <h3>Assinatura do Coordenador</h3>
    ${
      form.assinatura_coordenador
        ? `<img src="${form.assinatura_coordenador}" width="300" />`
        : "<p>(Sem assinatura)</p>"
    }
  `;

  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri);
}

// ======================================================
// 6. EXPORTAR ZIP (100% EXPO, ZERO ERROS)
// ======================================================

export async function exportToZip(form: any) {
  try {
    const zip = new JSZip();

    // JSON
    zip.file("form.json", JSON.stringify(form, null, 2));

    // Assinatura docente
    if (form.assinatura_docente) {
      const base64 = form.assinatura_docente.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      zip.file("assinatura_docente.jpg", base64, { base64: true });
    }

    // Assinatura coordenador
    if (form.assinatura_coordenador) {
      const base64 = form.assinatura_coordenador.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      zip.file("assinatura_coordenador.jpg", base64, { base64: true });
    }

    // Gerar base64
    const zippedBase64 = await zip.generateAsync({ type: "base64" });

    // Caminho no Expo
    const path = FileSystem.cacheDirectory + `form_${Date.now()}.zip`;

    // Gravar arquivo ZIP

    await FileSystem.writeAsStringAsync(path, zippedBase64, {
      encoding: "base64",
    });

    // Compartilhar
    await Sharing.shareAsync(path);
  } catch (error) {
    console.log("Erro ao gerar ZIP:", error);
  }
}
