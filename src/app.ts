import express from 'express';
import cookiesParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookiesParser());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;