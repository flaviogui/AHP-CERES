function calcularResultadoFinal() {
  const criterios = JSON.parse(localStorage.getItem("criteriosSelecionados")) || [];


  const alunos = JSON.parse(localStorage.getItem("nomesAlunos"));
  const compCrit = JSON.parse(localStorage.getItem("comparacoes_criterios"));
  const compAlt = JSON.parse(localStorage.getItem("comparacoes_alternativas"));
  localStorage.setItem("criteriosSelecionados", JSON.stringify(lista));

  function criarMatrizComparacao(pares, itens) {
    const n = itens.length;
    const matriz = Array.from({ length: n }, () => Array(n).fill(1));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const chave = `${itens[i]}_${itens[j]}`;
        const valor = pares[chave];
        matriz[i][j] = valor;
        matriz[j][i] = 1 / valor;
      }
    }
    return matriz;
  }

  function vetorPrioridade(matriz) {
    const n = matriz.length;
    const produtoLinhas = matriz.map(linha => linha.reduce((a, b) => a * b, 1));
    const potencias = produtoLinhas.map(p => Math.pow(p, 1 / n));
    const soma = potencias.reduce((a, b) => a + b, 0);
    return potencias.map(p => p / soma);
  }

  function calcularCR(matriz, pesos) {
    const n = matriz.length;
    const Aw = matriz.map((linha, i) => linha.reduce((soma, val, j) => soma + val * pesos[j], 0));
    const lambdaMax = Aw.reduce((soma, val, i) => soma + val / pesos[i], 0) / n;
    const CI = (lambdaMax - n) / (n - 1);
    const RI = [0, 0, 0.58, 0.9, 1.12, 1.24];
    const CR = CI / (RI[n - 1] || 1);
    return CR;
  }

  // Matriz dos critérios
  const matrizCrit = criarMatrizComparacao(compCrit, criterios);
  const pesosCrit = vetorPrioridade(matrizCrit);
  const crCrit = calcularCR(matrizCrit, pesosCrit);

  // Matriz de cada critério com os alunos
  const matrizAlunosPorCrit = criterios.map(criterio => {
    const pares = {};
    for (let i = 0; i < alunos.length; i++) {
      for (let j = i + 1; j < alunos.length; j++) {
        const chave = `${criterio}::${alunos[i]}_${alunos[j]}`;
        pares[`${alunos[i]}_${alunos[j]}`] = compAlt[chave];
      }
    }
    const matriz = criarMatrizComparacao(pares, alunos);
    return vetorPrioridade(matriz);
  });

  // Combina os pesos finais
  const pesosFinais = Array(alunos.length).fill(0);
  for (let i = 0; i < alunos.length; i++) {
    for (let j = 0; j < criterios.length; j++) {
      pesosFinais[i] += pesosCrit[j] * matrizAlunosPorCrit[j][i];
    }
  }

  return {
    alunos,
    pesos: pesosFinais,
    cr: crCrit
  };
}
