import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection } from 'chromadb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Memory } from '../common/interfaces/memory.interface';

@Injectable()
export class MemoryService implements OnModuleInit {
  private client: ChromaClient;
  private collection: Collection;
  private readonly logger = new Logger(MemoryService.name);
  private embeddingFunction: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const chromaUrl = this.configService.get<string>('CHROMADB_URL', 'http://localhost:8000');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.client = new ChromaClient({ path: chromaUrl });
    
    if (openaiApiKey) {
        const embeddings = new OpenAIEmbeddings({ openAIApiKey: openaiApiKey });
        this.embeddingFunction = {
          generate: async (texts: string[]) => await embeddings.embedDocuments(texts)
        };
    } else {
        this.logger.warn('OPENAI_API_KEY not found. Embeddings might fail if not using default.');
    }

    try {
      this.collection = await this.client.getOrCreateCollection({
        name: 'evocoder_memories',
        embeddingFunction: this.embeddingFunction,
      });
      this.logger.log('Connected to ChromaDB and collection "evocoder_memories" ready.');
    } catch (error) {
      this.logger.error('Failed to connect to ChromaDB:', error);
    }
  }

  async addMemory(content: string, metadata: Record<string, any> = {}): Promise<void> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await this.collection.add({
      ids: [id],
      documents: [content],
      metadatas: [{ ...metadata, createdAt: new Date().toISOString() }],
    });
    this.logger.log(`Memory added: ${id}`);
  }

  async searchMemories(query: string, nResults: number = 5): Promise<Memory[]> {
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: nResults,
    });

    const memories: Memory[] = [];
    
    if (results.ids.length > 0) {
        for (let i = 0; i < results.ids[0].length; i++) {
            memories.push({
                id: results.ids[0][i],
                content: results.documents[0][i] || '',
                metadata: results.metadatas[0][i] || {},
                createdAt: new Date(results.metadatas[0][i]?.createdAt as string || Date.now()),
            });
        }
    }

    return memories;
  }
}
