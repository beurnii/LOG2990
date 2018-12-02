import { Component, ErrorHandler, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router, Data } from "@angular/router";
import * as constantes from "../../constantes";

const PERDU_MESSAGE_DIALOG: string = "VOUS AVEZ PERDU!";
const REJOUER_MESSAGE_DIALOG: string = "Veux-tu rejouer pour regagner ton honneur?";
const LISTE_PARTIE_ROUTE: string = "/liste-parties/";

@Component({
  selector: "app-dialog-fin-partie",
  templateUrl: "./dialog-fin-partie.component.html",
  styleUrls: ["./dialog-fin-partie.component.css"]
})
export class DialogFinPartieComponent {

  protected message: string;
  protected content: string;

  public constructor(
    private dialogRef: MatDialogRef<DialogFinPartieComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) data: Data
  ) {
    this.message = data.message;
    dialogRef.disableClose = true;
    if (this.message === PERDU_MESSAGE_DIALOG) {
      this.content = REJOUER_MESSAGE_DIALOG;
    }
   }

  protected fermerDialog(): void {
    this.dialogRef.close();
    this.router.navigate([LISTE_PARTIE_ROUTE]).catch(() => ErrorHandler);

  }
}
