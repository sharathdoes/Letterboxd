import express from 'express';
const app=express();
const port=3000;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import {addMovie} from './api/movies.js';
import {register,mylogs, login} from './api/user.js'
import {addLog,deletelog} from './api/logs.js'
import {searchMovie,searchMovieByKey,stats} from './api/movies.js'
import {auth_middleware} from './middlewares/auth_middleware.js'
import { addSeries } from './api/series.js';

app.use(express.json());

app.post('/addMovie',addMovie);
app.post('/addSeries',addSeries);
app.post('/deletelog',deletelog);
app.post('/searchMovie',searchMovie);
app.get('/stats',stats);
app.post('/searchMovieByKey',searchMovieByKey);
app.get('/mylogs',auth_middleware, mylogs);
app.post('/register',register);
app.post('/login',login);
app.post('/addLog',addLog);


mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
