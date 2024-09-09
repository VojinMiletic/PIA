import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Korisnik } from '../Modeli/Korisnik';
import { Firma } from '../Modeli/Firma';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Zahtev } from '../Modeli/Zahtev';
import { Usluga } from '../Modeli/Usluga';
import { Oblik } from '../Modeli/Oblik';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

@Component({
  selector: 'app-detalji-firme',
  templateUrl: './detalji-firme.component.html',
  styleUrls: ['./detalji-firme.component.css']
})
export class DetaljiFirmeComponent implements OnInit, AfterViewInit{

  constructor(private servis: PrijavaService, private ruter: Router, private sanitizer: DomSanitizer,
  ){}

  @ViewChild('gardenCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;


  k: Korisnik = new Korisnik();
  f: Firma = new Firma();
  

  korak: number = 1; // imamo 2 koraka 
  noviZahtev: Zahtev = new Zahtev();
  porukaGreske: string = "";

  noveUsluge: Usluga[] = [];

  zahtevi: Zahtev[] = [];

  odabraniOblik : string = "";
  oblici: Oblik[] = [];


  ngAfterViewInit(): void {
    
  }

  prikaziKanvas(){
    if(this.korak == 3){
      if (this.canvas) {
        this.ctx = this.canvas.nativeElement.getContext('2d');
      }
      return true;
    }
    return false;
  }

  ngOnInit(): void {
      let x = localStorage.getItem("korisnik");
      if(x){
        this.k = JSON.parse(x);
      }
      let y = localStorage.getItem("firma");
      if(y){
        this.f = JSON.parse(y);
      }
      this.dohvatiZahteve();
  }

  onCanvasClick(event: MouseEvent){
    if (this.odabraniOblik) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const noviOblik = this.napraviOblik(this.odabraniOblik, x, y);
      if (noviOblik && this.nePreklapanje(noviOblik)) {
        this.nacrtajOblik(noviOblik);
        this.oblici.push(noviOblik);
      } else {

      }
    }
  }

  izbrisiPoslednje(){
    const oblik = this.oblici[this.oblici.length - 1];
    this.oblici = this.oblici.slice(0, this.oblici.length - 1);
    oblik.boja = 'white';
    this.nacrtajOblik(oblik);
  }

  nePreklapanje(oblik: Oblik) : boolean{
    
    if(this.kolizijaSaIvicom(oblik)){
      this.porukaGreske = "Oblik se ne sme preklapati sa ivicom";
      return false;
    } 

    for(let i = 0; i < this.oblici.length; i++){
      const elem = this.oblici[i];
      if(elem == oblik) continue;

      if((elem.tip == 'circle' && oblik.tip == 'rectangle')){
        if(this.kolizijaKrugaIPravougaonika(elem, oblik)){
          this.porukaGreske = "Oblik se ne sme preklapati sa drugim!";
          return false;
        }
      }
      if((elem.tip == 'rectangle' && oblik.tip == 'circle')){
        if(this.kolizijaKrugaIPravougaonika(oblik, elem)){
          this.porukaGreske = "Oblik se ne sme preklapati sa drugim!";
          return false;
        }
      }
      if(elem.tip == 'circle' && oblik.tip == 'circle'){
        if(this.kolizijaKrugova(elem, oblik)){
          this.porukaGreske = "Oblik se ne sme preklapati sa drugim!";
          return false;
        }
      }
      if(elem.tip == 'rectangle' && oblik.tip == 'rectangle'){
        if(this.kolizijaPravougaonika(elem, oblik)){
          this.porukaGreske = "Oblik se ne sme preklapati sa drugim!";
          return false;
        }
      }

    }
    this.porukaGreske = "";
    return true;
     
  }

  kolizijaPravougaonika(rec1: Oblik, rec2: Oblik){
    return !(rec1.x + rec1.a < rec2.x ||
            rec1.x > rec2.x + rec2.a ||
            rec1.y + rec1.b < rec2.y ||
            rec1.y > rec2.y + rec2.b
          )
  }

  kolizijaKrugova(krug1: Oblik, krug2: Oblik){
    const dx = krug1.x - krug2.x;
    const dy = krug1.y - krug2.y;
    const rastojanje = Math.sqrt(dx*dx + dy*dy);
    return rastojanje < krug1.r + krug2.r;
  }

  kolizijaKrugaIPravougaonika(krug: Oblik, rect: Oblik){
    
    const najblizeX = Math.max(rect.x, Math.min(krug.x, rect.x + rect.a));
    const najblizeY = Math.max(rect.y, Math.min(krug.y, rect.y + rect.b));

    const dx = krug.x - najblizeX;
    const dy = krug.y - najblizeY;
    const rastojanje = Math.sqrt(dx * dx + dy * dy);

    return rastojanje < krug.r;
  }

  kolizijaSaIvicom(oblik: Oblik): boolean {
    if (oblik.tip == "circle") {
        return !(oblik.x - oblik.r > 0 && oblik.x + oblik.r < this.canvas.nativeElement.width &&
                oblik.y - oblik.r > 0 && oblik.y + oblik.r < this.canvas.nativeElement.height);
    } else {
        return !(oblik.x + oblik.a < this.canvas.nativeElement.width &&
                oblik.y + oblik.b < this.canvas.nativeElement.height);
    }
}


  napraviOblik(type: string, x: number, y: number): Oblik {
    switch (type) {
      case 'zelenilo':
        return { tip: 'rectangle', x, y, a: 50, b: 50, boja: '#0dd94a' };
      case 'bazen':
        return { tip: 'rectangle', x, y, a: 250, b: 100, boja: '#0d7dd9' };
      case 'fontana':
        return { tip: 'circle', x, y, r: 40, boja: 'blue' };
      case 'sto':
        return { tip: 'circle', x, y, r: 15, boja: '#b59153' };
      case 'stolica':
        return { tip: 'rectangle', x, y, a: 15, b: 30, boja: 'grey' };
      default:
        return null;
    }
  }

  nacrtajOblik(oblik: Oblik){
    this.ctx.fillStyle = oblik.boja;
    if (oblik.tip === 'rectangle') {
      this.ctx.fillRect(oblik.x, oblik.y, oblik.a, oblik.b);
    } else if (oblik.tip === 'circle') {
      this.ctx.beginPath();
      this.ctx.arc(oblik.x, oblik.y, oblik.r, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  ubacenFajl(event : any){
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          this.oblici = JSON.parse(e.target?.result as string);
          for(let i = 0; i < this.oblici.length; i++){
            if(!this.nePreklapanje(this.oblici[i])){
              alert("Vaš fajl sadrži oblike koji se preklapaju, unesite drugi fajl!");
              return;
            }
          }
          this.oblici.forEach(oblik =>  this.nacrtajOblik(oblik))

        } catch (error) {
          alert('Error parsing JSON file ' + error);
        }
      };

      reader.readAsText(file);
    }
  }
  


  dohvatiZahteve(){
    this.servis.dohvatiZahteve().subscribe(data=>{
      this.zahtevi = data.filter(zahtev => zahtev.firma == this.f.naziv);
    })
  }

  dajLokaciju(f: Firma){
    return this.sanitizer.bypassSecurityTrustResourceUrl(f.lokacija);
  }

  nazad(){
    localStorage.removeItem("firma");
    this.ruter.navigate(['vlasnik/firme']);
  }

  slobodniDekorateri(datum_pocetak : string){
    let preklapajuSe = this.zahtevi.filter(zaht => (zaht.status == "prihvacen" && 
      new Date(datum_pocetak).valueOf() >= new Date(zaht.datum_pocetak).valueOf() &&
      new Date(datum_pocetak).valueOf() <= new Date(zaht.datum_kraj).valueOf())).length;
    
    return this.f.dekoratori.split(',').length - preklapajuSe;
  }

  jelFirmaNaGodisnjem(datum_pocetak : string){
    let pocetak = this.f.godisnji_odmor.split('/')[0];
    let kraj = this.f.godisnji_odmor.split('/')[1];
    if(new Date(datum_pocetak).valueOf() >= new Date(pocetak).valueOf() &&
       new Date(datum_pocetak).valueOf() <= new Date(kraj).valueOf())
    {
      return true;
    }
    return false;
  }

  sledeciKorak(){
    if(this.korak == 1){
      if(this.noviZahtev.datum_pocetak == ""){
        this.porukaGreske = "Niste uneli datum i vreme početka radova";
        return;
      }
      if(this.slobodniDekorateri(this.noviZahtev.datum_pocetak) < 1){
        this.porukaGreske = "Za datum koji ste odabrali nema slobodnih dekoratera\n ,odaberite drugi datum."
        return;
      }
      if(this.jelFirmaNaGodisnjem(this.noviZahtev.datum_pocetak)){
        this.porukaGreske = "Firma je na godišnjem od " + this.f.godisnji_odmor.split('/')[0] + " do " + 
        this.f.godisnji_odmor.split('/')[1] + " ,odaberite drugi datum."
        return;
      }
      if(this.noviZahtev.ukupno_kvadrata <= 0){
        this.porukaGreske = "Neispravno uneta kvadratura bašte";
        return;
      }
      if(this.noviZahtev.tip == ""){
        this.porukaGreske = "Niste odabrali tip bašte";
        return;
      }
      this.porukaGreske = "";
      this.korak++; 
    }
    else if(this.korak == 2){

      if(this.noviZahtev.ukupno_kvadrata != this.noviZahtev.bazen + this.noviZahtev.zelenilo + this.noviZahtev.lezaljke_stolovi + this.noviZahtev.fontana){
        this.porukaGreske = "Ne poklapa se kvadratura.";
        return;
      }
      if(this.noveUsluge.length == 0){
        this.porukaGreske = "Niste odabrali ni jednu uslugu";
        return;
      }

      this.porukaGreske = "";
      this.noviZahtev.usluge = JSON.parse(JSON.stringify(this.noveUsluge));
      

      this.korak++; 
      
    }
  }

  prethodniKorak(){
    if(this.korak == 3){
      this.oblici = [];
    }
    this.korak--;
  }
  
  posaljiZahtev(){
    
    this.noviZahtev.vlasnik = this.k.kor_ime;
    this.noviZahtev.firma = this.f.naziv;
    this.noviZahtev.status = "neobradjen";
    this.noviZahtev.datum_zakazivanja = new Date().toISOString();
    this.noviZahtev.raspored = JSON.parse(JSON.stringify(this.oblici));


    this.servis.dodajZahtev(this.noviZahtev).subscribe(data=>{
      alert(data);
      this.korak = 1;
      this.noviZahtev = new Zahtev();
      this.porukaGreske = "";
      this.noveUsluge = [];
      this.odabraniOblik = "";
      this.oblici = [];
    })


  }

  dodajUslugu(u: Usluga, event: any){
    if(event.target.checked){
      this.noveUsluge.push(u);
    }
    else{
      this.noveUsluge.splice(this.noveUsluge.indexOf(u), 1);
    }
  }

  jelOdabran(u: Usluga){
    return this.noveUsluge.some(elem => elem.usluga == u.usluga);
  }

  ponistiPrethodno(){
    if(this.noviZahtev.tip == "privatna"){
      this.noviZahtev.bazen = 0;
      this.noviZahtev.lezaljke_stolovi = 0;
    }
    else{
      this.noviZahtev.fontana = 0;
      this.noviZahtev.stolovi_stolice = 0;
    }
  }

  odjava(){
    localStorage.removeItem("korisnik");
    this.ruter.navigate(['']);
  }

}
