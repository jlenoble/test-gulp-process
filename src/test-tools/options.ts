"use strict";

export interface DestOptions {
  dest: string;
  debug?: boolean;
}
export type DestFn = (options: DestOptions) => Promise<boolean>;

export interface NeverOptions {
  debug?: boolean;
}
export type NeverFn = (msg: string, options: NeverOptions) => boolean;

export interface NextTaskOptions {
  task: string;
  debug?: boolean;
}
export type NextTaskFn = (options: NextTaskOptions) => string;

export type Fn = DestFn | NeverFn | NextTaskFn;
