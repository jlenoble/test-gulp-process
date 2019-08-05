import chalk from "chalk";
import { rebaseGlob, resolveGlob } from "polypath";
import del from "del";
import { chDir } from "cleanup-wrapper";
import { DestFn, DestOptions } from "./options";

export const deleteFile = (_file: string | string[]): DestFn => async (
  options: DestOptions
): Promise<boolean> => {
  const destGlob = rebaseGlob(_file, options.dest);
  const files: string[] = await resolveGlob(destGlob);

  if (!files.length) {
    const str = JSON.stringify(destGlob);

    if (options && options.debug) {
      console.info(`${chalk.green(str)} cannot be ${chalk.cyan("deleted")}:`);
    }

    throw new Error(`${chalk.green(str)} resolves to nothing`);
  }

  const exec = async (): Promise<void> => {
    await Promise.all(
      files.map(
        (file): Promise<string[]> => {
          if (options && options.debug) {
            console.info(`${chalk.cyan("Deleting")} ${chalk.green(file)}`);
          }
          return del(file);
        }
      )
    );
  };

  return chDir(options.dest, exec)();
};
