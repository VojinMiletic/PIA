import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import md5 from 'md5';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router) {}

  ngOnInit(): void {
      let x = localStorage.getItem("korisnikPromenaLozinke");
      if(x){
        this.k = JSON.parse(x);
      }
  }

  k: Korisnik = new Korisnik();
  porukaLozinka : string = "";
  porukaGreske: string = "";
  novaLozinka: string = "";
  staraLozinka: string = "";
  ponovljenaNovaLozinka: string = "";

  proveriLozinku(){
    if(/^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[\W_]).{6,10}$/.test(this.novaLozinka)){
      this.porukaLozinka = "Lozinka je ispravna";
      return true;
    }
    this.porukaLozinka = "Lozinka je neispravna";
    return false;
  }

  promeniLozinku(){
    if(this.novaLozinka != this.ponovljenaNovaLozinka){
      this.porukaGreske = "GRESKA:: Niste lepo ponovili lozinku!";
      return;
    }
    this.porukaGreske = "";

    
    this.servis.promenaLozinke(this.k, md5(this.novaLozinka), md5(this.staraLozinka)).subscribe(data=>{
      if(data == "Ok"){
        alert("Uspešno ste promenili lozinku, nazad na prijavu.");
        this.porukaGreske = "";
        localStorage.removeItem("korisnikPromenaLozinke");
        if(this.k.tip == "vlasnik" || this.k.tip == "dekorater"){
          this.ruter.navigate(['']);
        }
        else{
          this.ruter.navigate(['administrator']);
        }
      }
      else{
        this.porukaGreske = data;
      }
    })
  }

  nazad(){
    localStorage.removeItem("korisnikPromenaLozinke");
    if(this.k.tip == "vlasnik"){
      this.ruter.navigate(['vlasnik/pocetna']);
    }
    else if(this.k.tip == "dekorater"){
      this.ruter.navigate(['dekorater/pocetna']);
    }
    else{
      this.ruter.navigate(['administrator/pocetna']);
    }
  }




}
