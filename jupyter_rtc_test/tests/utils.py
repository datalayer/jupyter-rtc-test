from y_py import (
    encode_state_vector, encode_state_as_update, apply_update
)


def transact(self, callback):
    with self.begin_transaction() as txn:
        return callback(txn)


def exchange_updates(docs):
    for d1 in docs:
        for d2 in docs:
            if d1 != d2:
                state_vector = encode_state_vector(d1)
                diff = encode_state_as_update(d2, state_vector)
                apply_update(d1, diff)


def stringify_source(nb: dict) -> dict:
    """Stringify in-place the cell sources."""
    for cell in nb["cells"]:
        cell["source"] = (
            "".join(cell["source"]) if isinstance(cell["source"], list) else cell["source"]
        )
    return nb
