import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Odrzavanje = new Schema({
    idO: {type: Number},
  
    idZ: {type: Number},
   
    vlasnik: {type: String},

    firma: {type: String},

    dekorater: {type: String},

    datum_pocetak: {type: String},

    datum_kraj: {type: String},

    status: {type: String}

});

export default mongoose.model('Odrzavanje', Odrzavanje, 'odrzavanja');