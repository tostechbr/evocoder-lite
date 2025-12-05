export interface Memory {
  id?: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
}
