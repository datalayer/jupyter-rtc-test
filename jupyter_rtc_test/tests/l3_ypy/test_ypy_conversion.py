from math import isclose

from y_py import YDoc


def test_int_conversion():
    """
    Tests conversions between Python integers and the Yrs `Any` value.
    To be consistent with Y.js, all floats and integers are represented as `float64`.
    Since Python `int`s can continuously grow, numbers larger than this data type limit will turn into JavaScript `BigInts`.
    Converting back to Python, `int`s will become `float`s unless they were cast as a `BigInt`.
    """
    JS_MAX_NUMBER = 2 ** 53 - 1
    doc = YDoc()
    y_map = doc.get_map("map")
    with doc.begin_transaction() as txn:
        y_map.update(
            txn,
            {
                "big_int": JS_MAX_NUMBER + 1,
                "small_number": 1,
                "edge_number": JS_MAX_NUMBER,
            },
        )
    assert type(y_map["big_int"]) == int and y_map["big_int"] == JS_MAX_NUMBER + 1
    assert type(y_map["small_number"]) == float and isclose(1.0, y_map["small_number"])
    assert type(y_map["edge_number"]) == float and isclose(
        float(JS_MAX_NUMBER), y_map["edge_number"]
    )
