import gulp from "gulp";

gulp.task("hello", done => {
  console.log("hello");
  done();
});

gulp.task("ciao", done => {
  console.log("ciao");
  done();
});

gulp.task("default", done => {
  console.log("coucou");
  done();
});
