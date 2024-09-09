import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import { Odrzavanje } from '../Modeli/Odrzavanje';

@Component({
  selector: 'app-dekorater-odrzavanje',
  templateUrl: './dekorater-odrzavanje.component.html',
  styleUrls: ['./dekorater-odrzavanje.component.css']
})
export class DekoraterOdrzavanjeComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.k = JSON.parse(x);
      }
      this.dohvatiOdrzavanja();
  }

  k: Korisnik = new Korisnik();
  prikaz: number = -1;
  neobradjenaOdrzavanja: Odrzavanje[] = [];
  porukaGreska: string = "";

  dohvatiOdrzavanja(){
    this.servis.dohvatiOdrzavanja().subscribe(data=>{
      this.neobradjenaOdrzavanja = data.filter(elem=> elem.status == "neobradjen");
    })
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

  prihvati(o: Odrzavanje){
    if(o.datum_kraj == ""){
      this.porukaGreska = "Niste uneli datum kraja."
      return;
    }
    if(new Date(o.datum_kraj).valueOf() <= new Date(o.datum_pocetak).valueOf()){
      this.porukaGreska = "Datum kraja mora biti posle datuma početka."
      return;
    }
    this.porukaGreska = "";
    o.dekorater = this.k.kor_ime;
    o.status = "prihvacen";
    this.servis.prihvatiOdrzavanje(o).subscribe(data=>{
      alert(data);
      this.prikaz = -1;
      this.ngOnInit();
    })
  }

  odbij(o: Odrzavanje){
    this.servis.odbijOdrzavanje(o).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  nazad(){
    this.ruter.navigate(['dekorater/pocetna'])
  }

  odjava(){
    localStorage.removeItem("dekorater");
    this.ruter.navigate(['']);
  }

}
