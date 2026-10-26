# Trabalho – Ferramenta de Teste para Dispositivos Mobile: **Jest**

Projeto em **React Native (Expo)** que demonstra, na prática, a ferramenta de testes **Jest** (com a **React Native Testing Library**) com testes funcionais, de validação, de integração e **de carga**.

---

## 1. Introdução

O **Jest** é um framework open source de testes em JavaScript criado pelo Meta (Facebook). É o executor de testes padrão de projetos **React Native** e **Expo**, e também é muito usado em React, Node.js e TypeScript.

Os testes são escritos em **JavaScript**, descrevendo o que o usuário faz e o que deve aparecer na tela:

```js
await fireEvent.press(screen.getByTestId('botao-entrar'));
expect(screen.getByText('Olá, aluno!')).toBeOnTheScreen();
```

Diferente de ferramentas E2E (como Appium e Detox), o Jest **não precisa de emulador nem de celular**: ele renderiza os componentes em memória, no Node.js, e simula toques, digitação e rolagem. Por isso os testes rodam em segundos.

**Componentes do ecossistema usados no projeto**
- **Jest** – executor de testes, asserções (`expect`), mocks (`jest.fn`) e cobertura de código.
- **jest-expo** – preset que configura o Jest para apps Expo / React Native.
- **React Native Testing Library (RNTL)** – renderiza componentes e busca elementos como o usuário veria (`getByText`, `getByTestId`, `fireEvent`).

---

## 2. Vantagens

| Vantagem | Explicação |
|---|---|
| **Muito rápido** | Não abre emulador; a suíte inteira roda em segundos. |
| **Sem dispositivo** | Roda em qualquer máquina com Node.js, inclusive no CI, sem Android Studio/Xcode. |
| **Linguagem de programação real** | Testes em JavaScript: laços, funções auxiliares, variáveis e lógica sem limitação. |
| **Mocks embutidos** | `jest.fn()` simula APIs e permite testar cenários difíceis (erro 500, sem internet). |
| **Acesso ao código** | Pode testar desde uma função isolada até a tela inteira (unitário + integração). |
| **Cobertura de código** | `jest --coverage` mostra quais linhas do app foram testadas. |
| **Padrão do React Native** | Já vem configurado em projetos Expo/RN; comunidade e documentação enormes. |
| **Modo watch** | `jest --watch` roda de novo só os testes afetados a cada alteração salva. |
| **Open source e gratuito** | Licença MIT. |

## 3. Desvantagens

| Desvantagem | Explicação |
|---|---|
| **Não roda no dispositivo real** | Componentes nativos são simulados; bugs de layout, gestos ou do sistema operacional não aparecem. |
| **Não é ferramenta de carga dedicada** | Não gera milhares de usuários simultâneos como k6/JMeter; a carga é feita com laços sequenciais. |
| **Exige saber programar** | QA e PO sem conhecimento de JavaScript têm mais dificuldade para escrever testes. |
| **Listas virtualizadas** | `FlatList` só renderiza parte dos itens; é preciso simular eventos de layout e rolagem. |
| **Mocks podem esconder problemas** | Se a API real mudar, o teste com mock continua passando. |
| **Configuração do preset** | O `jest-expo` substitui o `fetch` por um mock, por isso o teste de carga na API roda em um projeto Jest separado. |
| **Sem captura de tela real** | Não gera prints do app como as ferramentas E2E. |

---

## 4. Tipos de teste possíveis com o Jest

| Tipo | O que verifica | Arquivo no projeto |
|---|---|---|
| **Smoke test** | O app abre e a função principal funciona | `01_login.test.js` |
| **Funcional** | Fluxos completos do usuário | `01_login.test.js`, `02_tarefas_crud.test.js` |
| **Negativo / validação** | Entradas inválidas são tratadas | `03_validacao_tarefas.test.js` |
| **Integração** | Tela + API REST (com `fetch` simulado, incluindo erros) | `04_api_posts.test.js` |
| **Carga (UI)** ⭐ | Inserção em massa: integridade, tempo e responsividade | `05_carga_ui.test.js` |
| **Carga (API)** ⭐ | N requisições reais ao backend: média, p95, erro, throughput | `06_carga_api.test.js` |
| **Regressão** | Rodar toda a suíte a cada mudança | `npm test` |
| **Cobertura** | Percentual do código exercitado pelos testes | `npm run test:cobertura` |
| Outros suportados | Testes unitários de funções, snapshots, hooks (`renderHook`), timers falsos | `toMatchSnapshot`, `jest.useFakeTimers`… |

### 4.1 Teste de carga (obrigatório)

Foram feitos **dois testes de carga**:

**a) Carga na interface – `05_carga_ui.test.js`**
- Insere `QTD` tarefas seguidas (padrão 50) com um laço `for`.
- Mede o tempo total e a média por tarefa.
- Critérios de aprovação:
  1. o contador mostra exatamente `Total: QTD` (nenhum dado perdido);
  2. tempo total abaixo de `LIMITE_MS`;
  3. a lista grande continua rolável até o primeiro item;
  4. o app continua respondendo (marca uma tarefa depois da carga).

**b) Carga na API – `06_carga_api.test.js`**
- Dispara `REQUISICOES` chamadas reais (padrão 100) para a API usada pelo app.
- Calcula **tempo médio, mínimo, máximo, percentil 95, taxa de erro e throughput (req/s)**.
- Critérios de aprovação: taxa de erro ≤ 5 %, média ≤ 800 ms, p95 ≤ 1500 ms.

Para aumentar a carga, basta passar variáveis de ambiente:

```bash
# bash / macOS / Linux
QTD=200 npx jest tests/05_carga_ui.test.js
REQUISICOES=300 LIMITE_P95_MS=2000 npx jest tests/06_carga_api.test.js
```

```powershell
# PowerShell (Windows)
$env:QTD=200; npx jest tests/05_carga_ui.test.js
$env:REQUISICOES=300; $env:LIMITE_P95_MS=2000; npx jest tests/06_carga_api.test.js
```

> Observação para a apresentação: as requisições do teste (b) são **sequenciais**. Para simular centenas de usuários **simultâneos** o ideal é complementar com uma ferramenta específica (k6, JMeter). Isso é justamente uma das desvantagens citadas.

---

## 5. Exemplo prático e funcional

### 5.1 O app
App **"Tarefas Jest"** com:
- **Login** (credenciais de teste: `aluno@teste.com` / `123456`) com validações;
- **Lista de tarefas**: adicionar, concluir, excluir e contador;
- **Posts (API)**: busca dados de `jsonplaceholder.typicode.com` e mostra o tempo de carregamento.

Todos os elementos testáveis têm `testID`, por exemplo:
```jsx
<Pressable testID="botao-entrar" onPress={entrar}>
```
e o teste usa:
```js
await fireEvent.press(screen.getByTestId('botao-entrar'));
```

### 5.2 Estrutura

```
ferramenta-teste-jest/
├── App.js                         # navegação entre telas
├── package.json                   # scripts e configuração do Jest
├── src/screens/
│   ├── LoginScreen.js
│   ├── TarefasScreen.js
│   └── PostsScreen.js
└── tests/
    ├── helpers/login.js           # login reutilizável e utilitários
    ├── 01_login.test.js
    ├── 02_tarefas_crud.test.js
    ├── 03_validacao_tarefas.test.js
    ├── 04_api_posts.test.js
    ├── 05_carga_ui.test.js        # CARGA
    └── 06_carga_api.test.js       # CARGA
```

A configuração do Jest fica no `package.json` e tem dois projetos:
- **app** – usa o preset `jest-expo` e roda os testes de tela (01 a 05);
- **carga-api** – roda em Node puro para usar o `fetch` real no teste 06.

### 5.3 Como rodar

**Pré-requisito:** Node.js 18+ (não precisa de Java, emulador nem celular).

```bash
# 1. Instalar dependências (inclui Jest, jest-expo e Testing Library)
npm install

# 2. Rodar os testes
npm test                    # todos os testes
npm run test:smoke          # só o login
npm run test:carga          # só os testes de carga
npm run test:cobertura      # gera relatório de cobertura em coverage/

# Rodar um teste específico
npx jest tests/02_tarefas_crud.test.js

# Modo watch (roda de novo ao salvar)
npx jest --watch
```

A primeira execução é mais lenta (o Jest transforma e guarda o código em cache); as seguintes levam poucos segundos.

O relatório de cobertura fica em `coverage/lcov-report/index.html`, e o log do teste de carga aparece no terminal assim:

```
===== RELATORIO TESTE DE CARGA (API) =====
Requisicoes : 100
Erros       : 0 (0.0%)
Tempo medio : 91 ms
Min / Max   : 67 / 1204 ms
P95         : 99 ms
Throughput  : 10.99 req/s
==========================================
```
*(valores ilustrativos – variam conforme a rede)*

Para usar o app de verdade: `npm start` e abrir no Expo Go ou emulador.

---

## 6. Conclusão

O Jest, junto com a React Native Testing Library, se destaca pela **velocidade e facilidade de execução**: sem emulador, em poucos segundos é possível validar login, cadastro, validações e integração com API, inclusive cenários de erro difíceis de reproduzir em um aparelho. Com laços e o `fetch` do Node ele também cobre **testes de carga** de volume na interface e no backend. Por não rodar no dispositivo real, deve ser complementado por uma ferramenta E2E (Detox, Appium) e, para carga concorrente em larga escala, por ferramentas especializadas (k6, JMeter).

## Referências
- Documentação do Jest: https://jestjs.io/docs/getting-started
- Testes com Expo: https://docs.expo.dev/develop/unit-testing/
- React Native Testing Library: https://oss.callstack.com/react-native-testing-library/
- Repositório: https://github.com/jestjs/jest
