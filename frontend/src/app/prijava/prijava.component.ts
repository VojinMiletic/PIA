import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrijavaService } from '../prijava.service';
import { Korisnik } from '../Modeli/Korisnik';
import { Firma } from '../Modeli/Firma';
import { Zahtev } from '../Modeli/Zahtev';
import md5 from 'md5';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {

  constructor(private ruter: Router, private servis: PrijavaService) {}

  ngOnInit(): void {
      this.dohvatiKorisnikeIFirme();
  }

  k: Korisnik = new Korisnik();
  lozinka: string = "";
  poruka: string = "";

  korisnici: Korisnik[] = [];
  firme: Firma[] = [];
  zahtevi: Zahtev[] = [];
  
  filtriraneFirme: Firma[] = [];
  kriterijum: string = "";
  poredak: string = "";

  prijava(){
    this.k.lozinka = md5(this.lozinka);
    this.servis.prijava(this.k).subscribe(data=>{
      if(data){
        this.poruka = "";
        if(data.tip == "vlasnik"){
          if(data.status == "neodobren"){
            this.poruka = "Vaš zahtev za registraciju je u procesu obrade.";
            return;
          }
          if(data.status == "blokiran"){
            this.poruka = "Vaš nalog je blokiran.";
            return;
          }
          localStorage.setItem("korisnik", JSON.stringify(data));
          this.ruter.navigate(['vlasnik/pocetna']);
        }
        else if(data.tip == "dekorater"){
          if(data.status == "blokiran"){
            this.poruka = "Vaš nalog je blokiran.";
            return;
          }
          localStorage.setItem("korisnik", JSON.stringify(data));
          this.ruter.navigate(['dekorater/pocetna']);
        }
        else{
          this.poruka = "Greska:: Za prijavu administratora se koristi posebna putanja!"
        }
      }
      else{
        this.poruka = "Greska:: Pogresno korisnicko ime i/ili lozinka!"
      }
    })
  }

  registracija(){
    this.ruter.navigate(['registracija']);
  }

  dohvatiKorisnikeIFirme(){
    this.servis.dohvatiKorisnike().subscribe(data=>{
      this.korisnici = data;
      // Ovde mogu da dohvatim firme jer znam da su korisnici dohvaceni
      this.servis.dohvatiFirme().subscribe(data=>{
        this.firme = data;
        this.filtriraneFirme = this.firme;
        
        this.servis.dohvatiZahteve().subscribe(data=>{
          this.zahtevi = data;
        })
      })
    })
  }

  brojVlasnika(){
    return this.korisnici.filter(elem=> elem.tip == "vlasnik").length;
  }

  brojDekoratera(){
    return this.korisnici.filter(elem=> elem.tip == "dekorater").length;
  }

  brojZahteva(brojDana: number){
    return this.zahtevi.filter(zaht => new Date().getTime() - new Date(zaht.datum_zakazivanja).getTime()
    <= brojDana * 24 * 60 * 60 * 1000).length;
  }

  brojZavrsenihBasta(){
    return this.zahtevi.filter(elem=>elem.status == "zavrsen").length;
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

  zahteviSaSlikom(): Zahtev[]{
    return this.zahtevi.filter(elem => elem.status == "zavrsen" && elem.slika != '' && elem.slika != "./assets/adminSlika.png").
    sort((a,b)=> new Date(b.datum_kraj).valueOf() - new Date(a.datum_kraj).valueOf());
  }

  
}
