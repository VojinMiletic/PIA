import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdministratorPrijavaComponent } from './administrator-prijava/administrator-prijava.component';
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

const routes: Routes = [
  {path: '', component: PrijavaComponent},
  {path: 'registracija', component: RegistracijaComponent},
  {path: 'vlasnik/pocetna', component: VlasnikComponent},
  {path: 'dekorater/pocetna', component: DekoraterComponent},
  {path: 'administrator/pocetna', component: AdministratorComponent},
  {path: 'administrator', component: AdministratorPrijavaComponent},
  {path: 'izmena', component:IzmenaComponent},
  {path: 'promenaLozinke', component:PromenaLozinkeComponent},
  {path: 'vlasnik/firme', component:VlasnikFirmeComponent},
  {path: 'vlasnik/firme/detalji', component:DetaljiFirmeComponent},
  {path: 'dekorater/zakazivanja', component:DekoraterZakazivanjaComponent},
  {path: 'dekorater/crtez', component:DekoraterCrtezComponent},
  {path: 'vlasnik/zakazivanja', component:VlasnikZakazivanjaComponent},
  {path: 'vlasnik/odrzavanje', component:VlasnikOdrzavanjeComponent},
  {path: 'dekorater/odrzavanje', component:DekoraterOdrzavanjeComponent},
  {path: 'dekorater/statistika', component:DekoraterStatistikaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
