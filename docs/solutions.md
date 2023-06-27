# Solutions

## Use Ywasm

Use Ywasm in the node.js client. This may better map the Ypy implementation.

## Lock in the Tornado handler

The HTTP requests handled by Tornado are not concurrent. It may still be worth to try to implement concurrent locking to reject thread-safety issues.
