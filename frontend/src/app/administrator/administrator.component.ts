import { Component, OnInit, Sanitizer } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Korisnik } from '../Modeli/Korisnik';
import { Firma } from '../Modeli/Firma';
import { Usluga } from '../Modeli/Usluga';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import md5 from 'md5';


@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  constructor(private servis: PrijavaService, private sanitizer: DomSanitizer, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.ja = JSON.parse(x);
      }
      this.dohvatiKorisnike();
      
  }

  ja: Korisnik = new Korisnik();
  vlasnici: Korisnik[] = []; // Odobreni, neblokirani
  dekorateri: Korisnik[] = []; // Neblokirani
  
  blokirani: Korisnik[] = [];
  neodobreni: Korisnik[] = [];

  noviDekorater: Korisnik = new Korisnik();
  lozinka: string = "";
  porukaGreske: string = "";

  novaFirma: Firma = new Firma();
  novaUsluga: Usluga = new Usluga();
  odabraniDekorateri: Korisnik[] = [];
  datumOd: string = "";
  datumDo: string = "";
  porukaGreskeFirma: string = "";

  porukaLozinka: string = "";

  firme: Firma[] = [];


  dekoraterZaFirmu : string = "";

  prikaz : number = -1;

  otvoriDodajDekoratera(){
    if(this.prikaz == 1){
      this.prikaz = -1;
    }
    else{
      this.prikaz = 1;
    }
  }

  otvoriDodajFirmu(){
    if(this.prikaz == 2){
      this.prikaz = -1;
    }
    else{
      this.prikaz = 2;
    }
  }

  dohvatiKorisnike(){
    this.servis.dohvatiKorisnike().subscribe(data=>{
      this.vlasnici = data.filter(elem => elem.tip == "vlasnik" && elem.status == "odobren");
      this.dekorateri = data.filter(elem => elem.tip == "dekorater" && elem.status == "odobren");
      this.blokirani = data.filter(elem => elem.status == "blokiran");
      this.neodobreni = data.filter(elem => elem.status == "neodobren");

      this.dohvatiFirme(); // Ovde znam da sam dovukao sve korisnike
    })
  }

  odobriRegistraciju(k: Korisnik){
    this.servis.odobriRegistraciju(k).subscribe(data=>{
      alert(data);
      this.vlasnici.push(k);
      this.neodobreni.splice(this.neodobreni.indexOf(k), 1);
    })
  }

  odbijRegistraciju(k: Korisnik){
    this.servis.odbijRegistraciju(k).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  ubaciSliku(event: any){
    if(event.target.value){
      const fajl = <File>event.target.files[0];
      const dozvoljeniTipovi = ["image/png", "image/jpg", "image/jpeg"];
      if(fajl && dozvoljeniTipovi.includes(fajl.type)){
        const reader = new FileReader();
        reader.onload = () =>{
          const slika = new Image();
          slika.onload = () => {
            if(slika.width <= 300 && slika.height <= 300 && slika.width >= 100 && slika.height >= 100){
              this.noviDekorater.slika = reader.result as string;
              this.porukaGreske = "";
            }
            else{
              this.porukaGreske = "Slika nedozvoljenih dimenzija";
            }
          };
          slika.src = reader.result as string;
        }
        reader.readAsDataURL(fajl);
      }  
    }
  }

  dohvatiSliku(k: Korisnik){
    if(k.slika != ""){
      return k.slika;
    }
    if(k.pol == 'M'){
      return "./assets/muskiAvatar.png";
    }
    return "./assets/zenskiAvatar.png"
  }

  proveriLozinku(l: string){
    if(/^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[\W_]).{6,10}$/.test(l)){
      this.porukaLozinka = "Lozinka je ispravna";
      return true;
    }
    this.porukaLozinka = "Lozinka je neispravna";
    return false;
  }

  proveriKarticu(k: Korisnik){
    if(/^(300|301|302|303|36|38)/.test(k.broj_kartice) && k.broj_kartice.length == 15){
      return "./assets/dinaCard.png"
    }
    if(/^(51|52|53|54|55)/.test(k.broj_kartice) && k.broj_kartice.length == 16 ){
      return "./assets/masterCard.png"
    }
    if(/^(4539|4556|4916|4532|4929|4485|4716)/.test(k.broj_kartice) && k.broj_kartice.length == 16 ){
      return "./assets/visaCard.png"
    }
    return null;
  }

  proveriPodatke(k:Korisnik){
    if(k.adresa == "" || k.ime == "" || k.prezime == "" || k.kor_ime == "" || k.mejl == "" 
      || k.pol == "" || k.telefon == "" || this.proveriKarticu(k) == null || this.proveriLozinku(this.lozinka) == false
    )
    {
      return false;
    }
    return true;
  }

  dodajDekoratera(){

    if(this.proveriPodatke(this.noviDekorater) == false){
      this.porukaGreske = "GRESKA:: Niste uneli sve podake ili su neki neispravni";
      return;
    }

    this.noviDekorater.lozinka = md5(this.lozinka);
    this.noviDekorater.tip = "dekorater";
    this.noviDekorater.status = "odobren";

    this.servis.registracija(this.noviDekorater).subscribe(data=>{
      if(data == "Ok"){
        this.porukaGreske = "";
        alert("Uspešno ste dodali novog dekoratera!");
        this.dekorateri.push(JSON.parse(JSON.stringify(this.noviDekorater)));
        this.noviDekorater = new Korisnik();
      }
      else{
        this.porukaGreske = data;
      }
    })
  }

  odaberiDekoratera(d: Korisnik, event: any){
    if(event.target.checked){
      this.odabraniDekorateri.push(d);
    }
    else{
      this.odabraniDekorateri.splice(this.odabraniDekorateri.indexOf(d), 1);
    }
  }

  slobodniDekorateri(){
    let zauzeti = this.firme.reduce((acc, curr)=> [...acc, ...curr.dekoratori.split(',')], new Array());
    return this.dekorateri.filter(elem => !zauzeti.some(ime => ime == elem.kor_ime));
  }

  odaberiKontakt(tel: string, event: any){
    if(event.target.checked){
      this.novaFirma.kontakt_osoba = tel;
    }
  }

  proveriFirmu(f: Firma){
    if(this.novaFirma.adresa == "" || this.novaFirma.kontakt_osoba == "" || this.novaFirma.lokacija == ""
      || this.novaFirma.naziv == "" || this.novaUsluga.usluga == "" || this.novaUsluga.cena == null 
      || this.datumOd == "" || this.datumDo == ""
    )
    {
      this.porukaGreskeFirma = "GRESKA:: Niste uneli sve podatke";
      return false;
    }
    return true;
  }

  dodajFirmu(){

    if(!this.proveriFirmu(this.novaFirma)){
      return;
    }

    if(this.odabraniDekorateri.length < 2){
      this.porukaGreskeFirma = "GRESKA:: Morate odabrati najmanje dva dekoratera!";
      return;
    }
    if(new Date(this.datumOd).getTime() >= new Date(this.datumDo).getTime()){
      this.porukaGreskeFirma = "GRESKA:: Neispravan datum godišnjeg odmora!";
      return;
    }
    this.porukaGreskeFirma = "";

    this.novaFirma.dekoratori = this.odabraniDekorateri.reduce((acc, curr) => acc + "," + curr.kor_ime , "").slice(1);
    this.novaFirma.usluge.push(JSON.parse(JSON.stringify(this.novaUsluga)));
    this.novaFirma.godisnji_odmor = this.datumOd + "/" + this.datumDo;
    
    this.servis.dodajFirmu(this.novaFirma).subscribe(data=>{
      alert(data);
      this.firme.push(JSON.parse(JSON.stringify(this.novaFirma)));
      this.novaFirma = new Firma();
      this.odabraniDekorateri = [];
      this.novaUsluga = new Usluga();
      this.datumOd = "";
      this.datumDo = "";
    })
  }

  dohvatiFirme(){
    this.servis.dohvatiFirme().subscribe(data=>{
      this.firme = data;
    })
  }

  dajLokaciju(f: Firma){
    return this.sanitizer.bypassSecurityTrustResourceUrl(f.lokacija);
  }

  dodajUslugu(f: Firma, naziv: string, cena: string){
    
    this.servis.dodajUslugu(f, {usluga:naziv, cena: +cena}).subscribe(data=>{
      alert(data);
      this.firme.find(elem => elem.naziv == f.naziv)?.usluge.push(JSON.parse(JSON.stringify({usluga:naziv, cena: +cena})));
    })
  }

  izmeniPodatkeKorisnika(k:Korisnik){
    localStorage.setItem("korisnikZaIzmenu", JSON.stringify(k));
    localStorage.setItem("putanjaNazad", "./administrator/pocetna");

    this.ruter.navigate(['izmena']);
  }

  blokirajKorisnika(k: Korisnik){
    this.servis.blokirajKorisnika(k).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  odblokirajKorisnika(k: Korisnik){
    this.servis.odblokirajKorisnika(k).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  promenaLozinke(k:Korisnik){
    localStorage.setItem("korisnikPromenaLozinke", JSON.stringify(k));
    this.ruter.navigate(['promenaLozinke']);
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['administrator']);
  }

  odaberiZaUFirmu(d: string, event: any){
    if(event.target.checked){
      this.dekoraterZaFirmu = d;
    }
  }

  dodajDekorateraUFirmu(f: Firma){
    f.dekoratori += "," + this.dekoraterZaFirmu;
    this.servis.dodajDekorateraUFirmu(f).subscribe(data=>{
      alert(data);
      this.dekoraterZaFirmu = "";
      this.ngOnInit();
    })

  }
  


}
