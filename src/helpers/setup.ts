import childProcessData from "child-process-data";
import { spawn } from "child_process";
import path from "path";
import gulp from "gulp";
import babel from "gulp-babel";
import noop from "gulp-noop";
import rename from "gulp-rename";

export interface SetupOptions {
  sources: string | string[];
  gulpfile: string;
  dest?: string;
  createDest?: boolean;
  transpileSources?: boolean;
  transpileGulp?: boolean;
}

export interface NormalizedSetupOptions {
  sources: string | string[];
  gulpfile: string;
  dest: string;
  createDest: boolean;
  transpileSources: boolean;
  transpileGulp: boolean;
}

let counter = 0;

export const newDest = (): string => {
  counter++;
  return `/tmp/${path.basename(process.cwd())}_${Date.now()}_${counter}`;
};

export const copySources = (options: NormalizedSetupOptions): Promise<void> => {
  return new Promise((resolve, reject): void => {
    gulp
      .src(options.sources, { base: process.cwd() })
      .pipe(options.transpileSources ? babel() : noop())
      .on("end", resolve)
      .on("error", reject)
      .pipe(gulp.dest(options.dest));
  });
};

export const copyGulpfile = (
  options: NormalizedSetupOptions
): Promise<void> => {
  return new Promise((resolve, reject): void => {
    gulp
      .src(options.gulpfile, { base: "test/gulpfiles" })
      .pipe(options.transpileGulp ? babel() : noop())
      .on("end", resolve)
      .on("error", reject)
      .pipe(rename("gulpfile.babel.js"))
      .pipe(gulp.dest(options.dest));
  });
};

export const copyBabelrc = (options: NormalizedSetupOptions): Promise<void> => {
  return new Promise((resolve, reject): void => {
    gulp
      .src(".babelrc")
      .on("end", resolve)
      .on("error", reject)
      .pipe(gulp.dest(options.dest));
  });
};

export const linkNodeModules = async (
  options: NormalizedSetupOptions
): Promise<void> => {
  await childProcessData(
    spawn("ln", ["-s", path.join(process.cwd(), "node_modules"), options.dest])
  );
};
