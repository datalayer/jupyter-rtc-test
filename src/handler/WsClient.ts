class WsClient {
  private _ws: WebSocket;
  constructor(address: string) {
    this._ws = new WebSocket(address);
    this._ws.onerror = (event: Event) => {
      console.error('WsClient error', event);
    }
    this._ws.onmessage = (message: MessageEvent) => {
      console.log('WsClient message', message);
    }
  }
  startTest() {
    this._ws.send('start');
  }
  stopTest() {
    this._ws.send('stop');
  }
  get ws() {
    return this._ws;
  }
}


export default WsClient;
