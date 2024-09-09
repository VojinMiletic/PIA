import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../Modeli/Korisnik';
import { Odrzavanje } from '../Modeli/Odrzavanje';
import { Zahtev } from '../Modeli/Zahtev';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik-odrzavanje',
  templateUrl: './vlasnik-odrzavanje.component.html',
  styleUrls: ['./vlasnik-odrzavanje.component.css']
})
export class VlasnikOdrzavanjeComponent implements OnInit {

  constructor(private servis:PrijavaService, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.k = JSON.parse(x);
      }
      this.dohvatiZahteve();
  }

  k: Korisnik = new Korisnik();
  odrzavanja: Odrzavanje[] = [];
  zahtevi: Zahtev[] = [];
  novoOdrzavanje: Odrzavanje = new Odrzavanje();
  prikaz: number = -1;
  porukaGreska: string = "";

  uProcesuOdrzavanja: Odrzavanje[] = [];

  dohvatiZahteve(){
    this.servis.dohvatiZahteve().subscribe(zaht=>{
      this.zahtevi = zaht.filter(elem => elem.vlasnik == this.k.kor_ime);
      // Dohvatim moja odrzavanja
      this.servis.dohvatiOdrzavanja().subscribe(odr=>{
        this.odrzavanja = odr.filter(elem => elem.vlasnik == this.k.kor_ime);

        this.uProcesuOdrzavanja = this.odrzavanja.filter(elem=> elem.status == "neobradjen" || 
          (elem.status == "prihvacen" && new Date(elem.datum_kraj).valueOf() > new Date().valueOf())
        )
      })
    })
  }

  zavrseniPoslovi() : Zahtev[]{
    return this.zahtevi.filter(elem => elem.status == "zavrsen");
  }

  brojBazena(z: Zahtev){
    return z.raspored.filter(elem=> elem.tip == "rectangle" && elem.a == 250).length;
  }

  brojFontana(z: Zahtev){
    return z.raspored.filter(elem=> elem.tip == "circle" && elem.r == 40).length;
  }

  dajDatum(d: string){
    if(d == ""){
      return "Nije još postavljen";
    }
    return d.split('T')[0] + " " + d.split('T')[1];
  }

  prikazi(i: number){
    if(this.prikaz == i){
      this.prikaz = -1;
    }
    else{
      this.prikaz = i;
    }
  }

  datumPoslednjegOdrzavanja(z: Zahtev){
    let tmp = this.odrzavanja.filter(elem=>elem.idZ == z.idZ && elem.datum_kraj != "").map(elem=> elem.datum_kraj);
    tmp.push(z.datum_kraj);
    let datum : Date = new Date( Math.max(...tmp.map(elem => new Date(elem).valueOf())) );
    return this.dajDatum(datum.toISOString()).split('.')[0];
  }

  daLiPrikazatiOdrzavanje(z: Zahtev){
    if(new Date().valueOf() - new Date(this.datumPoslednjegOdrzavanja(z)).valueOf() >= 6*30*24*60*60*1000 
        && this.brojBazena(z) + this.brojFontana(z) > 0
        && this.odrzavanja.filter(elem=> elem.idZ == z.idZ && elem.status != "odbijen" && elem.datum_kraj == "").length == 0
      )
    {
      return true;  
    }
    return false;
  }

  dodajOdrzavanje(z: Zahtev){
    if(this.novoOdrzavanje.datum_pocetak == ""){
      this.porukaGreska = "Niste uneli datum početka.";
      return;
    }
    if(new Date(this.novoOdrzavanje.datum_pocetak).valueOf() <= new Date().valueOf()){
      this.porukaGreska = "Datum početka mora biti u budućnosti.";
      return;
    }

    this.porukaGreska = "";

    this.novoOdrzavanje.firma = z.firma;
    this.novoOdrzavanje.idZ = z.idZ;
    this.novoOdrzavanje.vlasnik = this.k.kor_ime;
    this.novoOdrzavanje.status = "neobradjen";

    this.servis.dodajOdrzavanje(this.novoOdrzavanje).subscribe(data=>{
      alert(data);
      this.novoOdrzavanje = new Odrzavanje();
      this.prikaz = -1;
      this.ngOnInit();
    })
  }

  nazad(){
    this.ruter.navigate(['vlasnik/pocetna']);
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }
}
