import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { ListePartiesComponent } from "./liste-parties/liste-parties.component";

import { HeaderComponent } from "./common/header/header.component";
import { VueInitialeComponent } from "./vue-initiale/vue-initiale.component";
import { AdminComponent, DialogSimple, DialogMultiple } from "./admin/admin.component";
import { LoginFormComponent } from "./vue-initiale/login-form/login-form.component";



import { MatToolbarModule,
        MatCardModule,
        MatBadgeModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatMenuModule,
      } from '@angular/material';

import { ModalModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChronoComponent } from './chrono/chrono.component';
import { PartieSoloComponent } from './partie-solo/partie-solo.component';
import { PartieSimpleComponent } from './liste-parties/partie-simple/partie-simple.component';

const appRoutes: Routes = [
  { path: "", component: VueInitialeComponent },
  { path: "header", component: HeaderComponent },
  { path: "admin", component: AdminComponent },
  { path: "liste-parties", component: ListePartiesComponent },
  { path: "chrono", component: ChronoComponent },
  { path: "partie-solo", component: PartieSoloComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VueInitialeComponent,
    AdminComponent,
    AppComponent,
    ListePartiesComponent,
    DialogMultiple,
    DialogSimple,
    LoginFormComponent,
    DialogSimple,
    DialogMultiple,
    ChronoComponent,
    PartieSoloComponent,
    PartieSimpleComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogSimple,
    DialogMultiple
  ],
})
export class AppModule { }
