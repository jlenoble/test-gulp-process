import gulp from "gulp";

gulp.task("default", done => {
  console.log(`Starting 'default'...`);
  console.log(`Starting 'exec:transpile'...`);
  console.log(`Starting 'exec:copy'...`);
  console.log(`Task 'copy' (SRC): src/gulptask.js`);
  console.log(`Task 'copy' (SRC): 1 item`);
  console.log(`Task 'copy' (NWR): src/gulptask.js`);
  console.log(`Task 'copy' (NWR): 1 item`);
  console.log(`Finished 'exec:copy' after`);
  console.log(`Starting 'transpile'...`);
  console.log(`Task 'transpile' (SRC): tmp/src/gulptask.js`);
  console.log(`Task 'transpile' (SRC): 1 item`);
  console.log(`Task 'transpile' (NWR): tmp/src/gulptask.js`);
  console.log(`Task 'transpile' (DST): tmp/src/gulptask.js`);
  console.log(`Task 'transpile' (NWR): 1 item`);
  console.log(`Task 'transpile' (DST): 1 item`);
  console.log(`Finished 'transpile' after`);
  console.log(`Finished 'exec:transpile' after`);
  console.log(`Finished 'default' after`);

  done();
});
