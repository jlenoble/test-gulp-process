import { cacheFiles } from "../helpers";
import { DestFn, DestOptions } from "./options";

export const snapshot = (glob: string | string[]): DestFn => async (
  options: DestOptions
): Promise<boolean> => {
  await cacheFiles({
    glob,
    base1: options.dest,
    debug: options && options.debug
  });

  return true;
};
