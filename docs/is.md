### `isNewer` and `isUntouched` helper functions !heading

`isNewer(glob)` will throw if at least one of glob files have not been touched since last `snapshot`.

`isUntouched(glob)` will throw if at least one of glob files have been touched since last `snapshot`.

See [`snapshot` helper function](#snapshot-helper-function) example.

### `isSameContent` and `isChangedContent` helper functions !heading

`isSameContent(glob)` will throw if the content of at least one of glob files have been changed since last `snapshot`.

`isChangedContent(glob)` will throw if the content of at least one of glob files have not been changed since last `snapshot`.

See [`snapshot` helper function](#snapshot-helper-function) example.
