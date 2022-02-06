import { Router } from 'express';
let app = Router();

app.get('/:user', async (req, res) => {
  var data = await res.db.users.get(req.params.user);
  if (data) {
    if (req.auth) {
      if (req.params.user === req.username) {
        res.json(data);
      } else {
        data.notifications = undefined;
        res.json(data);
      }
    } else {
      data.notifications = undefined;
      res.json(data);
    }
  } else {
    res.status(404).send('Not Found');
  }
});

app.post('/:user', async (req, res) => {
  res.status(405).send('Method Not Allowed');
  // post shouldnt be allowed, because directly modifying the entire user ubject is a security risk
});

app.put('/:user', async (req, res) => {
  var data = await res.db.users.get(req.params.user);
  if (data) {
    if (req.auth) {
      if (req.params.user === req.username) {
        var newdata = {
          username,
          name: req.body.name || data.name,
          image: req.body.image || data.image,
          bio: req.body.bio || data.bio,
          posts: data.posts,
          notifications: data.notifications,
          followers: data.followers,
          following: data.following,
          date: data.date,
        };
        res.db.users.set(req.params.user, newdata);
        res.status(200).json(newdata);
      } else {
        res.status(401).send('Unauthorized');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  } else {
    res.status(404).send('Not Found');
  }
});

app.delete('/:user', async (req, res) => {
  if (req.auth) {
    if (req.params.user === req.username) {
      res.db.users.delete(req.params.user);
      res.status(200).json(newdata);
    } else {
      res.status(401).send('Unauthorized');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

export default app;
