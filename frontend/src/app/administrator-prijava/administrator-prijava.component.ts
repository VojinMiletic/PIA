import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrijavaService } from '../prijava.service';
import { Korisnik } from '../Modeli/Korisnik';
import md5 from 'md5';

@Component({
  selector: 'app-administrator-prijava',
  templateUrl: './administrator-prijava.component.html',
  styleUrls: ['./administrator-prijava.component.css']
})
export class AdministratorPrijavaComponent {

  constructor(private ruter: Router, private servis: PrijavaService) {}

  k: Korisnik = new Korisnik();
  lozinka: string = "";
  poruka: string = "";

  prijava(){
    this.k.lozinka = md5(this.lozinka);
    this.servis.prijava(this.k).subscribe(data=>{
      if(data){
        this.poruka = "";
        if(data.tip != "administrator"){
          this.poruka = "Za prijavu običnih korisnika potrebno je koristiti drugu putanju!";
          return;
        }
        localStorage.setItem("korisnik", JSON.stringify(data));
        this.ruter.navigate(['administrator/pocetna']);
      }
      else{
        this.poruka = "Greska:: Pogresno korisnicko ime i/ili lozinka!"
      }
    })
  }
}
