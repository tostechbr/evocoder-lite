import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { MemoryModule } from '../memory/memory.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MemoryModule, ConfigModule],
  controllers: [],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}

