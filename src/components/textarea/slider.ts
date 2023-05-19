import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

// iceServer override for cellular sync.
const peerOpts = {
  config: {
    iceServers: [
      { urls: 'stun:openrelay.metered.ca:80' },
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:80?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      {
        url: 'turn:turn.bistri.com:80',
        credential: 'homeo',
        username: 'homeo'
      },
      {
        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
      }
    ]
  }
};

const signaling = [
  // 'wss://y-webrtc-signaling-eu.herokuapp.com',
  // 'wss://y-webrtc-signaling-us.herokuapp.com'
  // 'wss://signaling.yjs.dev'
  'wss://y-webrtc-eu.fly.dev'
];

const ydoc = new Y.Doc();

// @ts-ignore
const provider = new WebrtcProvider('observable-shared-state', ydoc, {
  signaling,
  peerOpts
});

const ymap = ydoc.getMap('slider');
const slider = document.querySelector('#slider') as any;
const client = document.querySelector('#client') as any;
const value = document.querySelector('#value') as any;

ymap.observe(event => {
  slider.value = ymap.get('value');
  value.innerHTML = slider.value;
});

slider.addEventListener('input', event => {
  ymap.set('value', event.target.value);
  console.log(ymap.get('value'));
});

client.innerHTML = client.innerHTML + ydoc.clientID;
slider.value = ymap.get('value') || slider.value;
value.innerHTML = slider.value;
