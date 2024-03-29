import express from 'express';
import productsRouter from './routes/products.router.js';
import connect from './schemas/index.js';

const app = express();
const PORT = 3000;

connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', productsRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});