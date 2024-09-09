import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Zahtev } from '../Modeli/Zahtev';
import { Oblik } from '../Modeli/Oblik';

@Component({
  selector: 'app-dekorater-crtez',
  templateUrl: './dekorater-crtez.component.html',
  styleUrls: ['./dekorater-crtez.component.css']
})
export class DekoraterCrtezComponent implements OnInit, AfterViewInit {

  constructor(private ruter: Router){}

  @ViewChild('gardenCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;


  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
      let x = localStorage.getItem("zahtev");
      if(x){
        this.z = JSON.parse(x);
      }
  }

  z: Zahtev = new Zahtev();

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

  prikaziKanvas(){
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.z.raspored.forEach(oblik => this.nacrtajOblik(oblik));
    }
    return true;
  }

  nazad(){
    localStorage.removeItem("zahtev");
    this.ruter.navigate(['dekorater/zakazivanja'])
  }

}
