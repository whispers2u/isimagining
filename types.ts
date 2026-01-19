
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  provider: 'gemini' | 'n8n';
  settings: {
    aspectRatio: AspectRatio;
  };
}

export interface UserConfig {
  n8nWebhookUrl: string;
  useN8n: boolean;
}
