import * as Y from "yjs";

const WebSocket = require('ws')
const http = require('http')

const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
const mutex = require('lib0/dist/mutex.cjs')
const map = require('lib0/dist/map.cjs')

const syncProtocol = require('y-protocols/dist/sync.cjs')

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1

const messageSync = 0

const docs = new Map()

const send = (doc, conn, m) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    onClose(doc, conn)
  }
  try {
    conn.send(m, err => { err != null && onClose(doc, conn) })
  } catch (e) {
    onClose(doc, conn)
  }
}

const updateHandler = (update, origin, doc) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  doc.conns.forEach((_, conn) => send(doc, conn, message))
}

class WSSharedDoc extends Y.Doc {
  public name = null;
  public mux = null;
  public conns = new Map()
  constructor (name) {
    super({ gc: false })
    this.name = name
    this.mux = mutex.createMutex()
    this.on('update', updateHandler)
  }
}

const onMessage = (conn, doc, message) => {
  const encoder = encoding.createEncoder()
  const decoder = decoding.createDecoder(message)
  const messageType = decoding.readVarUint(decoder)
  switch (messageType) {
    case messageSync:
      encoding.writeVarUint(encoder, messageSync)
      syncProtocol.readSyncMessage(decoder, encoder, doc, null)
      if (encoding.length(encoder) > 1) {
        send(doc, conn, encoding.toUint8Array(encoder))
      }
      break
  }
}

const getDoc = (docname) => map.setIfUndefined(docs, docname, () => {
  const doc = new WSSharedDoc(docname)
  docs.set(docname, doc)
  return doc
})

const onClose = (doc, conn) => {
  if (doc.conns.has(conn)) {
    doc.conns.delete(conn)
  }
  conn.close()
}

const setupWSConnection = (conn, req, { docName = req.url.slice(1).split('?')[0], gc = true } = {}) => {
  conn.binaryType = 'arraybuffer'
  const doc = getDoc(docName)
  doc.conns.set(conn, new Set())
  conn.on('message', message => onMessage(conn, doc, new Uint8Array(message)))
  conn.on('close', () => onClose(doc, conn))
  // put the following in a variables in a block so the interval handlers don't keep in in scope
  {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    send(doc, conn, encoding.toUint8Array(encoder))
  }
}

const PORT = process.env.PORT || 1234
const wss = new WebSocket.Server({ noServer: true })

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(PORT)

console.log(`WebSocket server running on port`, PORT)
