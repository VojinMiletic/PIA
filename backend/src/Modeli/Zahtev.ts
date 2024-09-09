import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Zahtev = new Schema({
    idZ:{type: Number},

    datum_pocetak:{type: String},

    ukupno_kvadrata:{type: Number},

    tip:{type: String},

    bazen:{type: Number},

    zelenilo:{type: Number},

    lezaljke_stolovi:{type: Number},

    fontana:{type: Number},

    stolovi_stolice:{type: Number},

    opis:{type: String},

    usluge: {type: Array},

    firma:{type: String},

    vlasnik:{type: String},

    ocena:{type: Number},

    komentar:{type: String},

    dekorater:{type: String},

    status:{type: String},

    datum_kraj:{type: String},

    slika:{type: String},

    odbijnica:{type: String},

    raspored:{type: Array},

    datum_zakazivanja: {type: String}

});

export default mongoose.model('Zahtev', Zahtev, 'zahtevi');