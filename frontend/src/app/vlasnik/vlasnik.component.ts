import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../Modeli/Korisnik';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router) {}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.k = JSON.parse(x);
      }
  }

  k: Korisnik = new Korisnik();

  dohvatiSliku(k: Korisnik){
    if(k.slika != ""){
      return k.slika;
    }
    if(k.pol == 'M'){
      return "./assets/muskiAvatar.png";
    }
    return "./assets/zenskiAvatar.png"
  }

  izmeniPodatkeKorisnika(k:Korisnik){
    localStorage.setItem("korisnikZaIzmenu", JSON.stringify(k));
    localStorage.setItem("putanjaNazad", "./vlasnik/pocetna");

    this.ruter.navigate(['izmena']);
  }

  promenaLozinke(k:Korisnik){
    localStorage.setItem("korisnikPromenaLozinke", JSON.stringify(k));
    this.ruter.navigate(['promenaLozinke']);
  }

  idiNaFirme(){
    localStorage.setItem("korisnik", JSON.stringify(this.k));
    this.ruter.navigate(['vlasnik/firme']);
  }

  idiNaZakazivanja(){
    localStorage.setItem("korisnik", JSON.stringify(this.k));
    this.ruter.navigate(['vlasnik/zakazivanja']);
  }

  idiNaOdrzavanje(){
    localStorage.setItem("korisnik", JSON.stringify(this.k));
    this.ruter.navigate(['vlasnik/odrzavanje']);
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }

}
