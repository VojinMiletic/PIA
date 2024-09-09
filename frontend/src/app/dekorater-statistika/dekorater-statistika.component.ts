import { Component, OnInit } from '@angular/core';
import { PrijavaService } from '../prijava.service';
import { Router } from '@angular/router';
import { Korisnik } from '../Modeli/Korisnik';
import { Zahtev } from '../Modeli/Zahtev';
import { Firma } from '../Modeli/Firma';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-dekorater-statistika',
  templateUrl: './dekorater-statistika.component.html',
  styleUrls: ['./dekorater-statistika.component.css']
})
export class DekoraterStatistikaComponent implements OnInit {

  constructor(private servis: PrijavaService, private ruter: Router){}

  ngOnInit(): void {
      let x = localStorage.getItem("dekorater");
      if(x){
        this.k = JSON.parse(x);
      }
      this.dohvatiPodatke();
  }

  k: Korisnik = new Korisnik();
  zahtevi: Zahtev[] = [];
  mojaFirma: Firma = new Firma();

  chart1: any;
  chart2: any;
  chart3: any;

  dohvatiPodatke(){
    this.servis.dohvatiFirme().subscribe(fir=>{
      this.mojaFirma = fir.find(elem => elem.dekoratori.split(',').some(dek => dek == this.k.kor_ime));

      this.servis.dohvatiZahteve().subscribe(zaht =>{
        this.zahtevi = zaht.filter(elem => elem.firma == this.mojaFirma.naziv && (elem.status == "prihvacen" || elem.status == "zavrsen"));

        this.napraviDijagramSaBarovima();

        this.napraviPitu();

        this.napraviHistogram();

      })                  
    })
  }

  brojPoslovaPoMesecima(){
    let poslovi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.zahtevi.filter(elem=>elem.dekorater == this.k.kor_ime).forEach(elem=>{
      let mesec : number = +elem.datum_pocetak.split('T')[0].split('-')[1];
      poslovi[mesec - 1] += 1;
    })
    return poslovi;
  }

  procenatPoDanima(){
    let dani = [0, 0, 0, 0, 0, 0, 0];
    this.zahtevi.forEach(elem=>{
      let dan = new Date(elem.datum_pocetak).getDay();
      if(dan == 0){
        dan = 7;
      }
      dani[dan - 1] += 1;
    })
    return dani.map(elem => (elem * 100) / this.zahtevi.length)
  }

  

  napraviDijagramSaBarovima(){
  
    this.chart1 = new Chart("Bars", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 
          'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'], 
	       datasets: [
          {
            label: "Rezervacije",
            data:this.brojPoslovaPoMesecima(),
            backgroundColor: 'red'
          } 
        ]
      },
      options: {
        aspectRatio:5.5
      }
      
    });
  }

  napraviPitu(){

    this.chart2 = new Chart("Pie", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.mojaFirma.dekoratori.split(','),
	       datasets: [
          {
            label: 'Broj poslova',
            data: this.mojaFirma.dekoratori.split(',').map(elem=> this.zahtevi.filter(zaht => zaht.dekorater == elem).length),
          backgroundColor: [
            'red',
            'blue',
            'green',
            'yellow',
            'orange',
            'pink',			
          ],
          hoverOffset: 4
        }],
            },
            options: {
              aspectRatio:5.5
            }

          });
  }

  napraviHistogram(){

    this.chart3 = new Chart("Histogram", {
      type: 'bar', // or 'line' depending on your preference
      data: {
        labels: ['Ponedeljak', 'Utorak', 'Sreda','Četvrtak',
								 'Petak', 'Subota', 'Nedelja'], // Example labels for intervals
        datasets: [{
          label: 'Udeo poslova firme po danu [%]',
          data: this.procenatPoDanima(), // Example data values for each interval
          backgroundColor: 'blue', // Adjust color as needed
          borderColor: 'black', // Adjust border color as needed
          borderWidth: 1 // Adjust border width as needed
        }]
      },
      options: {
        aspectRatio: 5.5,
      }
    });

  }




  nazad(){
    this.ruter.navigate(['dekorater/pocetna']);
  }

  odjava(){
    localStorage.removeItem("dekorater");
    this.ruter.navigate(['']);
  }
}
