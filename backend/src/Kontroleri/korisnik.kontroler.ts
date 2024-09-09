import express from 'express'
import Korisnik from '../Modeli/Korisnik'
import Firma from '../Modeli/Firma';
import Zahtev from '../Modeli/Zahtev';
import { ConnectionClosedEvent } from 'mongodb';
import Odrzavanje from '../Modeli/Odrzavanje';



export class KontrolerKorisnik{

    

    prijava = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);



        Korisnik.findOne({'kor_ime': k.kor_ime, 'lozinka': k.lozinka}).then(data=>{
            res.json(data);
        }).catch(err=>{console.log(err)})
    }

    registracija = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);
        
        Korisnik.findOne({'kor_ime': k.kor_ime}).then(data=>{
            if(data){
                res.json("GRESKA: Korisnicko ime vec postoji!");
                return;
            }
            else{
                Korisnik.findOne({'mejl': k.mejl}).then(data=>{
                    if(data){
                        res.json("GRESKA: Uneti mejl vec postoji!");
                        return;
                    }
                    else{

                        k.save().then(data=>{
                            res.json("Ok");
                        }).catch(err=>console.log(err))
                    }
                }).catch(err=>console.log(err))
            }
        }).catch(err=>console.log(err))

    } 

    izmenaKorisnika = (req: express.Request, res: express.Response) =>{
        let k = new Korisnik(req.body);

        Korisnik.deleteOne({'kor_ime': k.kor_ime}).then(data=>{
            this.registracija(req, res);
        }).catch(err=>console.log(err))
    }

    dohvatiKorisnike = (req: express.Request, res: express.Response) => {

        Korisnik.find({}).then(data=>{
            res.json(data);
        }).catch(err=>console.log(err));
    }

    odobriRegistraciju = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);

        Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'status': "odobren"}}).then(data=>{
            res.json("Uspesno ste odobrili korisnika " + k.kor_ime);
        }).catch(err=>console.log(err))
    }

    odbijRegistraciju = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);

        Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'status': "blokiran"}}).then(data=>{
            res.json("Uspesno ste blokirali korisnika " + k.kor_ime);
        }).catch(err=>console.log(err))
    }

    dodajFirmu = (req: express.Request, res: express.Response) => {

        let f = new Firma(req.body);

        f.save().then(data=>{
            res.json("Uspesno ste dodali firmu: " + f.naziv);
        }).catch(err => console.log(err));
    }

    dohvatiFirme = (req: express.Request, res: express.Response) => {

        Firma.find({}).then(data=>{
            res.json(data);
        }).catch(err => console.log(err));
    }

    dodajUslugu = (req: express.Request, res: express.Response) => {

        let f = new Firma(req.body.f);
        let u = req.body.u;
        let c = req.body.c;

        const usl = {
            usluga: u,
            cena: c
        }

        Firma.updateOne({'naziv': f.naziv}, {$push: {'usluge': usl}}).then(data=>{
            res.json("Uspesno dodata usluga!");
        }).catch(err=>console.log(err));
    }

    blokirajKorisnika = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);

        Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'status': 'blokiran'}}).then(data=>{
            res.json("Uspesno ste blokirali korisnika " + k.kor_ime);
        }).catch(err=>console.log(err))
    }

    odblokirajKorisnika = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body);

        Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'status': 'odobren'}}).then(data=>{
            res.json("Uspesno ste odobrili korisnika " + k.kor_ime);
        }).catch(err=>console.log(err))
    }

    promeniLozinku = (req: express.Request, res: express.Response) => {
        let k = new Korisnik(req.body.k);
        let novaLozinka = req.body.nova;
        let staraLozinka = req.body.stara;

        Korisnik.findOne({'kor_ime': k.kor_ime}).then(kor=>{
            if(kor){
                if(kor.lozinka != staraLozinka){
                    res.json("Pogrešna stara lozinka!");
                }
                else{
                    Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'lozinka': novaLozinka}}).then(data=>{
                        res.json("Ok");
                    }).catch(err=>console.log(err));
                }
            }
            else{
                res.json("Nepredvidjena greska.");
            }
        }).catch(err=>console.log(err));

    }

    dohvatiZahteve = (req: express.Request, res: express.Response) =>{
        Zahtev.find({}).then(data=>{
            res.json(data);
        }).catch(err => console.log(err));
    } 

    dodajZahtev = (req: express.Request, res: express.Response) => {
        let z = new Zahtev(req.body);

        Zahtev.find({}).then(zahtevi =>{
            let maxId = Math.max(...zahtevi.map((zaht : any) => zaht.idZ));
            z.idZ = maxId + 1;
            z.save().then(data=>{
                res.json("Uspešno ste dodali zahtev sa identifikatorom " + z.idZ);
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }

    prihvatiZahtev = (req: express.Request, res: express.Response) =>{

        let z = new Zahtev(req.body.z);
        let k = new Korisnik(req.body.k);

        Zahtev.updateOne({'idZ': z.idZ}, {$set:{'status': 'prihvacen', 'datum_kraj': z.datum_kraj, 'dekorater': z.dekorater}}).then(data=>{
           Korisnik.updateOne({'kor_ime': k.kor_ime}, {$set: {'zahtevi': k.zahtevi}}).then(data=>{
                res.json("Uspešno ste prihvatili zahtev broj " + z.idZ);
           }).catch(err=>console.log(err))

        }).catch(err=>console.log(err));
    }

    odbijZahtev = (req: express.Request, res: express.Response) =>{

        let z = new Zahtev(req.body);

        Zahtev.updateOne({'idZ': z.idZ}, {$set:{'status': 'odbijen'}}).then(data=>{
            res.json("Uspešno ste odbili zahtev broj " + z.idZ);
        }).catch(err=>console.log(err));
    }

    zavrsiZahtev = (req: express.Request, res: express.Response) =>{

        let z = new Zahtev(req.body);

        Zahtev.updateOne({'idZ': z.idZ}, {$set:{'status': 'zavrsen', 'datum_kraj': z.datum_kraj}}).then(data=>{
            res.json("Završen zahtev sa brojem " + z.idZ);
        }).catch(err=>console.log(err));
    }

    dodajSliku = (req: express.Request, res: express.Response) =>{

        let z = new Zahtev(req.body);

        Zahtev.updateOne({'idZ': z.idZ}, {$set:{'slika': z.slika}}).then(data=>{
            res.json("Uspešno ste dodali sliku za zahtev sa brojem " + z.idZ);
        }).catch(err=>console.log(err));
    }

    oceni = (req: express.Request, res: express.Response) =>{
        let z = new Zahtev(req.body);

        Zahtev.updateOne({'idZ': z.idZ}, {$set:{'komentar': z.komentar, 'ocena': z.ocena}}).then(data=>{
           // Ovde sad valja dati ocenu i komentar firmi koja je radila posao
           Firma.findOne({'naziv': z.firma}).then(fir=>{
            if(fir){
                let ocene = fir.ocene;
                if(ocene == ""){
                    ocene += "" + z.ocena;
                }
                else{
                    ocene += "," + z.ocena;
                }

                Firma.updateOne({'naziv': z.firma}, {$set: {'ocene': ocene}, $push:{'komentari': z.komentar}}).then(data=>{
                    res.json("Uspešno ste ostavili ocenu i komentar")
                   }).catch(err=>console.log(err));
            }
           }).catch(err=>console.log(err));
           
        }).catch(err=>console.log(err));
    }

    otkazi = (req: express.Request, res: express.Response) => {
        
        let z = new Zahtev(req.body);
        Zahtev.updateOne({'idZ': z.idZ}, {$set: {'status': "otkazan"}}).then(data=>{
            res.json("Uspešno ste otkazali zahtev broj " + z.idZ);
        }).catch(err=>console.log(err))
    }


    // Odrzavanja

    dohvatiOdrzavanja = (req: express.Request, res: express.Response) =>{
        Odrzavanje.find({}).then(data=>{
            res.json(data);
        }).catch(err => console.log(err));
    } 

    dodajOdrzavanje = (req: express.Request, res: express.Response) => {
        let o = new Odrzavanje(req.body);

        Odrzavanje.find({}).then(odrzavanja =>{
            let maxId = Math.max(...odrzavanja.map((odr : any) => odr.idO));
            o.idO = maxId + 1;
            o.save().then(data=>{
                res.json("Uspešno ste dodali odrzavanje sa identifikatorom " + o.idO);
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }

    prihvatiOdrzavanje = (req: express.Request, res: express.Response) =>{

        let o = new Odrzavanje(req.body);

        Odrzavanje.updateOne({'idO': o.idO}, {$set:{'status': 'prihvacen', 'datum_kraj': o.datum_kraj, 'dekorater': o.dekorater}}).then(data=>{
           
            res.json("Uspešno ste prihvatili odrzavanje broj " + o.idO);
        
        }).catch(err=>console.log(err));
    }

    odbijOdrzavanje = (req: express.Request, res: express.Response) =>{

        let o = new Odrzavanje(req.body);

        Odrzavanje.updateOne({'idO': o.idO}, {$set:{'status': 'odbijen'}}).then(data=>{
            res.json("Uspešno ste odbili odrzavanje broj " + o.idO);
        }).catch(err=>console.log(err));
    }


    dodajDekorateraUFirmu = (req: express.Request, res: express.Response) =>{

        let f = new Firma(req.body);

        Firma.updateOne({'naziv': f.naziv}, {$set: {'dekoratori': f.dekoratori}}).then(data=>{
            res.json("Uspešno ste dodali dekoratera firmi " + f.naziv);
        }).catch(err=>console.log(err))
    } 



}