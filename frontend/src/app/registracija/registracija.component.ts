import { Component } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import md5 from 'md5';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent {

  constructor(private servis: PrijavaService, private ruter: Router){}

  k: Korisnik = new Korisnik();

  poruka: string = "";
  porukaLozinka: string = "";
  lozinka:string = "";

  captcha: string = "";

  resolve(captchaResponse: string){
    this.captcha = captchaResponse;
  }

  jelRobot() : boolean{
    return this.captcha != "";
  }

  proveriLozinku(){
    if(/^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[\W_]).{6,10}$/.test(this.lozinka)){
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
      || k.pol == "" || k.telefon == "" || this.proveriKarticu(k) == null || this.proveriLozinku() == false
    )
    {
      return false;
    }
    return true;
  }

  registrujSe(){

    if(this.proveriPodatke(this.k) == false){
      this.poruka = "GREŠKA:: Niste uneli sve podake ili su neki neispravni";
      return;
    }
    
    this.k.lozinka = md5(this.lozinka);
    this.k.status = "neodobren";
    this.k.tip = "vlasnik";

    this.servis.registracija(this.k).subscribe(data=>{
      if(data == "Ok"){
        this.poruka = "";
        alert("Uspešna registracija, sačekajte da Vas administrator odobri, nazad na prijavu.");
        this.ruter.navigate(['']);
      }
      else{
        this.poruka = data;
      }
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

  nazad(){
    this.ruter.navigate(['']);
  }
}
