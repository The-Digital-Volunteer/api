import 'dotenv/config';
import app from './app';

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});

export default server;
