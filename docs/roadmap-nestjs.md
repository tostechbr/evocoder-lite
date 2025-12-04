# 🗺️ Roadmap: Evo-Memory Agent com NestJS

## Visão Geral
Implementação da arquitetura **ReMem** usando **NestJS** como framework backend e **LangGraph.js** como orquestrador do agente.

---

## 📋 Fase 1: Setup Inicial

### 1.1 Estrutura do Projeto NestJS
- [ ] Inicializar projeto NestJS com TypeScript
- [ ] Configurar estrutura de módulos:
  ```
  src/
  ├── agent/          # Módulo do agente LangGraph
  ├── memory/         # Módulo de memória vetorial
  ├── sandbox/        # Módulo de execução segura
  ├── llm/            # Módulo de integração LLM
  └── common/         # Interfaces, DTOs, tipos
  ```

### 1.2 Dependências Core
- [ ] `@nestjs/core`, `@nestjs/common`
- [ ] `@langchain/langgraph` (LangGraph.js)
- [ ] `@langchain/core` (LangChain.js)
- [ ] `langchain` (ferramentas e integrações)
- [ ] `chromadb` (banco vetorial)
- [ ] `vm2` ou `isolated-vm` (sandbox)

### 1.3 Configuração de Ambiente
- [ ] `.env` com variáveis: `OPENAI_API_KEY`, `CHROMADB_URL`, etc.
- [ ] `@nestjs/config` para gerenciar configurações

---

## 📋 Fase 2: Interfaces e Tipos

### 2.3 DTOs da API
- [ ] `CreateTaskDto` (input do usuário)
- [ ] `AgentResponseDto` (resposta do agente)

---

## 📋 Fase 3: Módulo de Memória

### 3.1 Memory Service
- [ ] `MemoryService` com métodos:
  - `search(query: string, k: number): Promise<Memory[]>`
  - `store(memory: Memory): Promise<void>`
  - `refine(memories: Memory[], feedback: Feedback): Promise<Memory[]>`
  - `prune(contradictoryMemories: Memory[]): Promise<void>`

### 3.2 Integração com Banco Vetorial
- [ ] Configurar ChromaDB
- [ ] Criar coleção/índice para embeddings
- [ ] Implementar busca semântica (similarity search)

### 3.3 Embeddings
- [ ] Integrar modelo de embeddings (OpenAI)
- [ ] Vetorizar memórias antes de salvar

---

## 📋 Fase 4: Módulo LLM

### 4.1 LLM Service
- [ ] `LLMService` com suporte a:
  - OpenAI (GPT-4o)
  - Ollama (Llama 3 - local)
- [ ] Configuração via `@nestjs/config`

### 4.2 System Prompts
- [ ] Implementar prompt baseado no **Appendix C do paper**
- [ ] Templates para THINK, ACT, REFINE
- [ ] Prompt de síntese de memória

---

## 📋 Fase 5: Módulo Sandbox

### 5.1 Sandbox Service
- [ ] `SandboxService` com execução segura:
  - `execute(code: string, language: string): Promise<ExecutionResult>`
- [ ] Capturar `stdout` e `stderr`
- [ ] Timeout e limites de recursos

### 5.2 Segurança
- [ ] Isolamento de código (vm2 ou isolated-vm)
- [ ] Validação de código antes de executar
- [ ] Rate limiting

---

## 📋 Fase 6: Agente LangGraph ⭐ **CORE**

### 6.1 Grafo de Estado
- [ ] Criar grafo LangGraph com nós:
  1. **retrieve** → Busca memórias relevantes
  2. **agentDecision** → Decide THINK/ACT/REFINE
  3. **think** → Raciocina sobre o problema
  4. **act** → Executa ação (gera código)
  5. **execute** → Executa código no sandbox
  6. **refine** → Refina memória baseado no resultado
  7. **persist** → Salva novas lições

### 6.2 Agent Service (NestJS)
- [ ] `AgentService` que encapsula o grafo LangGraph
- [ ] Método `processTask(task: string): Promise<AgentResponse>`
- [ ] Streaming de respostas (opcional)

### 6.3 Lógica de Decisão
- [ ] Implementar decisão THINK/ACT/REFINE baseada no estado
- [ ] Condições de transição entre nós
- [ ] Loop até completar tarefa

---

## 📋 Fase 7: API REST

### 7.1 Agent Controller
- [ ] `POST /agent/task` - Enviar tarefa
- [ ] `GET /agent/task/:id` - Status da tarefa
- [ ] `GET /agent/memories` - Listar memórias (debug)

### 7.2 DTOs e Validação
- [ ] Usar `class-validator` e `class-transformer`
- [ ] Validação de entrada

---

## 📋 Fase 8: Refinamento de Memória ⭐ **DIFERENCIAL**

### 8.1 Memory Refinement Logic
- [ ] Analisar resultado da execução
- [ ] Gerar lição aprendida (sucesso ou falha)
- [ ] Identificar memórias contraditórias
- [ ] Aplicar pruning

### 8.2 Feedback Loop
- [ ] Integrar feedback do usuário (opcional)
- [ ] Atualizar memórias baseado em feedback

---

## 📋 Fase 9: Testes e Documentação

### 9.1 Testes Unitários
- [ ] Testar serviços isoladamente
- [ ] Mock de LLM e banco vetorial

### 9.2 Testes de Integração
- [ ] Testar fluxo completo do agente
- [ ] Validar ciclo Search → Synthesis → Evolve

### 9.3 Documentação
- [ ] Swagger/OpenAPI (`@nestjs/swagger`)
- [ ] README com exemplos de uso

---

## 📋 Fase 10: Otimizações

### 10.1 Performance
- [ ] Cache de memórias frequentes
- [ ] Otimização de embeddings
- [ ] Batch processing de memórias

### 10.2 Observabilidade
- [ ] Logging estruturado
- [ ] Métricas (Prometheus opcional)
- [ ] Tracing de execução do agente

---

## 🎯 Entregas Mínimas (MVP)

Para ter um MVP funcional, focar em:
1. ✅ Setup NestJS + LangGraph
2. ✅ Interface AgentState
3. ✅ Módulo de Memória (busca básica)
4. ✅ Módulo LLM (OpenAI)
5. ✅ Grafo LangGraph com 3 nós: Retrieve → AgentDecision → Act
6. ✅ API REST básica
7. ✅ Persistência de memórias

---

## 🚀 Próximos Passos Após MVP

- [ ] Suporte a múltiplos LLMs
- [ ] Interface web (Next.js opcional)
- [ ] WebSockets para streaming
- [ ] Dashboard de memórias
- [ ] Export/Import de memórias
- [ ] Multi-tenancy

---

## 📚 Recursos

- [LangGraph.js Docs](https://langchain-ai.github.io/langgraphjs/)
- [NestJS Docs](https://docs.nestjs.com/)
- [Paper Evo-Memory](docs/paper.md)

