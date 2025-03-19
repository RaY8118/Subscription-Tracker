import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjectMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
const app = express()

const swaggerDocument = YAML.load('./swagger.yaml');
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

swaggerDocument.servers = [
  {
    url: process.env.BASE_URL || "http://localhost:5500",
  },
];
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(arcjectMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter)
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send(`
    <h1>📊 Welcome to the Subscription Tracker API!</h1>
    <p>This API allows you to manage and track subscriptions with ease.</p>
    <p>👉 <a href="/docs">Click here to view and try the API documentation</a></p>
    <hr />
    <p>Built with ❤️ using Node.js and Express.js</p>
  `);
});
app.listen(PORT, async () => {
  console.log(`Subscription Tracker API is running on https://localhost:${PORT}`)
  await connectToDatabase()
})

export default app
