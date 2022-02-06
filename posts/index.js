import { Router } from 'express';
import { post as Post } from '../lib/firstparty/classes.js';
let app = Router();

app.post('/new', async(req, res) => {
  if (req.auth) {
    if (req.body.platform && req.body.title && req.body.description && req.body.content){
      var user = await res.db.users.get(req.username);
      user.posts.push(new Post(req.body.platform, req.body.title, req.body.description, req.body.content))
      res.db.users.set(req.username, user);
      res.status(200).send('OK');
    }else {
      res.status(400).send('Bad Request');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

// TODO: implement post deletion

export default app;
