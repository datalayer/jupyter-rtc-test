# Issues

This page contains currently found issues so far.

## Unit Tests

[test_ypy_array:test_deep_observe](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l3_ypy/test_ypy_array.py#L241): Failing with `Fatal Python error: Segmentation fault` coming from `python3.11/multiprocessing/pool.py`.

## Integration Tests

[test_jupyter_ydoc_update_source](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l6_jupyter_ydoc/stress/test_jupyter_ydoc_update_source.py)-  Fails to append instead of replacing the text content.

## UI Tests Scenarii

[Insert and delete characters](https://github.com/datalayer/jupyter-rtc-test/blob/c757790dd690748d1ea96c230c71c0f5360f38df/src/components/stress/tabs/scenarii/scenarii.json#L3) scenario: Node.js often do not converge.

Occasional `Caught error while handling a Yjs update Error: Unexpected case`

```
Caught error while handling a Yjs update Error: Unexpected case
    at create (file:///.../src/node_modules/lib0/error.js:12:28)
    at Module.unexpectedCase (file:///.../src/node_modules/lib0/error.js:29:9)
    at findIndexSS (file:///.../src/node_modules/yjs/dist/yjs.mjs:2786:15)
    at findIndexCleanStart (file:///.../src/node_modules/yjs/dist/yjs.mjs:2821:17)
    at getItemCleanStart (file:///.../src/node_modules/yjs/dist/yjs.mjs:2842:18)
    at Item.getMissing (file:///.../src/node_modules/yjs/dist/yjs.mjs:9419:20)
    at integrateStructs (file:///.../src/node_modules/yjs/dist/yjs.mjs:1527:35)
    at file:///.../src/node_modules/yjs/dist/yjs.mjs:1610:25
    at transact (file:///.../src/node_modules/yjs/dist/yjs.mjs:3275:5)
    at readUpdateV2 (file:///.../src/node_modules/yjs/dist/yjs.mjs:1598:3)
e:///.../src/node_modules/yjs/dist/yjs.mjs:3275:5)
    at readUpdateV2 (file:///.../src/node_modules/yjs/dist/yjs.mjs:1598:3)
Caught error while handling a Yjs update Error: Unexpected case
````
