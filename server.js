import express from 'express';
const app=express();
const port=3000;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import {getMovies,addMovie} from './api/movies.js';


app.use(express.json());

app.get('/getallmovies',getMovies);
app.post('/addMovie',addMovie);


mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
