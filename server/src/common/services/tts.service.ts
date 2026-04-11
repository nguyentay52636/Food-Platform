import { Injectable } from '@nestjs/common';
import * as textToSpeech from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TtsService {
  private client: any;

  constructor() {
    // Chỉ khởi tạo nếu có biến môi trường credentials để tránh crash ứng dụng khi thiếu cấu hình
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        this.client = new textToSpeech.TextToSpeechClient();
        console.log('Google TTS Client initialized successfully.');
      } catch (error) {
        console.warn('Google TTS Client could not be initialized:', error.message);
        this.client = null;
      }
    } else {
      console.warn('GOOGLE_APPLICATION_CREDENTIALS not found. TTS generation is disabled.');
      this.client = null;
    }
  }

  async generateSpeech(text: string, langCode: string, filename: string): Promise<string | null> {
    if (!this.client) {
      console.warn('Skipping TTS generation: Client not initialized (check Google Credentials).');
      return null;
    }

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
      console.error('TTS Generation Error:', error.message);
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
