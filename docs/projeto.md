# 🧬 Evo-Memory Agent (TypeScript Implementation)
> **"Agentes que lembram o que foi dito, mas aprendem como resolver."**

Este projeto é uma implementação Open Source, escrita em **TypeScript**, da arquitetura **ReMem** apresentada no paper *"Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory"* (Google DeepMind, Novembro 2025).

## 1. O Problema
A maioria dos Agentes de IA atuais possui "Memória de Conversa" (Conversational Recall), mas carece de "Memória Procedural" (Experience Reuse).
*   **O Agente Comum:** Se você pedir para ele corrigir um bug e ele errar, e na semana seguinte você pedir a mesma coisa, ele provavelmente cometerá o mesmo erro. Ele não aprende com a própria experiência.
*   **O Problema:** Desperdício de tokens, latência alta e repetição de falhas lógicas.

## 2. A Solução: Evo-Memory
O **Evo-Memory Agent** introduz o conceito de *Test-time Evolution*. O agente evolui sua capacidade de resolução de problemas enquanto é utilizado, sem necessidade de re-treinamento (fine-tuning).

Ele utiliza um ciclo contínuo de:
1.  **Search (Busca):** Recuperar experiências passadas relevantes.
2.  **Synthesis (Síntese):** Adaptar essas experiências ao contexto atual.
3.  **Evolve (Evolução):** Aprender com o sucesso ou falha da ação atual e salvar a "Lição" na memória permanente.

## 3. Arquitetura do Projeto (Fluxo Lógico)

O sistema será construído sobre o **LangGraph.js**, utilizando uma arquitetura baseada em grafos para gerenciar o estado cíclico do agente.

### O Loop Central (ReMem)
Diferente de um RAG tradicional (que apenas busca e responde), este agente implementa o nó de decisão **Think-Act-Refine**:

1.  **Node: Retrieve (Busca)**
    *   O usuário envia uma tarefa (ex: "Crie uma função em TS para validar CPF").
    *   O sistema consulta o Banco Vetorial (ChromaDB/Pinecone) buscando "Lições Aprendidas" semanticamente similares.
    *   *Diferencial:* Não buscamos apenas códigos prontos, buscamos *estratégias* e *erros a evitar*.

2.  **Node: Agent Decision (Cérebro)**
    *   O LLM recebe a tarefa + as lições recuperadas.
    *   Ele decide o próximo passo entre três opções:
        *   **THINK:** Raciocinar sobre como aplicar a lição ao problema atual.
        *   **ACT:** Executar uma ferramenta (ex: Sandbox de execução de código).
        *   **REFINE:** Analisar o resultado da ação.

3.  **Node: Execution (Sandbox)**
    *   Executa o código gerado em um ambiente seguro.
    *   Captura `stdout` (sucesso) ou `stderr` (stack trace de erro).

4.  **Node: Memory Refinement (O "Pulo do Gato")**
    *   Este é o coração do paper. O agente analisa o resultado da execução.
    *   **Se falhou:** O agente gera explicitamente uma nota: *"Ao usar a lib X, ocorreu erro Y. A correção é Z."*
    *   **Se funcionou:** O agente pode simplificar a memória ou reforçar uma estratégia bem-sucedida.
    *   **Pruning (Poda):** O agente decide se descarta memórias antigas que contradizem a nova experiência.

5.  **Persistência:**
    *   A nova "Lição" é vetorizada e salva no banco de dados, tornando o agente imediatamente "mais inteligente" para a próxima interação.

---

## 4. Por que este é um excelente projeto Open Source?

Este projeto se destaca no cenário atual por quatro motivos principais, ideais para um portfólio de engenharia de software e IA:

### 🎓 1. Implementação de "State-of-the-Art" (SOTA)
Não é apenas mais um "wrapper de ChatGPT". Você está pegando um paper acadêmico complexo e recente (DeepMind 2025) e traduzindo-o para código funcional. Isso demonstra capacidade de **leitura técnica**, **arquitetura de sistemas** e **inovação**.

### 🛠 2. Stack Moderna e Diferenciada (TypeScript AI)
A vasta maioria dos projetos de Agentes é feita em Python. Criar isso em **TypeScript** (usando LangGraph.js) posiciona o projeto como uma ferramenta valiosa para o imenso ecossistema de desenvolvedores Web/Fullstack que querem integrar agentes autônomos em suas aplicações sem mudar de linguagem.

### 🧠 3. Resolve uma "Dor Real" dos LLMs
A "alucinação repetitiva" é um dos maiores problemas no desenvolvimento com LLMs. Um projeto Open Source que propõe uma arquitetura agnóstica para **auto-correção e aprendizado contínuo** tem alto potencial de adoção e contribuição da comunidade (stars no GitHub).

### 🔄 4. Extensibilidade (Tool-use Agnostic)
Embora o exemplo inicial seja focado em *geração de código*, a arquitetura **ReMem** pode ser adaptada por outros desenvolvedores para qualquer domínio:
*   Agentes de SQL que aprendem quais tabelas usar.
*   Agentes de DevOps que lembram como corrigir erros de deploy.
*   Agentes de Data Science que memorizam quais limpezas de dados funcionam melhor.

---

## 5. Tecnologias (Tech Stack)

*   **Linguagem:** TypeScript (Node.js).
*   **Orquestração:** LangGraph.js (para o grafo de estado e loops).
*   **LLM Interface:** LangChain.js / AI SDK.
*   **Modelos:** OpenAI (GPT-4o) ou Ollama (Llama 3 - suporte local).
*   **Banco Vetorial:** ChromaDB (via Docker) ou Supabase pgvector.
*   **Runtime:** Node.js (com vm2 ou similar para sandbox de código).

---

## 6. Próximos Passos (Roadmap)

1.  Definir as Interfaces de Estado (`AgentState`) no TypeScript.
2.  Configurar o ambiente LangGraph.js.
3.  Implementar o "Prompt de Sistema" baseado no Appendix C do paper.
4.  Criar o loop básico: Buscar -> Gerar -> Salvar.
5.  Implementar o refinamento de memória (Feedback Loop).