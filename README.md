# boilerplate-koajs
koajs + postgres

## Quickstart

### Install dependencies:
```$ npm install```

### Create file .env:

```$ touch .env```

Copy to .env
```
APP_PORT=3000
APP_HOST=0.0.0.0
APP_LOG_LEVEL=debug
APP_FILE_COMBINED_LOG=combined.log
APP_FILE_ERROR_LOG=error.log
APP_FILE_DEBUG_LOG=debug.log

DB_HOST=localhost
DB_PORT=5432
DB_NAME=boiler-koajs
DB_USERNAME=root
DB_PASSWORD=123456
DB_DRIVER=postgres
DB_TIMEZONE=+07:00
DB_LOGGING=true

WHITELIST=["*"]

JWT_PUBLIC_KEY=src/keys/ecdsa.pub
JWT_PRIVATE_KEY=src/keys/ecdsa.key
```

### Start the server:
```$ npm start```

View the website at: http://localhost:3000

### Database
#### Dump
```src/database/20221017_init.sql```
#### Design
![Design]](https://user-images.githubusercontent.com/23132269/104262307-ed309880-54b9-11eb-9721-a75c10bbc49b.png)

### Postman 
Link : https://www.getpostman.com/collections/110fad10ebaba23549fd

