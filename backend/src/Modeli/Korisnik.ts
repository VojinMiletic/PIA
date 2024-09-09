import mongoose from "mongoose";

const Schema = mongoose.Schema

let Korisnik = new Schema({
    adresa: {type: String},

    broj_kartice: {type: String},

    ime: {type: String},

    kor_ime: {type: String},

    lozinka: {type: String},

    mejl: {type: String},

    pol: {type: String},

    prezime: {type: String},

    slika: {type: String},

    status: {type: String},

    telefon: {type: String},

    tip: {type: String},

    zahtevi: {type: String}

});

export default mongoose.model('Korisnik', Korisnik, 'korisnici');