import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdministratorPrijavaComponent } from './administrator-prijava/administrator-prijava.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IzmenaComponent } from './izmena/izmena.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { VlasnikFirmeComponent } from './vlasnik-firme/vlasnik-firme.component';
import { DetaljiFirmeComponent } from './detalji-firme/detalji-firme.component';
import { DekoraterZakazivanjaComponent } from './dekorater-zakazivanja/dekorater-zakazivanja.component';
import { DekoraterCrtezComponent } from './dekorater-crtez/dekorater-crtez.component';
import { VlasnikZakazivanjaComponent } from './vlasnik-zakazivanja/vlasnik-zakazivanja.component';
import { VlasnikOdrzavanjeComponent } from './vlasnik-odrzavanje/vlasnik-odrzavanje.component';
import { DekoraterOdrzavanjeComponent } from './dekorater-odrzavanje/dekorater-odrzavanje.component';
import { DekoraterStatistikaComponent } from './dekorater-statistika/dekorater-statistika.component';
import { NgChartsModule } from 'ng2-charts';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    RegistracijaComponent,
    PrijavaComponent,
    VlasnikComponent,
    DekoraterComponent,
    AdministratorComponent,
    AdministratorPrijavaComponent,
    IzmenaComponent,
    PromenaLozinkeComponent,
    VlasnikFirmeComponent,
    DetaljiFirmeComponent,
    DekoraterZakazivanjaComponent,
    DekoraterCrtezComponent,
    VlasnikZakazivanjaComponent,
    VlasnikOdrzavanjeComponent,
    DekoraterOdrzavanjeComponent,
    DekoraterStatistikaComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
