import gulp from "gulp";
import babel from "gulp-babel";

const glob = "src/**/*.js";
const dest = "build";

gulp.task("exec:transpile:all", () => {
  return gulp
    .src(glob, { base: process.cwd() })
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task("default", gulp.series("exec:transpile:all"));
