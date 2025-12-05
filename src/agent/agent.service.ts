import { Injectable, Logger } from '@nestjs/common';
import { StateGraph, END } from '@langchain/langgraph';
import { AgentState } from '../common/interfaces/agent-state.interface';
import { MemoryService } from '../memory/memory.service';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentService {
  private graph: any;
  private model: ChatOpenAI;
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private memoryService: MemoryService,
    private configService: ConfigService
  ) {
    this.model = new ChatOpenAI({
      openAIApiKey: this.configService.get('OPENAI_API_KEY'),
      modelName: 'gpt-4o',
      temperature: 0,
    });
    this.initializeGraph();
  }

  private initializeGraph() {
    const workflow = new StateGraph<AgentState>({
      channels: {
        messages: {
          value: (x: any, y: any) => x.concat(y),
          default: () => [],
        },
        currentTask: {
          value: (x: any, y: any) => y ?? x,
          default: () => "",
        },
        retrievedMemories: {
          value: (x: any, y: any) => y ?? x,
          default: () => [],
        },
        steps: {
          value: (x: any, y: any) => y ?? x,
          default: () => 0,
        }
      }
    });

    // Define Nodes
    workflow.addNode("retrieve", async (state) => {
      this.logger.log("Retrieving memories...");
      const memories = await this.memoryService.searchMemories(state.currentTask);
      const memoryContent = memories.map(m => m.content);
      return { retrievedMemories: memoryContent };
    });

    workflow.addNode("agent", async (state) => {
      this.logger.log("Agent thinking...");
      const { currentTask, retrievedMemories } = state;
      
      const systemPrompt = `You are an Evo-Memory Agent.
      Task: ${currentTask}
      Memories: ${retrievedMemories.join('\n')}
      
      Decide the next step: THINK, ACT, or REFINE.
      For now, just output your thought process.`;

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        ...state.messages
      ]);

      return { messages: [response], steps: state.steps + 1 };
    });

    // Define Edges
    workflow.addEdge("retrieve" as any, "agent" as any);
    workflow.addEdge("agent" as any, END); // Simplified for now

    workflow.setEntryPoint("retrieve" as any);

    this.graph = workflow.compile();
  }

  async processTask(task: string) {
    const result = await this.graph.invoke({
      currentTask: task,
      messages: [new HumanMessage(task)],
      steps: 0
    });
    return result;
  }
}
