import ws from 'websocket';
globalThis.WebSocket = ws.w3cwebsocket;

class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, cb) {
    if (typeof this.events[event] !== 'object') this.events[event] = [];
    this.events[event].push(cb);
  }
  emit(event, data) {
    if (typeof this.events[event] !== 'object') return;
    this.events[event].forEach((cb) => cb(data));
  }
}
class Cloudlink {
  constructor(server) {
    this.events = new EventEmitter();
    this.ws = new WebSocket(server);
    this.ws.onopen = async () => {
      this.events.emit('connected');
    };
    this.ws.onmessage = (socketdata) => {
      var data = JSON.parse(socketdata.data);
      if (data.cmd === 'direct') {
        this.events.emit('direct', data);
      } else if (data.cmd === 'pvar') {
        this.events.emit('pvar', data);
      } else if (data.cmd === 'direct') {
        if (data.val.cmd === 'get_user_data') {
          this.events.emit('get_user_data', data.val);
        }
      }
    };
    this.ws.onclose = () => {
      this.events.emit('disconnected');
    };
    this.ws.onerror = (e) => {
      this.events.emit('error', e);
    };
  }
  send(data) {
    this.ws.send(JSON.stringify(data));
  }
  on(event, cb) {
    this.events.on(event, cb);
  }
  disconnect() {
    this.ws.close();
  }
}

export { EventEmitter, Cloudlink };
