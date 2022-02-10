import { Router } from 'express';
let app = Router();
import { Cloudlink } from '../lib/thirdparty/cloudlink/index.js';
let client = new Cloudlink('wss://server.meower.org');
let tmp = {};
import { account } from '../lib/firstparty/classes.js';
import crypto from 'crypto';

client.on('connected', async () => {
  client.send({
    cmd: 'direct',
    val: {
      cmd: 'ip',
      val: await fetch('https://api.ipify.org').then((res) => res.text()),
    },
  });
  client.send({
    cmd: 'direct',
    val: { cmd: 'type', val: 'js' },
  });
  client.send({ cmd: 'direct', val: 'meower' });
  client.send({
    cmd: 'direct',
    val: {
      cmd: 'authpswd',
      val: {
        username: process.env.account,
        pswd: process.env.password,
      },
    },
  });
});

client.on('pvar', (data) => {
  tmp[data.val] = data.origin;
});

app.get('/login', (req, res) => {
  res.redirect('https://openly.meower.org/login');
});

app.get('/logout', (req, res) => {
  if (req.auth) {
    res.redirect('https://openly.meower.org/logout');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.post('/logout', async (req, res) => {
  if (req.auth) {
    res.db.tokens.delete(req.cookies.authorization);
    res.setHeader('Set-Cookie', `authorization=; Path=/;`);
    res.redirect('https://openly.meower.org/');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/token', async (req, res) => {
  var username = tmp[req.query.token];
  tmp[req.query.token] = undefined;
  if (username) {
    if (await res.db.users.has(username)) {
      var user = await res.db.users.get(username);
    } else {
      var user = new account(username);
      res.db.users.set(username, user);
    }
    var token = crypto.randomUUID();
    res.db.tokens.set(token, username);
    res.setHeader('Set-Cookie', `authorization=${token}; Path=/;`);
    res.send(token);
  } else {
    res.redirect('/accounts/login');
  }
});

export default app;
