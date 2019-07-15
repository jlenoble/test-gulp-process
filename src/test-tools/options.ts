export interface DestOptions {
  dest: string;
  debug?: boolean;
}

export type Fn = (options: Options) => Promise<boolean>;
