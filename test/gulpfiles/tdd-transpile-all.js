import gulp from "gulp";
import babel from "gulp-babel";

const glob = "src/**/*.ts";
const dest = "build";

gulp.task("exec:transpile:all", () => {
  return gulp
    .src(glob, { base: process.cwd() })
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task("watch:transpile:all", done => {
  gulp.watch(glob, gulp.series("exec:transpile:all")).on("ready", done);
});

gulp.task(
  "tdd:transpile:all",
  gulp.series("exec:transpile:all", "watch:transpile:all")
);

gulp.task("default", gulp.series("tdd:transpile:all"));
