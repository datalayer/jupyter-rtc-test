import asyncio
import pytest

from y_py import YDoc


NUM  = 1000
CONTENT = [True, 0, 1.2, {}, "string"]

doc = YDoc()
array = doc.get_array("test")


async def mutate_ydoc():
    with doc.begin_transaction() as txn:
        array.insert_range(txn, 0, CONTENT)


@pytest.mark.asyncio
async def test_array():
    tasks = [mutate_ydoc() for i in range(NUM)]
    await asyncio.gather(*tasks)
    test = doc.get_array("test")
    assert len(test) == (NUM * len(CONTENT))
