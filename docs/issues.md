# Issues

Currently found issues.

## Unit Tests

[test_ypy_array:test_deep_observe](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l3_ypy/test_ypy_array.py#L241)

- Failing with `Fatal Python error: Segmentation fault` coming from `python3.11/multiprocessing/pool.py`.

## Integration Test

[test_jupyter_ydoc_update_source](https://github.com/datalayer/jupyter-rtc-test/blob/main/jupyter_rtc_test/tests/l6_jupyter_ydoc/stress/test_jupyter_ydoc_update_source.py)

- Failing appending instead of replacing the text content.

## UI Tests Scenarii

[Insert and delete characters](https://github.com/datalayer/jupyter-rtc-test/blob/c757790dd690748d1ea96c230c71c0f5360f38df/src/components/stress/tabs/scenarii/scenarii.json#L3) scenario

- Node.js often do not converge.
