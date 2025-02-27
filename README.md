# Instructions for Running a Local Instance of the API Server

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v14+ recommended)
- **MySQL** (Ensure the MySQL server is running)
- **npm** (Comes with Node.js)

## 1. Clone the Repository
```sh
git clone <your-repository-url>
cd <your-repository-folder>
```

## 2. Install Dependencies
```sh
npm install
```

## 3. Setup Environment Variables
Create a `.env` file in the root directory and configure the database credentials:
```env
DB_USER=root
DB_PASS=<yourpassword>
DB_NAME=<yourdatabase>
DB_HOST=localhost
DB_DIALECT=mysql
SERVER_PORT=3000
```

## 4. Run Database Migrations
```sh
npx sequelize-cli db:migrate
```

## 5. Seed the Database
```sh
npx sequelize-cli db:seed:all
```

## 6. Start the Server
```sh
npm start
```
By default, the server will run on `http://localhost:3000`.

## 7. API Endpoints
Here are the available API endpoints:

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/register` | Register students to a teacher |
| GET    | `/api/commonstudents?teacher=email1&teacher=email2` | Get common students under multiple teachers |
| POST   | `/api/suspend` | Suspend a student |
| POST   | `/api/retrievefornotifications` | Retrieve students eligible for notifications |

## 8. Running Tests
```sh
npm test
```

