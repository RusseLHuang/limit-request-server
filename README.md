# Heroku link
```
https://quiet-harbor-61097.herokuapp.com/
```

# Local Setup
``
Note: Have Redis installed and running on default port.
``
```
npm install
npm run start
npm run test   // Run testing code
```

# In-Memory Database
In this project i choose Redis as my IMDB over Memcached for several reasons, Redis is the most common IMDB that used these days. Memcached mostly only can be used as a cached which Redis can do what overall Memcached can do, but for persistence data and scaling Redis is win over Memcached. On our case for limiting request we need persistence data and well-scalable which durable for receiving many requests.