## CAVEAT with callbacks !heading

Callbacks are not called at the actual operation time but when its logging message has been caught by the test runner. Therefore only use the callbacks when the tested process is idle (has finished its last batch of operations).

This means either when the spawned gulp processed has returned or when it is watching for a change that you can trigger explicitly with callbacks such as [`touchFile`](#touchfile-helper-function) or [`nextTask`](#nexttask-helper-function). See the [snapshot test](https://github.com/jlenoble/test-gulp-process/blob/master/test/snapshot.test.js) as an example.
