# 🧬 EvoCoder-Lite

> **"Agentes que lembram o que foi dito, mas aprendem como resolver."**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red)](https://nestjs.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph.js-latest-green)](https://langchain-ai.github.io/langgraphjs/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Implementação Open Source em **TypeScript** da arquitetura **ReMem** apresentada no paper *"Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory"* (Google DeepMind, Novembro 2025).

## ✨ Features

- 🧠 **Memória Auto-Evolutiva**: O agente aprende com cada interação, evitando repetir erros
- 🔄 **Test-time Evolution**: Melhora continuamente sem necessidade de fine-tuning
- 🎯 **Think-Act-Refine Loop**: Raciocínio iterativo que refina memória em tempo real
- 📚 **Experiência Reutilizável**: Aprende com erros e sucessos passados
- 🚀 **TypeScript + NestJS**: Stack moderna, type-safe e escalável
- 🔍 **Busca Semântica**: Recupera experiências relevantes usando embeddings
- 🛡️ **Sandbox Seguro**: Execução de código em ambiente isolado

## 🎯 O Problema que Resolve

Agentes de IA atuais têm **memória conversacional** (lembram o que foi dito), mas carecem de **memória procedural** (não aprendem com experiência). 

**Exemplo:** Se você pedir para corrigir um bug e o agente errar, na próxima vez ele provavelmente cometerá o mesmo erro. EvoCoder-Lite resolve isso aprendendo continuamente.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (para ChromaDB, opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/tostechbr/evocoder-lite.git
cd evocoder-lite

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves de API

# Inicie o servidor
npm run start:dev
```

## 📖 Documentação

- 📘 [Documentação Completa](./docs/README.md)
- 🏗️ [Arquitetura do Projeto](./docs/projeto.md)
- 📄 [Paper Original](./docs/paper.md)
- 🗺️ [Roadmap NestJS](./docs/roadmap-nestjs.md)
- 🧠 [Técnicas de Memória](./docs/tecnicas-memoria.md)
- 🚀 [Guia Open Source](./docs/open-source-guide.md)

## 🏗️ Arquitetura

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  API (NestJS)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  Agent Service  │◄─────┤   LangGraph  │
│   (ReMem)      │      │    (Grafo)   │
└──────┬──────────┘      └──────────────┘
       │
       ├──► Retrieve (Busca Memórias)
       ├──► Think (Raciocina)
       ├──► Act (Executa)
       ├──► Refine (Refina Memória)
       └──► Persist (Salva Lições)
```

## 🧪 Tecnologias

- **TypeScript** - Linguagem principal
- **NestJS** - Framework backend
- **LangGraph.js** - Orquestração do agente
- **LangChain.js** - Integração com LLMs
- **ChromaDB** / **Supabase** - Banco vetorial
- **OpenAI** / **Ollama** - Modelos de linguagem
- **vm2** - Sandbox de execução

## 📊 Status do Projeto

🚧 **Em Desenvolvimento Ativo**

- [x] Documentação e planejamento
- [x] Arquitetura definida
- [ ] Setup inicial do projeto NestJS
- [ ] MVP (ExpRAG)
- [ ] ReMem completo
- [ ] Primeira release (v1.0.0)

Veja o [Roadmap](./docs/roadmap-nestjs.md) para mais detalhes.

## 🤝 Contribuindo

Contribuições são muito bem-vindas! 🎉

Veja nosso [Guia de Contribuição](./CONTRIBUTING.md) para detalhes.

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🎓 Baseado em Pesquisa

Este projeto implementa a arquitetura **ReMem** do paper:

> **Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory**  
> Google DeepMind & University of Illinois Urbana-Champaign (2025)

[📄 Ler Paper](./docs/paper.md)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).

## 🙏 Agradecimentos

- Google DeepMind pelo paper Evo-Memory
- Comunidade LangChain/LangGraph
- Todos os contribuidores

## 📮 Contato

- **Issues**: [GitHub Issues](https://github.com/tostechbr/evocoder-lite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tostechbr/evocoder-lite/discussions)

## ⭐ Se este projeto te ajudou, considere dar uma estrela!

---

**Feito com ❤️ pela comunidade open source**

