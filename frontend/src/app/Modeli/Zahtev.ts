import { Oblik } from "./Oblik";
import { Usluga } from "./Usluga";

export class Zahtev{
    idZ: number = 0;

    datum_pocetak: string = "";
   
    ukupno_kvadrata: number = 0;
    
    tip: string = "";
   
    bazen: number = 0;
    
    zelenilo: number = 0;
    
    lezaljke_stolovi: number = 0;
    
    fontana: number = 0;
    
    stolovi_stolice: number = 0;
    
    opis: string = "";

    usluge: Array<Usluga> = [];
   
    firma: string = "";
    
    vlasnik: string = "";
    
    ocena: number = 0;
    
    komentar: string = "";
    
    dekorater: string = "";
    
    status: string = "";
    
    datum_kraj: string = "";
    
    slika: string = "";
    
    odbijnica: string = "";

    raspored: Array<Oblik> = [];

    datum_zakazivanja: string = "";

}