import { Component, Inject } from "@angular/core";
import { DialogAbstrait, STRING_VIDE} from "../dialog-abstrait";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogData, Checkbox } from "../admin.component";
import { HttpClient } from "@angular/common/http";
import { PartieMultiple } from "./partie-multiple";
import * as Buffer from "buffer";
import { PartieMultipleService } from "../partie-multiple.service";
import { FormControl, Validators } from "@angular/forms";
import { Joueur } from "../joueur";
import { LONGUEUR_NOM_MIN, LONGUEUR_NOM_MAX, NB_OBJET_MIN, NB_OBJET_MAX } from "src/app/constantes";

const ERR_THEME: string = "*Un theme doit etre selectionne." ;
const ERR_TRANSFORMATION: string = "*Une transformation doit etre selectionnee au minimum.";

@Component({
  selector: "app-dialog-multiple",
  templateUrl: "./dialog-multiple.component.html",
  styleUrls: ["./dialog-multiple.component.css"],
})

export class DialogMultipleComponent extends DialogAbstrait {
  // tslint:disable-next-line:no-suspicious-comment
  // TODO faire une classe pour les erreurs

  protected toggleBoutonGeo: boolean;
  protected toggleBoutonTheme: boolean;
  protected erreurTransformation: string;
  protected erreurTheme: string;
  protected qteControl: FormControl;
  protected nomControl: FormControl;
  protected transformation: Checkbox[];

  public constructor(
    dialogRef: MatDialogRef<DialogMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    http: HttpClient,
    private partieMultipleService: PartieMultipleService) {
      super(dialogRef, data, http);
      this.toggleBoutonGeo = false;
      this.toggleBoutonTheme = false;
      this.erreurTransformation = STRING_VIDE;
      this.erreurTheme = STRING_VIDE;
      this.data.theme = STRING_VIDE;
      this.data.typeModification = STRING_VIDE;

      this.nomControl = new FormControl("", [
        Validators.minLength(LONGUEUR_NOM_MIN), Validators.maxLength(LONGUEUR_NOM_MAX), Validators.required]);
      this.qteControl = new FormControl("", [
        Validators.min(NB_OBJET_MIN), Validators.max(NB_OBJET_MAX),
        Validators.required, Validators.pattern("[ 0-9 ]*")]);

      this.transformation = [
          { name: "Ajout", checked: false, value: "a" },
          { name: "Suppression", checked: false, value: "s" },
          { name: "Changement de couleur", checked: false, value: "c" } ];
  }

  protected getTransformation(): void {
    const arr: Array<string> = this.transformation.filter((x) => x.checked).map((x) => x.value);
    let typeModif: string = "";
    for (const item of arr) {
      typeModif += item;
    }
    this.data.typeModification = typeModif;
  }

  protected onClickAjouterPartie(): void {
      this.setErreurTransformation();
      this.setErreurTheme();
      this.fermerDialog();
    }

  protected onSubmit(): void {
    this.ajouterPartie();
  }

  protected ajouterPartie(): void {
    const tempsSolo: Array<Joueur> = this.genererTableauTempsAleatoires();
    const temps1v1: Array<Joueur> = this.genererTableauTempsAleatoires();

    const result: PartieMultiple = new PartieMultiple(this.data.multipleGameName, tempsSolo, temps1v1,
                                                      Buffer.Buffer.from(new Array()), Buffer.Buffer.from(new Array()),
                                                      Buffer.Buffer.from(new Array()), Buffer.Buffer.from(new Array()),
                                                      new Array<Array<string>>(), new Array<Array<string>>(),
                                                      this.data.quantiteObjets, this.data.theme,
                                                      this.data.typeModification);
    this.partieMultipleService.register(result)
      .subscribe(
        () => {
          // tslint:disable-next-line:no-suspicious-comment
          // TODO: do nothing
        },
        (error) => {
          console.error(error);
        });
  }

  protected contientErreur(): boolean {
    return !(this.estVide(this.erreurTransformation) &&
            this.estVide(this.erreurTheme) &&
            this.nomControl.valid &&
            this. qteControl.valid);
  }

  protected onGeoClickButton(event: Event, theme: string): void {
    this.toggleBoutonGeo = !this.toggleBoutonGeo;
    this.toggleBoutonTheme = false;
    this.data.theme = theme;
  }

  protected onThemeClickButton(event: Event, theme: string): void {
    this.toggleBoutonTheme = !this.toggleBoutonTheme;
    this.toggleBoutonGeo = false;
    this.data.theme = theme;
  }

  protected setErreurTheme(): void {
    this.data.theme !== STRING_VIDE ?
      this.erreurTheme = STRING_VIDE :
      this.erreurTheme = ERR_THEME;
  }

  protected setErreurTransformation(): void {
    this.estVide(this.data.typeModification) ?
      this.erreurTransformation = ERR_TRANSFORMATION :
      this.erreurTransformation = STRING_VIDE ;
  }

}
