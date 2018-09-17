import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { ListePartiesComponent } from './liste-parties/liste-parties.component';

import { HeaderComponent } from "./common/header/header.component";
import { VueInitialeComponent } from "./vue-initiale/vue-initiale.component";
import { AdminComponent, AdminDialog } from "./admin/admin.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatCardModule, MatBadgeModule, MatButtonModule} from '@angular/material';

import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule, MatFormFieldModule, MatDividerModule, MatCardModule, MatButtonModule } from '@angular/material';

const appRoutes: Routes = [
  { path: "", component: VueInitialeComponent },
  { path: "header", component: HeaderComponent },
  { path: "admin", component: AdminComponent },
  { path: "liste-parties", component: ListePartiesComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VueInitialeComponent,
    AdminComponent,
    AppComponent,
    ListePartiesComponent,
    AdminDialog
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminDialog
  ],
})
export class AppModule { }
