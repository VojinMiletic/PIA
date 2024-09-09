import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';

@Component({
  selector: 'app-izmena',
  templateUrl: './izmena.component.html',
  styleUrls: ['./izmena.component.css']
})
export class IzmenaComponent implements OnInit {

  constructor(private servis:PrijavaService, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnikZaIzmenu");
      if(x){
        this.k = JSON.parse(x);
      }
  }

  k: Korisnik = new Korisnik();

  poruka: string = "";

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
    if(k.adresa == "" || k.ime == "" || k.prezime == "" || k.mejl == "" 
      || k.pol == "" || k.telefon == "" || this.proveriKarticu(k) == null )
    {
      return false;
    }
    return true;
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

  izmeniKorisnika(){

    if(this.proveriPodatke(this.k) == false){
      this.poruka = "GRESKA:: Niste uneli sve podake ili su neki neispravni";
      return;
    }

    this.servis.izmeniKorisnika(this.k).subscribe(data=>{
      if(data == "Ok"){
        this.poruka = "";
        alert("Uspešna izmena podataka.");
        localStorage.removeItem("korisnikZaIzmenu");
        let putanja = localStorage.getItem("putanjaNazad");
        localStorage.removeItem("putanjaNazad");
        if(putanja == "./vlasnik/pocetna" || putanja == "./dekorater/pocetna"){
          localStorage.setItem("korisnik", JSON.stringify(this.k));
        }
        this.ruter.navigate([putanja]);
      }
      else{
        this.poruka = data;
      }
    })
  }

  nazad(){
    localStorage.removeItem("korisnikZaIzmenu");
    let putanja = localStorage.getItem("putanjaNazad");
    localStorage.removeItem("putanjaNazad");
    if(putanja == "./vlasnik/pocetna" || putanja == "./dekorater/pocetna"){
      localStorage.setItem("korisnik", JSON.stringify(this.k));
    }
    this.ruter.navigate([putanja]);
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
              this.k.slika = reader.result as string;
              this.poruka = "";
            }
            else{
              this.poruka = "Slika nedozvoljenih dimenzija";
            }
          };
          slika.src = reader.result as string;
        }
        reader.readAsDataURL(fajl);
      }  
    }
  }

}
