import del from "del";
import path from "path";
import deepKill from "deepkill";
import { ChildProcess } from "child_process";

export const cleanUp = async (
  childProcess: ChildProcess,
  destDir: string,
  BABEL_DISABLE_CACHE?: string
): Promise<void> => {
  if (childProcess) {
    await deepKill(childProcess.pid);
  }

  process.env.BABEL_DISABLE_CACHE = BABEL_DISABLE_CACHE;

  if (path.resolve(destDir).includes(process.cwd())) {
    // @ts-ignore
    await del(destDir);
  }
};
