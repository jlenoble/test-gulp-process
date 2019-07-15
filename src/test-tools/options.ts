export interface DestOptions {
  dest: string;
  debug?: boolean;
}

export type Fn = (options: DestOptions) => Promise<boolean>;
