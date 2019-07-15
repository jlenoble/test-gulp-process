import { getCachedFiles } from "../helpers";
import { DestFn, DestOptions } from "./options";
import File from "../classes/file";

type Func = (glob: string | string[]) => DestFn;
type Method = "isNewer" | "isUntouched" | "isSameContent" | "isChangedContent";

const isAsExpected = (method: Method, notText: string): Func => (
  glob
): DestFn => async (options: DestOptions): Promise<boolean> => {
  const files: File[] = await getCachedFiles({ glob, base1: options.dest });
  const truths = await Promise.all(
    files.map((file): Promise<boolean> => file[method]())
  );

  if (truths.some((yes): boolean => !yes)) {
    throw new Error(`${JSON.stringify(glob)} is not ${notText}`);
  }

  return true;
};

export const isNewer = isAsExpected("isNewer", "newer");
export const isUntouched = isAsExpected("isUntouched", "untouched");
export const isSameContent = isAsExpected("isSameContent", "same content");
export const isChangedContent = isAsExpected(
  "isChangedContent",
  "changed content"
);
