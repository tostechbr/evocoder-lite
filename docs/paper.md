# Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory

**Authors:** Tianxin Wei, Noveen Sachdeva, Benjamin Coleman, Zhankui He, Yuanchen Bei, Xuying Ning, Mengting Ai, Yunzhe Li, Jingrui He, Ed H. Chi, Chi Wang, Shuo Chen, Fernando Pereira, Wang-Cheng Kang and Derek Zhiyuan Cheng.
*Google DeepMind & University of Illinois Urbana-Champaign*

### Abstract
Statefulness is essential for large language model (LLM) agents to perform long-term planning and problem-solving. This makes memory a critical component, yet its management and evolution remain largely underexplored. Existing evaluations mostly focus on static conversational settings, where memory is passively retrieved from dialogue to answer queries, overlooking the dynamic ability to accumulate and reuse experience across evolving task streams. In real-world environments such as interactive problem assistants or embodied agents, LLMs are required to handle continuous task streams, yet often fail to learn from accumulated interactions, losing valuable contextual insights, a limitation that calls for test-time evolution, where LLMs retrieve, integrate, and update memory continuously during deployment.

To bridge this gap, we introduce **Evo-Memory**, a comprehensive streaming benchmark and framework for evaluating self-evolving memory in LLM agents. Evo-Memory structures datasets into sequential task streams, requiring LLMs to search, adapt, and evolve memory after each interaction. We unify and implement over ten representative memory modules and evaluate them across 10 diverse multi-turn goal-oriented and single-turn reasoning and QA datasets. To better benchmark experience reuse, we provide a baseline method, **ExpRAG**, for retrieving and utilizing prior experience, and further propose **ReMem**, an *action–think–memory refine* pipeline that tightly integrates reasoning, task actions, and memory updates to achieve continual improvement.

**Keywords:** LLMs, Agentic Memory, Test-time Learning, Self-evolving Agents, Lifelong Intelligence

---

## 1. Introduction

Large Language Models (LLMs) have rapidly evolved from simple chatbots into capable systems that can write code, control browsers, and perform advanced question answering (Comanici et al., 2025). These advances have been driven by improving inference, planning, and tool use, as shown by benchmarks emphasizing logical reasoning and multi-step actions. Yet a fundamental capability, *memory*, remains largely underexplored. Memory allows LLMs to maintain state across interactions, accumulate experience, and adapt strategies over time. Recent studies have introduced memory modules that track dialogue histories through compression, indexing, or retrieval (Maharana et al., 2024b), improving *conversational recall* and personalization. However, most of these systems only reuse static dialogue context rather than learning from experience to improve future reasoning or decision-making.

Despite these advances, existing LLM memory systems remain largely static, retrieving information passively rather than evolving through use. Current evaluations test whether models can recall past context but rarely assess their ability to reuse *experience*. In essence, agents remember what was said but not what was learned. *Conversational recall* retrieves prior facts, whereas *experience reuse* abstracts reasoning strategies for future tasks. Without such reuse, models repeatedly solve similar problems, as long-term assistants often recall context yet fail to adapt across sessions.

Several recent benchmarks have begun examining static adaptation but remain limited in scope. StreamBench (Wu et al., 2024a) evaluates sequential learning but mainly measures factual retention without reasoning or trajectory reuse. Lifelong-Bench (Zheng et al., 2025) studies lifelong learning across environments and skills but focuses on retention without modeling memory structure or updates. Other studies (Hu et al., 2025; Maharana et al., 2024b; Wu et al.) assess long-term conversational consistency but do not test how agents evolve their memory during deployment. Together, these efforts highlight a critical gap: while progress has been made on sequential reasoning, there is still no unified framework for evaluating how different memory methods retrieve, integrate, and evolve historical strategies in realistic streaming scenarios.

To bridge this gap, we introduce **Evo-Memory**, a comprehensive streaming benchmark and framework for evaluating *self-evolving memory* in LLM agents. Evo-Memory restructures datasets into sequential *task streams*, requiring models to retrieve, adapt, and evolve memory after each interaction. The benchmark covers both *multi-turn goal-oriented* environments and *single-turn reasoning* or problem-solving tasks, explicitly testing whether LLMs can accumulate knowledge and refine strategies during deployment, a process we term *test-time evolution*. We unify and implement over ten representative memory modules, including retrieval-based, workflow, and hierarchical memory systems, to study their adaptation behavior. To further examine experience reuse, we introduce **ExpRAG**, a simple retrieval-based baseline that leverages prior task experiences, and further develop **ReMem**, an advanced *action–think–memory refine* pipeline that tightly integrates reasoning, action, and memory updates for continual improvement.

**In summary, our contributions are threefold:**
*   **Benchmark:** We present Evo-Memory, a streaming benchmark that evaluates LLM agents’ ability to perform *test-time evolution* across diverse multi-turn and single-turn tasks, bridging the gap between conversational recall and experience reuse.
*   **Framework:** We provide a unified evaluation framework with memory-centric metrics for analyzing adaptation, efficiency, and stability, and will release all code and configurations for reproducibility.
*   **Analysis and Insights:** We introduce **ExpRAG**, a simple retrieval-based baseline for experience reuse, and **ReMem**, an *action–think–memory refine* pipeline that unifies reasoning, action, and memory for continual improvement, informing future designs of memory.

---

## 2. Related Work

### 2.1. Test-time Learning
Test-time learning (TTL) builds upon early work on test-time adaptation (TTA) (Niu et al., 2022; Wang et al., 2021; Zhang et al., 2023), which enables models to adjust to distribution shifts during deployment. Recent advances extend TTA toward *continuous self-improvement* (Iwasawa and Matsuo, 2021; Liu et al., 2023), allowing models to refine their behavior through online optimization. Recent *agent-based* studies operationalize such continual improvement via reflection, planning, and self-evolution. Works like (Park et al., 2023; Shinn et al., 2023; Wang et al., 2023; Zhao et al., 2025; Zhou et al., 2024) and newer frameworks, including (Chen et al., 2025; Huang et al., 2025) demonstrate how agents autonomously revise plans, synthesize feedback, and co-evolve (Gao et al., 2025). These advances mark a shift from static adaptation toward adaptive, self-improving agents capable of continual learning during deployment. Building on this trend, we propose to benchmark such dynamics from a novel *self-evolving memory* perspective.

### 2.2. Self-evolving Memory
Early LLM memory systems primarily served as *passive storage*, maintaining recent dialogues or retrieved facts to compensate for limited context windows (Asai et al., 2024a; Lewis et al., 2020; Liu, 2022; Packer et al., 2023; Zhong et al., 2023). Subsequent studies introduced richer management mechanisms, including differentiable read–write controllers (Liang et al., 2023; Modarressi et al., 2023) and evaluations under realistic conversational settings (Maharana et al., 2024a; Wu et al., 2024b). Beyond static buffers, recent work explores *policy-driven control*, where the model is explicitly optimized to decide what to store, retrieve, or overwrite (Li et al., 2025; Xu et al., 2025; Yan et al., 2025; Yu et al., 2025; Zhou et al., 2025). Meanwhile, structured memory representations have emerged to organize experiences into relational or procedural forms, as in RepoGraph (Ouyang et al., 2024), MEM0 (Chhikara et al., 2025), Zep (Rasmussen et al., 2025), and Dynamic Cheatsheets (Suzgun et al., 2025). However, there remains no unified evaluation setting and framework for *self-evolving memory*, the ability to reuse and adapt experiences across tasks. Evo-Memory builds on this trajectory by benchmarking how LLMs not only store and recall but also evolve, reorganize, and reuse memory under streaming task settings.

---

## 3. Evo-Memory: Evaluating Self-Evolving Memory in LLM Agents

Existing evaluations of LLMs often treat memory as static recall, overlooking its role in continual adaptation. Evo-Memory provides a unified benchmark to study *self-evolving memory*, where agents retrieve, integrate, and update knowledge over time. As illustrated in Figure 3, the left side shows the test-time evolution process, and the right side outlines the ReMem agent with three modules—*Think, Act, and Refine Memory*. We first formalize the problem setting, then describe two representative implementations, ExpRAG and ReMem, used to instantiate the benchmark.

### 3.1. Problem Formulation
We formalize a general memory-augmented agent as a tuple $(F, U, R, C)$, where $F$ is the base LLM, $U$ is the memory update pipeline, $R$ is the retrieval module, and $C$ is the contextual construction mechanism that transforms retrieved content into the final working context. In our setting, the agent processes a sequence of inputs $\{x_1, x_2, \dots, x_T\}$, and the memory state $M_t$ evolves with the history. At time $t$, the agent receives an input $x_t$, maintains an evolving memory $M_t$, retrieves relevant elements $R(M_t, x_t)$, constructs a contextualized prompt:

$$C_t = C(x_t, R(M_t, x_t))$$

and produces an output:

$$\hat{y}_t = F(C_t)$$

This abstraction unifies a wide spectrum of existing memory mechanisms, from retrieval-augmented generation to dynamic, hierarchical, and workflow-based memories, under a single iterative formulation.

*   **Search.** Given the current input $x_t$, the agent first retrieves relevant memory entries:
    $$R_t = R(M_t, x_t)$$
    where $R$ can represent similarity search, index-based lookup, or attention over stored embeddings. This step captures memory access policies across different algorithms.

*   **Synthesis.** The agent restructures the retrieved information $R_t$ into a working context tailored to the current input $x_t$. This step may involve forming a structured prompt (Wang et al., 2024), selecting key memory items (Chhikara et al., 2025; Xu et al., 2025), or merging retrieved content (Suzgun et al., 2025) into a short summary. We denote the resulting context as $\tilde{C}_t = C(x_t, R_t)$, and the final output is:
    $$\hat{y}_t = F(\tilde{C}_t)$$

*   **Evolve.** After obtaining $\hat{y}_t$, the agent constructs a new memory entry $m_t = h(x_t, \hat{y}_t, f_t)$ that captures the current step’s experience together with the feedback $f_t$, such as whether the task was completed. The memory is then updated via:
    $$M_{t+1} = U(M_t, m_t)$$

Different algorithms instantiate $U$ differently, for example, direct append for retrieval-based memories, summarization or compression for long-term storage, or replacement for bounded-capacity stores. This unified formulation abstracts the essential cycle of *retrieval, synthesis, and evolution* underlying all memory-based agents.

**Dataset Preparation.** Evo-Memory restructures conventional static datasets into *streaming task sequences*, enabling evaluation of how LLMs reuse and evolve memory over time. Each dataset can thus be transformed into a sequence $\tau = \{(x_1, y_1), \dots, (x_T, y_T)\}$, forming a ground-truth trajectory in which earlier tasks provide essential information or strategies for later ones. At each step $t$, the agent processes input $x_t$, retrieves and synthesizes memory, produces prediction $\hat{y}_t$, and updates the memory state $M_t$, yielding the predicted trajectory:

$$(x_1, \hat{y}_1, M_1) \rightarrow (x_2, \hat{y}_2, M_2) \rightarrow \dots \rightarrow (x_T, \hat{y}_T, M_T)$$

This design transforms static benchmarks into interactive evaluation streams that explicitly probe an LLM’s ability to accumulate, adapt, and refine knowledge during deployment.

### 3.2. ExpRAG: Experience Retrieval and Aggregation
As a simple baseline and extension, we define **ExpRAG**, a task-level retrieval-augmented agent. Each memory entry $m_i = S(x_i, \hat{y}_i, f_i)$ encodes a structured experience text with template $S$. At step $t$, the agent retrieves $k$ similar experiences from memory according to a retrieval score $\phi$:

$$R_t = \text{Top-}k_{m_i \in M_t} \phi(x_t, m_i)$$

The model conditions on these retrieved examples following the in-context learning principle:
$$\hat{y}_t = F(x_t, R_t)$$

and appends the new experience to memory:
$$M_{t+1} = M_t \cup \{(x_t, \hat{y}_t, f_t)\}$$

ExpRAG thus performs one-shot experience reuse through retrieval and aggregation. It captures how simple memory-based extensions of in-context learning behave but lacks iterative reasoning or adaptive refinement during inference.

### 3.3. ReMem: Synergizing Reasoning, Acting, and Memory
We propose **ReMem**, a simple yet effective framework that unifies reasoning, action, and memory refinement within a single decision loop. Unlike conventional retrieval-augmented or ReAct-style methods that treat memory as static context, ReMem introduces a third dimension of *memory reasoning*, allowing the agent to actively evaluate, reorganize, and evolve its own memory during problem solving.

At each step $t$, given the current input $x_t$, memory state $M_t$, and previous reasoning traces $o^{1:n-1}_t$ at this step, the agent selects one of three operations:

$$a^n_t \in \{\text{Think, Act, Refine}\}$$

It then performs the operation and transitions according to:

$$o^n_t = \text{Agent}(x_t, M_t, a^n_t)$$

where $o^n_t$ denotes the output generated at step $t$ after $n$ operations, such as an intermediate reasoning trace, an external action, and memory refine thoughts.

Specifically, **Think** produces internal reasoning traces that help decompose the task and guide subsequent actions; **Act** executes an operation in the environment or outputs a response observable to the user; **Refine** performs meta-reasoning over memory, which exploiting useful experiences, pruning noise, and reorganizing $M_t$, to better support future reasoning and action. Within each step, the agent may perform multiple rounds of *Think* and *Refine*, and the step terminates once an *Act* operation is selected. This induces a Markov decision process where the state at step $t$ after $n$ operations is $s^n_t = (x_t, M_t, o^{1:n-1}_t)$, the action space is $\{\text{Think, Act, Refine}\}$, and the transition dynamics are given by the Agent operator together with the environment response. Depending on the task, the Act-output of step $t$ may serve as the final answer for single-step tasks or as an intermediate result in multi-step settings, where the process continues until the overall task is completed.

This unified formulation expands the action space of ReAct-style (Yao et al., 2022) agents by introducing an explicit memory reasoning mechanism. Through this extension, memory becomes an adaptive component that interacts with reasoning in real time rather than remaining a passive context.

---

## 4. Experiments

In this section, we evaluate leading LLMs on the Evo-Memory benchmark under our unified test-time learning pipeline, focusing on five key research questions (RQs):
*   **RQ1:** How do LLM agents perform on Evo-Memory across diverse domains and task types, and does ReMem enhance their test-time learning ability?
*   **RQ2:** What factors influence the effectiveness of memory in different tasks, and how does experience reuse improve task efficiency?
*   **RQ3:** How does task sequence difficulty (e.g., easy vs. hard trajectories) affect memory adaptation and generalization?
*   **RQ4:** How do varying feedback types impact learning dynamics and memory refinement across tasks?
*   **RQ5:** How does cumulative performance evolve over task sequences and time steps, reflecting continual adaptation during deployment?

### 4.1. Experimental Setup

#### 4.1.1. Datasets
Evo-Memory is evaluated on a diverse suite of datasets spanning factual knowledge, reasoning, mathematics, programming, and goal-oriented interaction. For factual and reasoning ability, we include **MMLU-Pro** (Zheng et al., 2024) and **GPQA-Diamond** (Rein et al., 2024). For mathematical problem solving, we use **AIME-24** and **AIME-25**. For tool-use and API grounding, we include **ToolBench**. For multi-turn and goal-oriented interaction, we adopt the **AgentBoard** suite, covering **AlfWorld**, **BabyAI**, **ScienceWorld**, **Jericho**, and **PDDL** tasks.

#### 4.1.2. Evaluation
Evo-Memory evaluates both task performance and memory quality along four dimensions: **Answer accuracy**, **Success rate**, **Step efficiency**, and **Sequence robustness**.

#### 4.1.3. Methods
We benchmark a broad range of agents:
1.  **Agent pipelines without persistent memory:** ReAct, Amem.
2.  **Adaptive agentic memory methods:** SelfRAG, MemOS, Mem0, LangMem.
3.  **Memory-based agents for procedural knowledge:** Dynamic Cheatsheet (DC) variants, Agent Workflow Memory (AWM).
4.  **Proposed evolving-memory framework:** ExpRecent, ExpRAG, and **ReMem**.

### 4.3. Analysis of Results (RQ1)

**Table 1: Single-turn reasoning and QA datasets**

| LLM Backbone | Method | AIME24 | AIME25 | GPQA | MMLU-Pro (Eco.) | MMLU-Pro (Eng.) | MMLU-Pro (Philo.) | ToolBench | Avg. |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Claude 3.7 Sonnet** | Baseline | 0.17 | 0.13 | 0.55 | 0.84 | 0.63 | 0.78 | 0.76 / 0.62 | 0.54 |
| | History | 0.13 | **0.23** | 0.56 | 0.85 | 0.64 | 0.78 | 0.76 / 0.61 | 0.55 |
| | ReAct | 0.17 | 0.10 | 0.57 | 0.84 | 0.63 | 0.76 | 0.76 / 0.61 | 0.54 |
| | Amem | **0.27** | 0.17 | 0.54 | 0.83 | 0.63 | 0.79 | 0.77 / 0.63 | 0.56 |
| | SelfRAG | 0.20 | 0.10 | 0.58 | 0.84 | 0.65 | 0.77 | 0.77 / 0.63 | 0.55 |
| | MemOS | 0.17 | 0.20 | 0.55 | 0.84 | 0.64 | 0.76 | 0.76 / 0.62 | 0.55 |
| | Mem0 | 0.20 | 0.13 | 0.58 | 0.84 | 0.62 | 0.77 | 0.76 / 0.61 | 0.55 |
| | LangMem | 0.10 | 0.13 | 0.53 | 0.77 | 0.56 | 0.66 | 0.77 / 0.63 | 0.49 |
| | DC-Cu | 0.17 | 0.23 | 0.57 | 0.79 | 0.52 | 0.65 | 0.77 / 0.62 | 0.52 |
| | DC-RS | 0.20 | 0.20 | 0.62 | 0.79 | 0.52 | 0.60 | 0.77 / 0.62 | 0.52 |
| | AWM | 0.03 | 0.03 | 0.53 | 0.80 | 0.56 | 0.72 | 0.76 / 0.62 | 0.48 |
| | ExpRecent| 0.13 | 0.20 | 0.61 | **0.86** | 0.63 | 0.78 | 0.82 / 0.66 | 0.56 |
| | ExpRAG | 0.17 | 0.17 | **0.70** | 0.85 | **0.67** | **0.80** | **0.88** / **0.72** | **0.59** |
| | ReMem | 0.13 | 0.13 | 0.67 | **0.86** | 0.65 | 0.80 | 0.87 / 0.71 | 0.58 |
| **Gemini 2.5 Flash** | Baseline | 0.47 | 0.47 | 0.48 | 0.83 | **0.46** | 0.75 | 0.71 / 0.61 | 0.59 |
| | History | 0.60 | 0.47 | 0.43 | 0.84 | 0.42 | 0.78 | 0.62 / 0.54 | 0.58 |
| | ReAct | 0.30 | 0.27 | 0.05 | 0.64 | 0.16 | 0.54 | 0.64 / 0.57 | 0.37 |
| | Amem | **0.70** | **0.57** | 0.52 | 0.83 | 0.42 | 0.72 | 0.72 / 0.60 | 0.63 |
| | SelfRAG | 0.50 | 0.47 | 0.46 | 0.83 | 0.45 | 0.75 | 0.72 / 0.61 | 0.59 |
| | MemOS | 0.47 | 0.47 | 0.50 | 0.82 | **0.46** | 0.75 | 0.71 / 0.61 | 0.59 |
| | Mem0 | 0.50 | 0.47 | 0.45 | 0.83 | 0.46 | 0.74 | 0.71 / 0.61 | 0.59 |
| | LangMem | 0.43 | 0.50 | **0.53** | 0.79 | 0.39 | 0.71 | 0.68 / 0.57 | 0.57 |
| | DC-Cu | 0.60 | 0.40 | 0.48 | 0.79 | 0.44 | 0.69 | 0.70 / 0.59 | 0.58 |
| | DC-RS | 0.53 | 0.37 | 0.48 | 0.80 | 0.42 | 0.69 | 0.68 / 0.57 | 0.56 |
| | AWM | 0.50 | 0.37 | 0.49 | 0.79 | 0.43 | 0.72 | 0.71 / 0.59 | 0.56 |
| | ExpRecent| 0.47 | 0.47 | 0.42 | 0.83 | 0.39 | 0.75 | 0.78 / 0.66 | 0.58 |
| | ExpRAG | 0.43 | 0.47 | 0.42 | 0.83 | 0.43 | 0.78 | **0.87** / **0.73** | 0.60 |
| | ReMem | 0.60 | 0.53 | 0.51 | **0.85** | 0.46 | **0.79** | 0.85 / 0.71 | **0.65** |

Tables 1 and 2 summarize the results across single-turn and multi-turn settings. Overall, Evo-Memory demonstrates that self-evolving memory architectures provide consistent improvements. In single-turn reasoning and QA benchmarks, evolving-memory methods show consistent improvements, with ReMem achieving 0.65 average exact match and 0.85/0.71 API accuracy under Gemini-2.5 Flash.

**Table 2: Multi-turn embodied reasoning benchmarks**

| LLM Backbone | Method | Alf World (S / P) | BabyAI (S / P) | PDDL (S / P) | ScienceWorld (S / P) | Avg. (S / P) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Gemini 2.5 Flash** | Baseline | 0.12 / 0.34 | **0.61** / **0.71** | 0.12 / 0.20 | 0.24 / 0.59 | 0.27 / 0.46 |
| | History | 0.28 / 0.60 | 0.52 / 0.64 | 0.08 / 0.15 | 0.31 / 0.71 | 0.30 / 0.53 |
| | ReAct | 0.24 / 0.56 | 0.48 / 0.63 | **0.22** / **0.33** | 0.34 / 0.71 | 0.32 / 0.56 |
| | Amem | 0.25 / 0.59 | 0.53 / 0.64 | 0.10 / 0.16 | 0.36 / 0.74 | 0.31 / 0.53 |
| | SelfRAG | 0.25 / 0.59 | 0.52 / 0.65 | 0.08 / 0.16 | 0.34 / 0.74 | 0.30 / 0.54 |
| | Mem0 | 0.27 / 0.61 | 0.54 / 0.66 | 0.10 / 0.19 | 0.32 / 0.70 | 0.31 / 0.54 |
| | DC-Cu | 0.25 / 0.59 | 0.53 / 0.64 | 0.08 / 0.17 | 0.29 / 0.71 | 0.29 / 0.53 |
| | DC-RS | 0.27 / 0.60 | 0.53 / 0.66 | 0.07 / 0.15 | 0.33 / 0.73 | 0.30 / 0.54 |
| | AWM | 0.26 / 0.59 | 0.52 / 0.64 | 0.08 / 0.16 | 0.33 / 0.73 | 0.30 / 0.53 |
| | ExpRecent| 0.37 / 0.65 | 0.53 / 0.64 | 0.13 / 0.22 | 0.53 / **0.83** | 0.39 / 0.59 |
| | ExpRAG | 0.59 / 0.79 | 0.56 / 0.65 | 0.17 / 0.27 | 0.53 / 0.81 | 0.46 / 0.63 |
| | ReMem | **0.66** / **0.81** | 0.53 / 0.61 | **0.22** / **0.33** | **0.58** / 0.81 | **0.50** / **0.64** |
| **Claude 3.7 Sonnet** | Baseline | 0.18 / 0.49 | 0.51 / 0.66 | 0.17 / 0.39 | 0.10 / 0.53 | 0.24 / 0.52 |
| | History | 0.50 / 0.73 | 0.48 / 0.66 | 0.65 / 0.85 | 0.32 / 0.74 | 0.49 / 0.74 |
| | ReAct | 0.51 / 0.75 | 0.57 / 0.72 | 0.75 / 0.91 | 0.44 / 0.77 | 0.57 / 0.79 |
| | Amem | 0.48 / 0.73 | 0.46 / 0.64 | 0.62 / 0.84 | 0.33 / 0.73 | 0.47 / 0.73 |
| | SelfRAG | 0.52 / 0.75 | 0.46 / 0.64 | 0.65 / 0.84 | 0.31 / 0.74 | 0.49 / 0.74 |
| | Mem0 | 0.51 / 0.74 | 0.48 / 0.66 | 0.65 / 0.84 | 0.37 / 0.76 | 0.50 / 0.75 |
| | DC-Cu | 0.50 / 0.74 | 0.50 / 0.67 | 0.62 / 0.84 | 0.33 / 0.75 | 0.49 / 0.75 |
| | DC-RS | 0.50 / 0.74 | 0.52 / 0.68 | 0.62 / 0.84 | 0.34 / 0.74 | 0.50 / 0.75 |
| | AWM | 0.49 / 0.73 | 0.53 / 0.68 | 0.60 / 0.82 | 0.34 / 0.74 | 0.49 / 0.74 |
| | ExpRecent| 0.66 / 0.83 | 0.63 / 0.73 | 0.53 / 0.76 | 0.49 / 0.82 | 0.58 / 0.79 |
| | ExpRAG | 0.74 / 0.89 | 0.62 / 0.72 | 0.72 / 0.89 | 0.46 / 0.76 | 0.63 / 0.82 |
| | ReMem | **0.92** / **0.96** | **0.73** / **0.83** | **0.83** / **0.95** | **0.62** / **0.89** | **0.78** / **0.91** |

In multi-turn reasoning environments, ReMem and ExpRAG achieve strong and stable performance. Notably, ReMem reaches 0.92/0.96 on BabyAI and 0.95/0.62 on ScienceWorld with Claude. These results indicate that continual reflection and refinement substantially improve procedural knowledge accumulation.

### 4.4. Analysis of Memory Improvement (RQ2)
Figure 4 shows that ReMem’s improvement strongly correlates with within-dataset task similarity. Tasks with higher embedding cluster ratios, such as PDDL and AlfWorld, yield larger gains. Figure 5 compares step efficiency; ReMem consistently requires fewer steps to complete tasks.

### 4.5. Task Sequence: Easy v.s. Hard (RQ3)

**Table 3: Comparison of memory-based agents under different sequence difficulty**

| Direction | Method | AlfWorld (S / P) | ScienceWorld (S / P) | Avg. (S / P) |
| :--- | :--- | :---: | :---: | :---: |
| Base | Base | 0.50 / 0.73 | 0.32 / 0.74 | 0.41 / 0.74 |
| **Easy→Hard** | ExpRecent | 0.66 / 0.82 | 0.48 / 0.83 | 0.57 / 0.83 |
| | ExpRAG | 0.77 / 0.87 | 0.37 / 0.71 | 0.57 / 0.79 |
| | ReMem | **0.91** / **0.96** | **0.63** / **0.88** | **0.77** / **0.92** |
| **Hard→Easy** | ExpRecent | 0.72 / 0.85 | 0.47 / 0.80 | 0.60 / 0.83 |
| | ExpRAG | 0.87 / 0.92 | 0.51 / 0.81 | 0.69 / 0.87 |
| | ReMem | **0.94** / **0.97** | **0.68** / **0.90** | **0.81** / **0.94** |

Table 3 examines adaptation to task difficulty. Baseline methods degrade when moving from easy to hard tasks. ReMem maintains strong performance, showing that continual reflection enables retention of transferable knowledge.

### 4.6. Analysis of Feedback (RQ4)
Table 4 evaluates how agents perform when both successful and failed task experiences are stored. Evolving-memory approaches, particularly ReMem, remain robust by actively refining stored experiences, whereas baselines drop in performance due to noise.

**Table 4: Results with both successful and failed task experiences**

| Model | Method | Alf World (S / P) | ScienceWorld (S / P) | Avg. (S / P) |
| :--- | :--- | :---: | :---: | :---: |
| **Claude 3.7** | Amem | 0.49 / 0.73 | 0.31 / 0.74 | 0.40 / 0.74 |
| | ExpRAG | 0.76 / 0.90 | 0.27 / 0.63 | 0.52 / 0.77 |
| | ReMem | **0.92** / **0.96** | **0.69** / **0.91** | **0.81** / **0.94** |
| **Gemini 2.5** | Amem | 0.22 / 0.57 | 0.39 / 0.75 | 0.31 / 0.66 |
| | ExpRAG | 0.25 / 0.60 | 0.51 / 0.78 | 0.38 / 0.69 |
| | ReMem | **0.57** / **0.76** | 0.50 / 0.75 | **0.54** / **0.76** |

### 4.7. Performance w.r.t Time Steps (RQ5)
Figure 6 shows the cumulative accuracy. ReMem consistently achieves faster adaptation and more stable retention over time compared to the History baseline.

---

## 5. Conclusion

Self-evolving memory is a fundamental yet underexplored aspect of LLM capability. While prior work centers on static conversational recall, it overlooks how models accumulate and reuse experience across evolving task streams. Evo-Memory fills this gap by transforming static datasets into streaming trajectories. Our results show that memory can substantially enhance performance but remains fragile in stability and procedural reuse. To foster progress, we introduce ExpRAG for experience retrieval and ReMem for interleaving reasoning, action, and memory updates. We hope Evo-Memory serves as a unified platform for building LLMs with reliable and continually improving memory.

***
