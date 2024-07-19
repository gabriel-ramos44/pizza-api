import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';
import swaggerSpec from './swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors());

app.use('/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;