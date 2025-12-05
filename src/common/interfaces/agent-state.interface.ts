import { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  messages: BaseMessage[];
  currentTask: string;
  retrievedMemories: string[];
  steps: number;
}
