import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, PORT, URL_MONGO } from './constants';
import EnterpriseRouter from './routes/EnterpriseRouter';
const app = express();

app.use(function (req: Request, res: Response, next: NextFunction) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		credentials: true,
		origin: CLIENT_URL,
	})
);

app.use('/api', EnterpriseRouter);

mongoose
	.connect(URL_MONGO)
	.then(() => console.log('MongoDB connected'))
	.catch(console.log);

app.listen(PORT, () => console.log('Server is running on PORT=' + PORT));
