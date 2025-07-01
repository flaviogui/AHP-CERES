// dados.js

function obterQtdAlunos() {
  return parseInt(localStorage.getItem("qtdAlunos"));
}

function obterNomesAlunos() {
  return JSON.parse(localStorage.getItem("nomesAlunos")) || [];
}

function obterComparacoesCriterios() {
  return JSON.parse(localStorage.getItem("comparacoes_criterios")) || {};
}

function obterComparacoesAlternativas() {
  return JSON.parse(localStorage.getItem("comparacoes_alternativas")) || {};
}

function salvarQtdAlunos(qtd) {
  localStorage.setItem("qtdAlunos", qtd);
}

function salvarNomesAlunos(lista) {
  localStorage.setItem("nomesAlunos", JSON.stringify(lista));
}

function salvarComparacoesCriterios(obj) {
  localStorage.setItem("comparacoes_criterios", JSON.stringify(obj));
}

function salvarComparacoesAlternativas(obj) {
  localStorage.setItem("comparacoes_alternativas", JSON.stringify(obj));
}
