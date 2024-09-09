import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import RuterKorisnik from './ruteri/korisnik.ruter';


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/dekor2024");
const connection = mongoose.connection;
connection.once("open", ()=>{console.log("DB oppened!\n")});

const ruter = express.Router();

app.use('/', ruter);
ruter.use('/korisnik', RuterKorisnik);


app.listen(4000, () => console.log(`Express server running on port 4000`));