import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import { LocalizedString } from '@angular/compiler';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router) {}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.k = JSON.parse(x);
      }
      this.proveriDaLiGaTrebaBlokiratiZbogSlike();
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
    localStorage.setItem("putanjaNazad", "./dekorater/pocetna");

    this.ruter.navigate(['izmena']);
  }

  promenaLozinke(k:Korisnik){
    localStorage.setItem("korisnikPromenaLozinke", JSON.stringify(k));
    this.ruter.navigate(['promenaLozinke']);
  }

  idiNaZakazivanja(){
    localStorage.setItem("dekorater", JSON.stringify(this.k));
    this.ruter.navigate(['dekorater/zakazivanja']);
  }

  idiNaOdrzavanje(){
    localStorage.setItem("dekorater", JSON.stringify(this.k));
    this.ruter.navigate(['dekorater/odrzavanje']);
  }

  idiNaStatistiku(){
    localStorage.setItem("dekorater", JSON.stringify(this.k));
    this.ruter.navigate(['dekorater/statistika']);
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }

  proveriDaLiGaTrebaBlokiratiZbogSlike(){
    this.servis.dohvatiZahteve().subscribe(zahtevi =>{
      let mojiZavrseni = zahtevi.filter(elem => elem.dekorater == this.k.kor_ime && elem.status == "zavrsen");
      let bezSlika = mojiZavrseni.filter(elem => elem.slika == "" && 
        new Date().valueOf() - new Date(elem.datum_kraj).valueOf() >= 24*60*60*1000);
      if(bezSlika.length > 0){
        // Treba blokirati korisnika a jednoj od slika dodeliti predefinisanu sliku
        let z = bezSlika[0];
        z.slika = "./assets/adminSlika.png";
        // Ovde cemo sad ažurirati sliku i blokirati korisnika
        this.servis.dodajSliku(z).subscribe(data=>{
          this.servis.blokirajKorisnika(this.k).subscribe(data=>{
            alert("Blokirani ste jer niste na vreme dodali sliku za završen posao.");
            localStorage.removeItem("korisnik");
            this.ruter.navigate(['']);
          })
        })
      }
      else{

      }
    })
  }

}
