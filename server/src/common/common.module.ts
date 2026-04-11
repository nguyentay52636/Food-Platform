import { Global, Module } from '@nestjs/common';
import { TtsService } from './services/tts.service';

@Global()
@Module({
  providers: [TtsService],
  exports: [TtsService],
})
export class CommonModule {}
