import { Injectable } from '@nestjs/common';
import * as textToSpeech from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TtsService {
  private client: textToSpeech.TextToSpeechClient;

  constructor() {
    this.client = new textToSpeech.TextToSpeechClient();
  }

  async generateSpeech(text: string, langCode: string, filename: string): Promise<string | null> {
    try {
      const languageCode = this.mapLangCode(langCode);
      
      const request: any = {
        input: { text },
        voice: { languageCode, ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await this.client.synthesizeSpeech(request);
      
      const publicPath = path.join(process.cwd(), 'public', 'audio');
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }

      const filePath = path.join(publicPath, filename);
      await fs.promises.writeFile(filePath, response.audioContent as Buffer);

      return `/audio/${filename}`;
    } catch (error) {
      console.error('TTS Generation Error:', error);
      return null;
    }
  }

  private mapLangCode(code: string): string {
    const map: Record<string, string> = {
      vi: "vi-VN",
      en: "en-US",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      it: "it-IT",
      pt: "pt-PT",
      ru: "ru-RU",
      ar: "ar-XA",
      hi: "hi-IN",
      th: "th-TH",
      id: "id-ID",
      ms: "ms-MY",
      tr: "tr-TR",
      nl: "nl-NL",
      pl: "pl-PL",
      sv: "sv-SE",
    };
    return map[code.toLowerCase()] || 'en-US';
  }
}
