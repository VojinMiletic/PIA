import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Firma = new Schema({
    adresa: {type: String},
  
    naziv: {type: String},
    
    kontakt_osoba: {type: String},
    
    ocene: {type: String},

    usluge: {type: Array},

    dekoratori: {type: String},

    godisnji_odmor: {type: String},

    komentari: {type: Array},

    lokacija: {type: String}
 
});

export default mongoose.model('Firma', Firma, 'firme');