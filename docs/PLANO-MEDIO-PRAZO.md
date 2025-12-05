# 🚀 Plano Tático de Médio Prazo: Do Setup ao Agente Funcional

Este documento detalha o plano de execução para as próximas semanas, focando em transformar o esqueleto do projeto em um agente **Evo-Memory** funcional (MVP).

**Objetivo do Médio Prazo:** Ter um agente capaz de receber uma tarefa de codificação, buscar experiências passadas, gerar código, executá-lo em sandbox e aprender com o resultado (salvar memória).

---

## 📅 Frente 1: Infraestrutura de Memória (A Base)
**Foco:** Sair do zero em persistência e busca semântica. Sem isso, o agente não tem "cérebro" de longo prazo.

### Tarefas Técnicas:
1.  **Dockerizar ChromaDB:**
    - [ ] Criar `docker-compose.yml` com serviço ChromaDB.
    - [ ] Garantir persistência de dados (volumes).
2.  **Serviço de Embeddings:**
    - [ ] Implementar `EmbeddingService` no NestJS.
    - [ ] Suporte inicial: OpenAI `text-embedding-3-small` (rápido e barato).
3.  **Integração ChromaDB:**
    - [ ] Instalar cliente `chromadb` no Node.js.
    - [ ] Criar `MemoryRepository` para abstrair operações do banco.
    - [ ] Implementar `search(query)` e `add(document)`.

**Entregável:** Um script de teste que salva "O céu é azul" e busca "Qual a cor do céu?" retornando o documento correto.

---

## 📅 Frente 2: O Cérebro do Agente (LangGraph + LLM)
**Foco:** Implementar o fluxo de decisão **ReMem** (Think -> Act -> Refine).

### Tarefas Técnicas:
1.  **Setup LangGraph:**
    - [ ] Instalar `@langchain/langgraph` e `@langchain/openai`.
    - [ ] Definir interface `AgentState` (input, chat_history, steps, current_memory).
2.  **Nós do Grafo (Nodes):**
    - [ ] `retrieve_node`: Chama o `MemoryService`.
    - [ ] `decision_node`: LLM decide próximo passo (Think, Act, Refine).
    - [ ] `execution_node`: Chama o Sandbox (mockado inicialmente).
    - [ ] `refine_node`: LLM analisa resultado e gera lição.
3.  **Prompt Engineering:**
    - [ ] Portar os prompts do Paper (Appendix C) para templates no código.
    - [ ] Criar "System Prompt" que força o formato de resposta estruturado.

**Entregável:** O agente roda um loop lógico. Recebe input, decide agir, "finge" que agiu, e decide terminar.

---

## 📅 Frente 3: Execução Segura (Sandbox)
**Foco:** Permitir que o agente escreva e teste código de verdade.

### Tarefas Técnicas:
1.  **Sandbox Service:**
    - [ ] Implementar execução isolada (usando `vm2` ou Docker containers per task - *Recomendado vm2 para MVP*).
    - [ ] Capturar `stdout` (logs) e `stderr` (erros).
    - [ ] Definir timeout (ex: 5 segundos) para evitar loops infinitos.
2.  **Integração com Grafo:**
    - [ ] Conectar `execution_node` ao `SandboxService`.
    - [ ] Passar o output da execução de volta para o estado do agente.

**Entregável:** O agente consegue escrever `console.log('Hello World')`, executar e ler a saída.

---

## 📅 Cronograma Sugerido

| Semana | Foco | Entregável Principal |
| :--- | :--- | :--- |
| **1** | Infra (Docker + Chroma) | Banco Vetorial rodando e acessível via NestJS. |
| **2** | LangGraph Core | Grafo de estado montado e transições funcionando. |
| **3** | Sandbox + Integração | Agente escreve e roda código simples. |
| **4** | Refinamento (ReMem) | O ciclo completo: Errar -> Aprender -> Acertar. |

---

## 🛠️ Ações Imediatas (Para começar agora)

1.  Criar `docker-compose.yml` para o ChromaDB.
2.  Instalar dependências do LangChain e Chroma.
3.  Criar a interface `AgentState` em `src/common/interfaces`.
