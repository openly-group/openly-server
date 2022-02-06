import 'dotenv/config'
import fetch from 'node-fetch';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import Jsoning from 'jsoning';
import cookieParser from 'cookie-parser';

let app = express();
globalThis.fetch = fetch;
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));

import loginHandlerNonOauth from './accounts/index.js';
import users from './users/index.js';
import posts from './posts/index.js';

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.db = {
    users: new Jsoning('./database/users.json'),
    tokens: new Jsoning('./database/tokens.json'),
  };
  next();
});

app.use(async (req, res, next) => {
  if (req.cookies.authorization) {
    var username = await res.db.tokens.get(req.cookies.authorization);
    if (username) {
      req.auth = true;
      req.username = username;
    } else {
      return res.status(401).send('Unauthorized');
    }
  } else {
    req.auth = false;
  }
  next();
});

app.use('/accounts', loginHandlerNonOauth);

app.use('/users', users);

app.use('/posts', posts);

app.listen(3000);
