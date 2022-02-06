# openly-server
## API Documentation
### Accounts API
The Accounts API is used to login to accounts. It has the following endpoints:  
#### GET /accounts/login
HTML based sign in page that that uses a Cloudlink client to send a UUID in a private variable to the authsvc user on `wss://server.meower.org`
#### GET /accounts/logout
HTML based sign out page that POSTs to /accounts/logout
#### POST /accounts/login
Logs out the user, and destroys the session.
#### GET /accounts/token
Gets an API token for the user if the UUID sent over the Cloudlink server is set as the `token` query string.
### Users API
#### GET /users/:user
Get user data. A token may be provided in the `Authorization` cookie.  
NOTE: to get notifications for the current user, you must provide the `Authorization` cookie.
#### POST /users/:user
POST requests to this endpoint will return with a 405 error. Use the PUT method to update user data.
#### PUT /users/:user
Update user data. A JSON request body and a token in the `Authorization` cookie must be provided.
#### DELETE /users/:user
Delete a user. A token in the `Authorization` cookie must be provided.
### Posts API
#### POST /posts/new
Create a new post. A JSON request body and a token in the `Authorization` cookie must be provided.