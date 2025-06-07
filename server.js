import express from 'express';
const app=express();
const port=3000;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import {addMovie} from './api/movies.js';
import {register,mylogs, login} from './api/user.js'
import {addLog} from './api/logs.js'

app.use(express.json());

// app.get('/getallmovies',getMovies);
app.post('/addMovie',addMovie);
app.get('/mylogs',mylogs);
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
