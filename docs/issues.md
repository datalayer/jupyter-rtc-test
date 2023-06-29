# Issues

This page contains encountered issues while running the tests. [Potential solutions](./solutions.md) are being explored.

## Ypy Array Deep Observe

[test_ypy_array:test_deep_observe](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l3_ypy/test_ypy_array.py#L241): Failing with `Fatal Python error: Segmentation fault` coming from `python3.11/multiprocessing/pool.py`.

## Insert and Delete random characters

[Insert and delete random characters](https://github.com/datalayer/jupyter-rtc-test/blob/main/src/components/cli/tabs/scenarii/scenarii.json#L3) scenario: Node.js often do not converge, Python and Browser sometimes do not converge.

## YNotebook Update Source

[test_jupyter_ydoc_update_source](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l6_jupyter_ydoc/cli/test_jupyter_ydoc_update_source.py) -  Fails to append instead of replacing the text content.

## Caught error while handling a Yjs update Error

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
```

## Set the content of a YNotebook cell

[Set the content of a YNotebook cell](https://github.com/datalayer/jupyter-rtc-test/blob/main/src/components/cli/tabs/scenarii/scenarii.json#L24) scenario: the source sometimes is appended instead of being set.

## KeyError: nbformat

[Set the content of a YNotebook cell](https://github.com/datalayer/jupyter-rtc-test/blob/main/src/components/cli/tabs/scenarii/scenarii.json#L24) scenario: python exception after some time KeyError: 'nbformat' 

```
KeyError: 'nbformat'
Traceback (most recent call last):
  File "/.../../tests/clients/notebook_set.py", line 79, in <module>
    asyncio.run(main())
  File "/.../python3.11/asyncio/runners.py", line 190, in run
    return runner.run(main)
           ^^^^^^^^^^^^^^^^
  File "/.../python3.11/asyncio/runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/.../python3.11/asyncio/base_events.py", line 650, in run_until_complete
    return future.result()
           ^^^^^^^^^^^^^^^
  File "/Users/echarles/private/datalayer-io/src/tech/jupyter/rtc-test/jupyter_rtc_test/stresser/../tests/clients/notebook_set.py", line 64, in main
    "document": json.dumps(notebook.source),
                           ^^^^^^^^^^^^^^^
  File "/.../python3.11/site-packages/jupyter_ydoc/ybasedoc.py", line 70, in source
    return self.get()
           ^^^^^^^^^^
  File "/.../python3.11/site-packages/jupyter_ydoc/ynotebook.py", line 209, in get
    cell = self.get_cell(i)
           ^^^^^^^^^^^^^^^^
  File "/.../python3.11/site-packages/jupyter_ydoc/ynotebook.py", line 104, in get_cell
    if "id" in cell and meta["nbformat"] == 4 and meta["nbformat_minor"] <= 4:
                        ~~~~^^^^^^^^^^^^
```

## Silent failure WebSocket failures

The listeners processing the WebSocket messages may silently fail and the user may not be informed of such failures.

## Ypy does not support Python threads

See Can not access YDoc object created in another thread #113 https://github.com/y-crdt/ypy/issues/113

## Self Mutation

Even without updates, documents are sometimes self mutating.

## Failure isoltion

Ypy failure impacts nodejs and browser and they are not functinal anymore.
