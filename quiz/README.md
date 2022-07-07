## Quiz App

App let's user login/register to create quizzes.
Once published, they can be accessed publically via specially crafted 6 character alphanum link.

## Setup

### Server

1. `cd server`
2. `cp .env.example .env` and update variables
3. `docker-compose up --build -d`
4. Server is running at http://localhost:3010
5. (optional) Open http://localgost:3010/api/users/add-admin to create admin user

### Client

1. `cd fe`
2. `npm i`
3. `npm run start`
4. Frontend is running at http://localhost:3000
5. Register
6. (optional) Use email/password credentials from `/server/.env`

Regards,
Emils Plavenieks
