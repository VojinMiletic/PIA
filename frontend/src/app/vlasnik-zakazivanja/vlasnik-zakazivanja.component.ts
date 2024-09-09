import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../Modeli/Korisnik';
import { Zahtev } from '../Modeli/Zahtev';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik-zakazivanja',
  templateUrl: './vlasnik-zakazivanja.component.html',
  styleUrls: ['./vlasnik-zakazivanja.component.css']
})
export class VlasnikZakazivanjaComponent implements OnInit {

  constructor(private servis:PrijavaService, private ruter: Router){}

  ngOnInit(): void {
    let x = localStorage.getItem("korisnik");
    if(x){
      this.k = JSON.parse(x);
    }
    this.dohvatiZahteve();
  }

  k: Korisnik = new Korisnik();
  zahtevi : Zahtev[] = [];

  prikaz: number = -1;
  komentar: string = "";
  ocena : number | null = null;

  dohvatiZahteve(){
    this.servis.dohvatiZahteve().subscribe(data=>{
      this.zahtevi = data.filter(elem => elem.vlasnik == this.k.kor_ime);
    })
  }

  aktivniZahtevi() : Zahtev[]{
    return this.zahtevi.filter(elem => elem.status == "neobradjen" || elem.status == "prihvacen");
  }

  stariZahtevi() : Zahtev[]{
    return this.zahtevi.filter(elem => elem.status == "zavrsen" || elem.status == "odbijen");
  }

  dajDatum(datum: string){
    return datum.split('T')[0] + " " + datum.split('T')[1].split('.')[0]
  }

  prikazi(i: number){
    if(this.prikaz == i){
      this.prikaz = -1;
    }
    else{
      this.prikaz = i;
    }
  }

  oceni(z: Zahtev){
    
    if(this.komentar == "" || this.ocena == null){
      alert("Niste uneli komentar ili ocenu.");
      return;
    }

    z.ocena = this.ocena;
    z.komentar = this.komentar;
    this.servis.oceni(z).subscribe(data=>{
      alert(data);
      this.prikaz = -1;
      this.komentar = "";
      this.ocena = null;
      this.ngOnInit();
    }) 
  }

  nazad(){
    this.ruter.navigate(['vlasnik/pocetna']);
  }

  otkazi(z: Zahtev){
    if(new Date(z.datum_pocetak).valueOf() - new Date().valueOf() < 24*60*60*1000){
      alert("Ne možete otkazati posao 24h pre njegovog početka.");
      return;
    }
    z.status = "otkazan";
    this.servis.otkazi(z).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }
}
