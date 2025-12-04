import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Módulos serão adicionados nas próximas fases
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

