import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import { Firma } from '../Modeli/Firma';
import { Zahtev } from '../Modeli/Zahtev';

@Component({
  selector: 'app-dekorater-zakazivanja',
  templateUrl: './dekorater-zakazivanja.component.html',
  styleUrls: ['./dekorater-zakazivanja.component.css']
})
export class DekoraterZakazivanjaComponent implements OnInit {

  constructor(private servis:PrijavaService, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("dekorater");
      if(x){
        this.k = JSON.parse(x);
      }
      this.dohvatiFirmu();
  }

  k: Korisnik = new Korisnik();
  mojaFirma: Firma = new Firma();
  zahtevi : Zahtev[] = [];
  porukaGreske: string = "";
  mojiZahtevi: Zahtev[] = [];

  dohvatiFirmu(){
    this.servis.dohvatiFirme().subscribe(firme=>{
      this.mojaFirma = firme.find(elem => elem.dekoratori.split(',').some(dek => dek == this.k.kor_ime));

      this.servis.dohvatiZahteve().subscribe(sviZahtevi =>{
        this.zahtevi = sviZahtevi.filter(zahtev => zahtev.firma == this.mojaFirma.naziv);
        this.mojiZahtevi = this.zahtevi.filter(elem => elem.dekorater == this.k.kor_ime);
      })
    })
  }

  neobradjeniZahtevi() : Zahtev[]{
    return this.zahtevi.filter(elem => elem.status == "neobradjen").
    sort((a,b)=> new Date(b.datum_zakazivanja).getTime() - new Date(a.datum_zakazivanja).getTime());
  }

  dajDatum(datum: string){
    return datum.split('T')[0] + " " + datum.split('T')[1];
  }

  prihvaceniZahtevi() : Zahtev[]{
    return this.mojiZahtevi.filter(elem => elem.status == "prihvacen");
  }

  prihvatiZahtev(z: Zahtev){
    if(z.datum_kraj == ""){
      this.porukaGreske = "Unesite procenjeno vreme završetka radova.";
      return;
    }
    if(this.mojiZahtevi.filter(elem=> elem.status == "prihvacen" && 
      new Date(z.datum_pocetak).getTime() >= new Date(elem.datum_pocetak).valueOf() && 
      new Date(z.datum_pocetak).getTime() <= new Date(elem.datum_kraj).valueOf()
    ).length > 0)
    {
      this.porukaGreske = "Već imate zakazan posao u vreme početka odabranog posla";
      return;
    }
    if(new Date(z.datum_kraj).getTime() <= new Date(z.datum_pocetak).valueOf()){
      this.porukaGreske = "Datum kraja posla mora biti posle datuma početka posla";
      return;
    }
    if(this.mojiZahtevi.filter(elem => elem.status == "prihvacen" && 
      new Date(z.datum_pocetak).valueOf() < new Date(elem.datum_pocetak).valueOf() && 
      new Date(z.datum_kraj).valueOf() >= new Date(elem.datum_pocetak).valueOf()
    ).length > 0){
      this.porukaGreske = "Već imate zakazan posao u vreme postavljenog završetka odabranog posla.";
      return;
    }
    this.porukaGreske = "";
    z.dekorater = this.k.kor_ime;

    if(this.k.zahtevi == "") 
      this.k.zahtevi += ("" + z.idZ);
    else this.k.zahtevi += ("," + z.idZ);

    this.servis.prihvatiZahtev(z, this.k).subscribe(data=>{
      alert(data);
      
      localStorage.setItem("dekorater", JSON.stringify(this.k));
      
      this.ngOnInit();
    })
  }

  odbijZahtev(z: Zahtev){
    if(z.odbijnica == ""){
      this.porukaGreske = "Prilikom odbijanja zahteva obavezno ostaviti poruku.";
      return;
    }
    this.porukaGreske = "";
    z.status = "odbijen";
    this.servis.odbijZahtev(z).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  prikaziCrtez(z: Zahtev){
    localStorage.setItem("zahtev", JSON.stringify(z));
    this.ruter.navigate(['dekorater/crtez']);
  }

  nazad(){
    localStorage.removeItem("dekorater");
    this.ruter.navigate(['dekorater/pocetna']);
  }

  trenutniZahtev(z: Zahtev){
    if(new Date(z.datum_pocetak).valueOf() <= new Date().valueOf())
      return true;

    return false;
  }

  zavrsiZahtev(z: Zahtev){
    z.datum_kraj = new Date().toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Koristi 24-časovni format
    }).replace(',', 'T');

    z.status = "zavrsen";
    this.servis.zavrsiZahtev(z).subscribe(data=>{
      alert(data);
      this.ngOnInit();
    })
  }

  zavrseniPoslovi() : Zahtev[]{
    return this.mojiZahtevi.filter(elem=> elem.status == "zavrsen");
  }


  ubaciSliku(z: Zahtev, event: any){
    if(event.target.value){
      const fajl = <File>event.target.files[0];
      const dozvoljeniTipovi = ["image/png", "image/jpg", "image/jpeg"];
      if(fajl && dozvoljeniTipovi.includes(fajl.type)){
        const reader = new FileReader();
        reader.onload = () =>{
          const slika = new Image();
          slika.onload = () => {
            if(slika.width > 300 || slika.height > 300){
              alert("Slika prevelikih dimenzija!");
            }
              z.slika = reader.result as string;  

              this.servis.dodajSliku(z).subscribe(data=>{
                alert(data);
              })
          };
          slika.src = reader.result as string;
        }
        reader.readAsDataURL(fajl);
      }  
    }
  }

  odjava(){
    localStorage.removeItem("dekorater");
    this.ruter.navigate(['']);
  }

}
