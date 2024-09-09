import { Usluga } from "./Usluga";

export class Firma{
    adresa: string = "";

    naziv: string = "";

    kontakt_osoba: string = "";

    ocene: string = "";

    usluge: Array<Usluga> = [];

    dekoratori: string = "";

    godisnji_odmor: string = "";

    komentari: Array<string> = [];

    lokacija: string = "";

}