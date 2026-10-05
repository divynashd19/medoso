// Runs the Express backend as a Netlify Function. netlify.toml rewrites
// /api/* to this function, so the frontend and API share one origin.
const serverless = require('serverless-http');
const { app } = require('../../backend/server');
const connectDB = require('../../backend/db');

let connection;

const expressHandler = serverless(app, {
  request: (req) => {
    // Depending on how the function is invoked the path may arrive as
    // /.netlify/functions/api/...; Express routes are mounted under /api.
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '/api');
  },
});

exports.handler = async (event, context) => {
  // Reuse the MongoDB connection across warm invocations.
  context.callbackWaitsForEmptyEventLoop = false;
  connection = connection || connectDB();
  await connection;
  return expressHandler(event, context);
};
