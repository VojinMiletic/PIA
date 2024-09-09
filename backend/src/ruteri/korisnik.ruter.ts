import express from 'express'
import { KontrolerKorisnik } from '../Kontroleri/korisnik.kontroler';

const RuterKorisnik = express.Router();

RuterKorisnik.route('/prijava').post(
    (req, res) => new KontrolerKorisnik().prijava(req, res)
);

RuterKorisnik.route('/registracija').post(
    (req, res) => new KontrolerKorisnik().registracija(req, res)
);

RuterKorisnik.route('/dohvatiKorisnike').get(
    (req, res) => new KontrolerKorisnik().dohvatiKorisnike(req, res)
);

RuterKorisnik.route('/odobriRegistraciju').post(
    (req, res) => new KontrolerKorisnik().odobriRegistraciju(req, res)
);

RuterKorisnik.route('/odbijRegistraciju').post(
    (req, res) => new KontrolerKorisnik().odbijRegistraciju(req, res)
);

RuterKorisnik.route('/dodajFirmu').post(
    (req, res) => new KontrolerKorisnik().dodajFirmu(req, res)
);

RuterKorisnik.route('/dohvatiFirme').get(
    (req, res) => new KontrolerKorisnik().dohvatiFirme(req, res)
);

RuterKorisnik.route('/dodajUslugu').post(
    (req, res) => new KontrolerKorisnik().dodajUslugu(req, res)
);


RuterKorisnik.route('/izmeniKorisnika').post(
    (req, res) => new KontrolerKorisnik().izmenaKorisnika(req, res)
);

RuterKorisnik.route('/blokirajKorisnika').post(
    (req, res) => new KontrolerKorisnik().blokirajKorisnika(req, res)
);

RuterKorisnik.route('/odblokirajKorisnika').post(
    (req, res) => new KontrolerKorisnik().odblokirajKorisnika(req, res)
);

RuterKorisnik.route('/promeniLozinku').post(
    (req, res) => new KontrolerKorisnik().promeniLozinku(req, res)
);

RuterKorisnik.route('/dohvatiZahteve').get(
    (req, res) => new KontrolerKorisnik().dohvatiZahteve(req, res)
);

RuterKorisnik.route('/dodajZahtev').post(
    (req, res) => new KontrolerKorisnik().dodajZahtev(req, res)
);

RuterKorisnik.route('/prihvatiZahtev').post(
    (req, res) => new KontrolerKorisnik().prihvatiZahtev(req, res)
);

RuterKorisnik.route('/odbijZahtev').post(
    (req, res) => new KontrolerKorisnik().odbijZahtev(req, res)
);

RuterKorisnik.route('/zavrsiZahtev').post(
    (req, res) => new KontrolerKorisnik().zavrsiZahtev(req, res)
);

RuterKorisnik.route('/dodajSliku').post(
    (req, res) => new KontrolerKorisnik().dodajSliku(req, res)
);

RuterKorisnik.route('/oceni').post(
    (req, res) => new KontrolerKorisnik().oceni(req, res)
);

RuterKorisnik.route('/otkazi').post(
    (req, res) => new KontrolerKorisnik().otkazi(req, res)
);

// Odrzavanja

RuterKorisnik.route('/dohvatiOdrzavanja').get(
    (req, res) => new KontrolerKorisnik().dohvatiOdrzavanja(req, res)
);

RuterKorisnik.route('/dodajOdrzavanje').post(
    (req, res) => new KontrolerKorisnik().dodajOdrzavanje(req, res)
);

RuterKorisnik.route('/prihvatiOdrzavanje').post(
    (req, res) => new KontrolerKorisnik().prihvatiOdrzavanje(req, res)
);

RuterKorisnik.route('/odbijOdrzavanje').post(
    (req, res) => new KontrolerKorisnik().odbijOdrzavanje(req, res)
);

RuterKorisnik.route('/dodajDekorateraUFirmu').post(
    (req, res) => new KontrolerKorisnik().dodajDekorateraUFirmu(req, res)
);

export default RuterKorisnik;