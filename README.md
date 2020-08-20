
This project was made using [Next.js](https://nextjs.org/) with a [React](https://reactjs.org/) frontend and a [TypeScript](https://www.typescriptlang.org/) backend, as well as [MongoDB](https://www.mongodb.com/).



## Getting Started

First, make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed (or use a cloud service such as [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

After cloning the repository, create a file named `.env.local` in the repository's root directory, with the content:
```
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/content-database?retryWrites=true&w=majority
```
replacing the connection URI with your own.

Then, install dependencies and run the application with:
```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
You should see an empty table with the text "No videos found." (since the database is currently empty)

To populate the database with random data for testing, run:
```bash
node scripts/populate-database.js
```

To start the application in production, run:
```bash
npm run build
npm start
```

For development, `pages/index.js` is the starting point for the frontend, and `pages/api` containes all the API endpoints, see the [design doc](DESIGN.md) for more info.