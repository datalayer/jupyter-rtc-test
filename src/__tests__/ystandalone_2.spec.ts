import * as Y from 'yjs';

describe('Y.js Standalone', () => {
  it('y.js standalone', async () => {
    console.log(
      '-----------------------------------------------------------------'
    );
    const doc = new Y.Doc();

    console.log(
      '-----------------------------------------------------------------'
    );
    // Array.
    const yarray = doc.getArray('array-1');
    yarray.observe(event => {
      console.log('yarray was modified', event);
    });
    // Every time a local or remote client modifies yarray, the observer is called.
    yarray.insert(0, ['val']); // => "yarray was modified"

    console.log(
      '-----------------------------------------------------------------'
    );
    // Map.
    const ymap = doc.getMap('map-1');
    const foodArray = new Y.Array();
    foodArray.insert(0, ['apple', 'banana']);
    ymap.set('food', foodArray);
    ymap.get('food') === foodArray; // => true
    try {
      ymap.set('fruit', foodArray); // => Error! foodArray is already defined
    } catch (error) {
      //  console.error(error)
    }

    console.log(
      '-----------------------------------------------------------------'
    );
    // Text
    const ytext = doc.getText('text-1');
    ytext.insert(0, 'bold text', { bold: true });
    // ytext.applyDelta(delta, { sanitize: false });
    console.log('ytext', ytext);

    console.log(
      '-----------------------------------------------------------------'
    );
    // XML Fragment.
    // const yxml = new Y.XmlFragment()

    console.log(
      '-----------------------------------------------------------------'
    );
    // Xml Element.
    const yxmlel = new Y.XmlElement();
    console.log('yxmlel', yxmlel);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Delta.
    // https://github.com/yjs/docs/blob/main/api/delta-format.md
    const ydoc9 = new Y.Doc();
    const ytext9 = ydoc9.getText();
    ytext9.toDelta(); // => []
    ytext9.insert(0, 'World', { bold: true });
    ytext9.insert(0, 'Hello ');
    ytext9.toDelta(); // => [{ insert: 'Hello ' }, { insert: 'World', attributes: { bold: true } }]
    console.log('ytext9', ytext9.toDelta());

    console.log(
      '-----------------------------------------------------------------'
    );
    // Document Updates - Changes on the shared document are encoded into document updates. Document updates are commutative and idempotent.
    // This means that they can be applied in any order and multiple times.
    // Listen to update events and apply them on remote client.
    const doc1 = new Y.Doc();
    const doc2 = new Y.Doc();
    doc1.on('update', update => {
      Y.applyUpdate(doc2, update);
    });
    doc2.on('update', update => {
      Y.applyUpdate(doc1, update);
    });

    console.log(
      '-----------------------------------------------------------------'
    );
    // All changes are also applied to the other document.
    doc1.getArray('myarray').insert(0, ['Hello doc2, you got this?']);
    doc2.getArray('myarray').get(0); // => 'Hello doc2, you got this?'
    console.log('doc1', doc1);
    console.log('doc2', doc2);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Sync two clients by exchanging the complete document structure.
    const state1 = Y.encodeStateAsUpdate(doc1);
    const state2 = Y.encodeStateAsUpdate(doc2);
    Y.applyUpdate(doc1, state2);
    Y.applyUpdate(doc2, state1);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Sync two clients by computing the differences.
    // This example shows how to sync two clients with the minimal amount of exchanged data by computing only the differences using the state vector of the remote client.
    // Syncing clients using the state vector requires another roundtrip, but can safe a lot of bandwidth.
    const stateVector1 = Y.encodeStateVector(doc1);
    const stateVector2 = Y.encodeStateVector(doc2);
    const diff1 = Y.encodeStateAsUpdate(doc1, stateVector2);
    const diff2 = Y.encodeStateAsUpdate(doc2, stateVector1);
    Y.applyUpdate(doc1, diff2);
    Y.applyUpdate(doc2, diff1);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Relative Positions This API is not stable yet.
    // This feature is intended for managing selections / cursors.
    // When working with other users that manipulate the shared document, you can't trust that an index position (an integer) will stay at the intended location.
    // A relative position is fixated to an element in the shared document and is not affected by remote changes.
    // I.e. given the document "a|c", the relative position is attached to c.
    // When a remote user modifies the document by inserting a character before the cursor, the cursor will stay attached to the character c. insert(1, 'x')("a|c") = "ax|c".
    // When the relative position is set to the end of the document, it will stay attached to the end of the document.
    // Transform to RelativePosition and back
    const relPos1 = Y.createRelativePositionFromTypeIndex(ytext, 2);
    const pos1 = Y.createAbsolutePositionFromRelativePosition(relPos1, doc);
    pos1?.type === ytext; // => true
    pos1?.index === 2; // => true

    // Send relative position to remote client (json).
    const relPos = Y.createRelativePositionFromTypeIndex(ytext, 2);
    const encodedRelPos = JSON.stringify(relPos);

    // send encodedRelPos to remote client.
    const parsedRelPos = JSON.parse(encodedRelPos);
    const pos = Y.createAbsolutePositionFromRelativePosition(parsedRelPos, doc);
    pos?.type === ytext; // => true
    pos?.index === 2; // => true
    /*
    // Send relative position to remote client (Uint8Array)
    const relPos2 = Y.createRelativePositionFromTypeIndex(ytext, 2)
    const encodedRelPos2 = Y.encodeRelativePosition(relPos)
    // send encodedRelPos to remote client..
    const parsedRelPos2 = Y.decodeRelativePosition(encodedRelPos)
    const pos2 = Y.createAbsolutePositionFromRelativePosition(parsedRelPos, remoteDoc)
    pos2.type === remoteytext // => true
    pos2.index === 2 // => true
    */

    console.log(
      '-----------------------------------------------------------------'
    );
    // Y.UndoManager.
    // Yjs ships with an Undo/Redo manager for selective undo/redo of of changes on a Yjs type.
    // The changes can be optionally scoped to transaction origins.
    const ytext1 = doc.getText('text-1');
    const undoManager = new Y.UndoManager(ytext1);
    ytext1.insert(0, 'abc');
    undoManager.undo();
    ytext1.toString(); // => ''
    undoManager.redo();
    console.log('ytext1', ytext1);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Stop Capturing.
    // UndoManager merges Undo-StackItems if they are created within time-gap smaller than options.captureTimeout.
    // Call um.stopCapturing() so that the next StackItem won't be merged.

    console.log(
      '-----------------------------------------------------------------'
    );
    // Without stopCapturing.
    ytext.insert(0, 'a');
    ytext.insert(1, 'b');
    undoManager.undo();
    ytext.toString(); // => '' (note that 'ab' was removed)

    // with stopCapturing
    ytext.insert(0, 'a');
    undoManager.stopCapturing();
    ytext.insert(0, 'b');
    undoManager.undo();
    ytext.toString(); // => 'a' (note that only 'b' was removed)

    console.log(
      '-----------------------------------------------------------------'
    );
    // Specify tracked origins.
    // Every change on the shared document has an origin. If no origin was specified,
    // it defaults to null. By specifying trackedOrigins you can selectively specify which changes should be tracked by UndoManager.
    // The UndoManager instance is always added to trackedOrigins.
    class CustomBinding {}
    const ytext2 = doc.getText('text');
    const undoManager2 = new Y.UndoManager(ytext2, {
      trackedOrigins: new Set([42, CustomBinding])
    });
    ytext2.insert(0, 'abc');
    undoManager2.undo();
    ytext2.toString(); // => 'abc' (does not track because origin `null` and not part of `trackedTransactionOrigins`)
    ytext2.delete(0, 3); // revert change

    doc2.transact(() => {
      ytext2.insert(0, 'abc');
    }, 42);
    undoManager2.undo();
    ytext2.toString(); // => '' (tracked because origin is an instance of `trackedTransactionorigins`)

    doc2.transact(() => {
      ytext2.insert(0, 'abc');
    }, 41);
    undoManager2.undo();
    ytext2.toString(); // => '' (not tracked because 41 is not an instance of `trackedTransactionorigins`)
    ytext2.delete(0, 3); // revert change

    doc2.transact(() => {
      ytext2.insert(0, 'abc');
    }, new CustomBinding());
    undoManager2.undo();

    ytext2.toString(); // => '' (tracked because origin is a `CustomBinding` and `CustomBinding` is in `trackedTransactionorigins`)

    console.log('ytext2', ytext2);

    console.log(
      '-----------------------------------------------------------------'
    );
    // Add additional information to the StackItems.
    // When undoing or redoing a previous action, it is often expected to restore additional meta information like the cursor location or the view on the document. You can assign meta-information to Undo-/Redo-StackItems.
    // const ytext3 = doc.getText('text')
    /*
    const undoManager3 = new Y.UndoManager(ytext3, {
      trackedOrigins: new Set([42, CustomBinding])
    })
    */
    /*
    undoManager3.on('stack-item-added', event => {
      // save the current cursor location on the stack-item
      event.stackItem.meta.set('cursor-location', getRelativeCursorLocation())
    })
    undoManager3.on('stack-item-popped', event => {
      // restore the current cursor location on the stack-item
      restoreCursorLocation(event.stackItem.meta.get('cursor-location'))
    })
    */
  });
});
