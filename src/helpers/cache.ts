import chalk from "chalk";
import { rebaseGlob, resolveGlob } from "polypath";
import File, { Cache } from "../classes/file";

type Path = string;
type Paths = Path[];
type Glob = string | string[];

interface Option {
  glob: Glob;
  base1?: string;
  base2?: string;
  debug: boolean;
}

const cache: Cache = {};

export const purgeCache = (): void => {
  Object.keys(cache).forEach((key): void => {
    delete cache[key];
  });
};

export const cacheFiles = async ({
  glob,
  base1,
  base2,
  debug
}: Option): Promise<void> => {
  const files: Paths = await resolveGlob(rebaseGlob(glob, base1, base2));

  files.forEach((file): void => {
    if (debug) {
      console.info(`${chalk.cyan("Caching")} file '${chalk.green(file)}'`);
    }

    new File({ filepath: file, debug, cache }).cache();
  });
};

export const getCachedFiles = async ({
  glob,
  base1,
  base2,
  debug
}: Option): Promise<File[]> => {
  const files: Paths = await resolveGlob(rebaseGlob(glob, base1, base2));

  return Promise.all(
    files.map(
      (file): File => {
        const f: File = cache[file] && cache[file].file;

        if (debug) {
          if (f) {
            console.info(
              `${chalk.cyan("Remembering")} file '${chalk.green(f.filepath)}'`
            );
          } else {
            console.info(
              `File '${chalk.green(file)}' is ${chalk.cyan("not cached")}`
            );
          }
        }

        return f;
      }
    )
  );
};
