export type Fact = {
  id: string;
  type?: string;
  fact: string;
  source: string;
  lang: 'ko' | 'en';
  answer?: boolean;
}