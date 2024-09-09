import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../Modeli/Korisnik';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Firma } from '../Modeli/Firma';

@Component({
  selector: 'app-vlasnik-firme',
  templateUrl: './vlasnik-firme.component.html',
  styleUrls: ['./vlasnik-firme.component.css']
})
export class VlasnikFirmeComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router) {}

  ngOnInit(): void {
    let x = localStorage.getItem("korisnik");
    if(x){
      this.k = JSON.parse(x);
    }
    this.dohvatiKorisnikeIFirme();
  }



  k: Korisnik = new Korisnik();
  poruka: string = "";

  kriterijum: string = "";
  poredak: string = "";

  korisnici: Korisnik[] = [];
  firme: Firma[] = [];
  
  filtriraneFirme: Firma[] = [];

  zvezde: number[] = [1, 2, 3, 4, 5];
  
  nazad(){
    this.ruter.navigate(['vlasnik/pocetna']);
  }

  dohvatiKorisnikeIFirme(){
    this.servis.dohvatiKorisnike().subscribe(data=>{
      this.korisnici = data;
      // Ovde mogu da dohvatim firme jer znam da su korisnici dohvaceni
      this.servis.dohvatiFirme().subscribe(data=>{
        this.firme = data;
        this.filtriraneFirme = this.firme;
      })
    })
  }

  dohvatiDekoratere(f: Firma) : Korisnik[]{
    let korImena = f.dekoratori.split(',');
    return <Korisnik[]>korImena.map(elem=> this.korisnici.find(kor=> kor.kor_ime == elem)).filter(kor=>kor !== undefined);
  }

  odabraneFirme(naziv: string, adresa: string){
    
    this.filtriraneFirme = this.firme;
    if(naziv != ""){
      this.filtriraneFirme = this.filtriraneFirme.filter(elem => elem.naziv.trim().toLowerCase().includes(naziv.toLowerCase()));
    }
    if(adresa != ""){
      this.filtriraneFirme = this.filtriraneFirme.filter(elem => elem.adresa.trim().toLowerCase().includes(adresa.toLowerCase()));
    }
    
  }

  prosecnaOcena(f: Firma){
    let ocene = f.ocene.split(',');
    return ocene.reduce((acc, curr)=> acc + +curr, 0) / ocene.length;
  }

  detaljiFirme(f: Firma){
    localStorage.setItem("firma", JSON.stringify(f));
    this.ruter.navigate(['vlasnik/firme/detalji']);
  }

  sortiraj(){
    if(this.kriterijum == "naziv"){
      if(this.poredak == "opadajuce"){
        this.filtriraneFirme.sort((a,b) => b.naziv.localeCompare(a.naziv));
      }
      else if(this.poredak == "rastuce"){
        this.filtriraneFirme.sort((a,b) => a.naziv.localeCompare(b.naziv));
      }
    }
    else if(this.kriterijum == "adresa"){
      if(this.poredak == "opadajuce"){
        this.filtriraneFirme.sort((a,b) => b.adresa.localeCompare(a.adresa));
      }
      else if(this.poredak == "rastuce"){
        this.filtriraneFirme.sort((a,b) => a.adresa.localeCompare(b.adresa));
      }
    }
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }


}
