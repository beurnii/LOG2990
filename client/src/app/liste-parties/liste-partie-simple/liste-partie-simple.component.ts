import { Component, OnInit } from "@angular/core";
import { ListePartiesComponent } from "../liste-parties.component";
import { Router } from "@angular/router";
import {ListePartieServiceService} from "../liste-partie-service.service";
import { PartieSimple } from "../../admin/dialog-simple/partie-simple";

@Component({
  selector: "app-liste-partie-simple",
  templateUrl: "./liste-partie-simple.component.html",
  styleUrls: ["./liste-partie-simple.component.css"]
})
export class ListePartieSimpleComponent extends ListePartiesComponent implements OnInit {

  protected listeParties: PartieSimple[];

  constructor(public router: Router,
              public listePartieService: ListePartieServiceService) {
    super(router, listePartieService);
  }

  public ngOnInit() {
    this.listePartieService.getListeImageSimple().subscribe((res: PartieSimple[]) => {
      this.listeParties = res;
    });
  }

  protected ajusterImage(id: String) {
    for (const partie of this.listeParties) {
      if (partie["_id"] === id) {
        const data: string = atob(String(partie["_image1"][0]));
        let hex = 0x00;
        const result: Uint8Array = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            hex = data.charCodeAt(i);
            result[i] = hex;
        }
        const blob = new Blob([result], {type: 'image/bmp'});
        // @ts-ignore
        document.getElementById(id).src = URL.createObjectURL(blob);
      }
    }
  }

  public onJouerOuReinitialiserClick(partieId: string): void {
    if (this.isListePartiesMode) {
      this.router.navigate(["/partie-solo/" + partieId]);
    } else if (this.isAdminMode) {
      this.reinitialiserTemps(partieId);
    }
  }

  protected onCreerOuSupprimerClick(partieId: string): void {
    if (this.isListePartiesMode) {
      // Naviguer vers partie-multijouer
    } else if (this.isAdminMode) {
      this.supprimerPartie(partieId);
    }
  }

  protected supprimerPartie(partieId: string): void {
    for (let i = 0 ; i < this.listeParties.length ; i++) {
      if (this.listeParties[i]._id === partieId) {
        this.listeParties.splice(i, 1);
      }
    }
    this.listePartieService.deletePartieSimple(partieId);
  }

  protected reinitialiserTemps(partieId: string): void {
    this.listeParties.forEach((partie: PartieSimple) => {
      if (partie._id === partieId) {
        for (let i = 0 ; i < partie._tempsSolo.length ; i++) {
          partie._tempsSolo[i] = Math.floor(Math.random() * 400) + 100;
        }
        for (let i = 0 ; i < partie._tempsUnContreUn.length ; i++) {
          partie._tempsUnContreUn[i] = Math.floor(Math.random() * 400) + 100;
        }
      }
    });
    this.listePartieService.reinitialiserTempsPartie(partieId);
  }

}
