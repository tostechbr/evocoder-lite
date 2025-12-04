# 🧠 Técnicas de Memória no Paper Evo-Memory

## 📊 Resumo: 3 Técnicas Propostas + 10 Técnicas Comparadas

O paper **Evo-Memory** propõe **3 técnicas novas** e compara com **10 técnicas existentes** do estado da arte.

---

## 🆕 Técnicas Propostas pelos Autores

### 1. **ExpRecent** (Experience Recent)
- **Tipo:** Baseline simples
- **Como funciona:** Usa apenas as experiências mais recentes (sem busca semântica)
- **Performance:** Intermediária
- **Uso:** Comparação com outras técnicas

### 2. **ExpRAG** (Experience Retrieval and Aggregation) ⭐
- **Tipo:** Baseline melhorada
- **Como funciona:**
  1. Busca `k` experiências similares no banco vetorial
  2. Usa in-context learning com essas experiências
  3. Adiciona nova experiência à memória após cada tarefa
- **Limitação:** Não tem refinamento iterativo durante a inferência
- **Performance:** Boa (0.59-0.60 em single-turn, 0.63-0.82 em multi-turn)
- **Fórmula:**
  ```
  R_t = Top-k similar experiences
  y_t = LLM(x_t, R_t)
  M_{t+1} = M_t ∪ {nova experiência}
  ```

### 3. **ReMem** (Reasoning + Memory Refinement) ⭐⭐⭐ **PRINCIPAL**
- **Tipo:** Framework avançado
- **Como funciona:**
  1. Loop de decisão: **Think → Act → Refine**
  2. **Think:** Raciocina sobre como aplicar lições
  3. **Act:** Executa ação (gera código, chama ferramenta)
  4. **Refine:** Analisa resultado e refina memória em tempo real
  5. Pode fazer múltiplas iterações de Think/Refine antes de Act
- **Diferencial:** Memória evolui durante a resolução do problema (não só depois)
- **Performance:** Melhor (0.58-0.65 em single-turn, **0.78-0.91 em multi-turn**)
- **Fórmula:**
  ```
  a^n_t ∈ {Think, Act, Refine}
  o^n_t = Agent(x_t, M_t, a^n_t)
  ```

---

## 🔬 Técnicas Comparadas (Estado da Arte)

### Categoria 1: Sem Memória Persistente

#### **ReAct** (Reasoning + Acting)
- **Tipo:** Baseline clássico
- **Como funciona:** Alterna entre raciocinar e agir
- **Limitação:** Não tem memória entre sessões
- **Performance:** 0.37-0.54 (baixa)

#### **Amem** (Adaptive Memory)
- **Tipo:** Memória adaptativa básica
- **Performance:** 0.56-0.63 (média)

---

### Categoria 2: Memória Adaptativa

#### **SelfRAG** (Self-Retrieval Augmented Generation)
- **Tipo:** RAG com auto-retrieval
- **Como funciona:** Decide quando buscar informações
- **Performance:** 0.55-0.59 (média)

#### **MemOS** (Memory Operating System)
- **Tipo:** Sistema de memória estruturado
- **Performance:** 0.55-0.59 (média)

#### **Mem0**
- **Tipo:** Framework de memória para agentes
- **Performance:** 0.55-0.59 (média)

#### **LangMem**
- **Tipo:** Memória integrada ao LangChain
- **Performance:** 0.49-0.57 (baixa-média)

---

### Categoria 3: Memória Procedural

#### **Dynamic Cheatsheet (DC)**
- **Variantes:** DC-Cu, DC-RS
- **Tipo:** "Cola" dinâmica de procedimentos
- **Como funciona:** Organiza conhecimento procedural em cheatsheets
- **Performance:** 0.52-0.58 (média)

#### **AWM** (Agent Workflow Memory)
- **Tipo:** Memória baseada em workflows
- **Performance:** 0.48-0.56 (baixa-média)

---

## 📈 Comparação de Performance

### Single-Turn Tasks (Raciocínio e QA)
| Técnica | Claude 3.7 | Gemini 2.5 | Média |
|---------|-----------|------------|-------|
| **ReMem** | 0.58 | **0.65** | **0.62** |
| **ExpRAG** | **0.59** | 0.60 | **0.60** |
| ExpRecent | 0.56 | 0.58 | 0.57 |
| Amem | 0.56 | 0.63 | 0.60 |
| SelfRAG | 0.55 | 0.59 | 0.57 |
| ReAct | 0.54 | 0.37 | 0.46 |

### Multi-Turn Tasks (Ambientes Embodied)
| Técnica | Claude 3.7 | Gemini 2.5 | Média |
|---------|-----------|------------|-------|
| **ReMem** | **0.78/0.91** | **0.50/0.64** | **0.64/0.78** |
| **ExpRAG** | 0.63/0.82 | 0.46/0.63 | 0.55/0.73 |
| ExpRecent | 0.58/0.79 | 0.39/0.59 | 0.49/0.69 |
| ReAct | 0.57/0.79 | 0.32/0.56 | 0.45/0.68 |

**Nota:** ReMem domina em tarefas multi-turn (0.78/0.91 vs 0.24/0.52 do baseline)

---