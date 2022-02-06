class account {
  constructor(username) {
    if (username !== undefined) {
      this.username = username;
      this.name = username;
      this.image = 'https://via.placeholder.com/150';
      this.bio = '';
      this.posts = []; // see post class
      this.notifications = [];
      this.followers = [];
      this.following = [];
      this.date = new Date();
    } else {
      throw new Error('come on, give me a username');
    }
  }
}

// posts and stuff

class post {
  constructor(platform, title, discription, content){
    this.platform = platform;
    this.title = title;
    this.discription = discription;
    this.content = content;
    this.date = new Date();
  }
}

export { account, post };