import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from './Modeli/Korisnik';
import { Firma } from './Modeli/Firma';
import { Usluga } from './Modeli/Usluga';
import { Zahtev } from './Modeli/Zahtev';
import { Odrzavanje } from './Modeli/Odrzavanje';

@Injectable({
  providedIn: 'root'
})
export class PrijavaService {

  constructor(private client: HttpClient) { }

  prijava(k: Korisnik){
    return this.client.post<Korisnik>("http://localhost:4000/korisnik/prijava", k);
  }

  registracija(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/registracija", k);
  }

  dohvatiKorisnike(){
    return this.client.get<Korisnik[]>("http://localhost:4000/korisnik/dohvatiKorisnike");
  }

  odobriRegistraciju(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/odobriRegistraciju", k);
  }

  odbijRegistraciju(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/odbijRegistraciju", k);
  }

  dodajFirmu(f: Firma){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajFirmu", f);
  }

  dohvatiFirme(){
    return this.client.get<Firma[]>("http://localhost:4000/korisnik/dohvatiFirme");
  }

  dodajUslugu(f: Firma, u: Usluga){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajUslugu", {f:f, u:u.usluga, c:u.cena});
  }

  izmeniKorisnika(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/izmeniKorisnika", k);
  }

  blokirajKorisnika(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/blokirajKorisnika", k);
  }

  odblokirajKorisnika(k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/odblokirajKorisnika", k);
  }

  promenaLozinke(k: Korisnik, nova: string, stara: string){
    return this.client.post<string>("http://localhost:4000/korisnik/promeniLozinku", {k:k, nova:nova, stara:stara})
  }

  dohvatiZahteve(){
    return this.client.get<Zahtev[]>("http://localhost:4000/korisnik/dohvatiZahteve");
  }

  dodajZahtev(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajZahtev", z);
  }

  prihvatiZahtev(z: Zahtev, k: Korisnik){
    return this.client.post<string>("http://localhost:4000/korisnik/prihvatiZahtev", {z: z, k: k});
  }

  odbijZahtev(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/odbijZahtev", z);
  }

  zavrsiZahtev(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/zavrsiZahtev", z);
  }

  dodajSliku(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajSliku", z);
  }

  oceni(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/oceni", z);
  }

  otkazi(z: Zahtev){
    return this.client.post<string>("http://localhost:4000/korisnik/otkazi", z);
  }

  // Odrzavanja

  dohvatiOdrzavanja(){
    return this.client.get<Odrzavanje[]>("http://localhost:4000/korisnik/dohvatiOdrzavanja");
  }

  dodajOdrzavanje(o: Odrzavanje){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajOdrzavanje", o);
  }

  prihvatiOdrzavanje(o: Odrzavanje){
    return this.client.post<string>("http://localhost:4000/korisnik/prihvatiOdrzavanje", o);
  }

  odbijOdrzavanje(o: Odrzavanje){
    return this.client.post<string>("http://localhost:4000/korisnik/odbijOdrzavanje", o);
  }

  dodajDekorateraUFirmu(f: Firma){
    return this.client.post<string>("http://localhost:4000/korisnik/dodajDekorateraUFirmu", f);
  }
  
}
