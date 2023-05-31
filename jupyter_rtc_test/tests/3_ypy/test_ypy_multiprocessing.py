import threading
from threading import Lock, Thread

from multiprocessing.pool import ThreadPool

import pytest

from y_py import YDoc


PROCESSES = 2


doc = YDoc()
array = doc.get_array("test")
contents = [True, 42, "string"]

lock = Lock()


def custom_hook(args):
    print(f'Thread failed: {args.exc_value}')

threading.excepthook = custom_hook


def task(lock):
    with lock:
        with doc.begin_transaction() as txn:
            array.insert_range(txn, 0, contents)
    return "done"


def test_thread():
    """
    This test has following warning:
    left: `ThreadId(2)`,
    right: `ThreadId(1)`: y_py::y_doc::YDoc is unsendable, but sent to another thread!

    See "Can not access YDoc object created in another thread" https://github.com/y-crdt/ypy/issues/113
   """
    thread = Thread(target=task, args=(lock,))
    thread.start()
    print('Waiting for the new thread to finish...')
    thread.join()
    print("Thread is finished")


@pytest.mark.skip
def test_threadpool():
    """
    This test should be skipped for now as blocking.
    """
    with ThreadPool(processes=PROCESSES) as pool:
        result = pool.apply(task, (lock,))
        assert result is "done"
