import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PartieSimpleInterface } from '../../liste-parties/partie-simple/partie-simple.component';
import { ListePartiesComponent } from '../../liste-parties/liste-parties.component';
import { DialogData } from '../admin.component';
import { HttpClient } from '@angular/common/http';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { ImageSimple } from './image-simple';
import { ImageService } from "../image.service";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export const IMAGE_URL: string = "http://localhost:3000/images/";
const URL_AJOUTER: string = IMAGE_URL + "ajouter/";

@Component({
  selector: 'app-dialog-simple',
  templateUrl: './dialog-simple.component.html',
  styleUrls: ['./dialog-simple.component.css']
})
export class DialogSimpleComponent {

  public outOfBoundNameLengthMessage: String = "";
  public wrongNumberOfImagesMessage: String = "";
  public wrongImageSizeOrTypeMessage: String = "";
  public currentImageNumber: number;
  public partieSimple: PartieSimpleInterface;
  public listeParties: ListePartiesComponent = new ListePartiesComponent();
  public selectedFiles: File[] = [];
  public correctImageExtension: String = "image/bmp";
  public titrePartie = new FormControl('', [Validators.required]);
  public imageNameTaken: Boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogSimpleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService) {
    }

  // Tested
  public onFileSelectedImage(event, i) {
    this.currentImageNumber = i;
    const file = event.target.files[0] as File;
    this.selectedFiles[this.currentImageNumber] = file;
    this.convertImageToArrayToCheckSize(this.selectedFiles[this.currentImageNumber]);
  }

  public onSubmit(): void {
    const imageName: string = this.selectedFiles[this.currentImageNumber].name;
    console.log(imageName);
    const result: ImageSimple = new ImageSimple(imageName);
    this.imageService.register(result)
        .subscribe(
            (data) => {
                this.imageNameTaken = false;
                this.createCookie(imageName);
            },
            (error) => {
                console.error(error);
                this.imageNameTaken = true;
            });
  }

  public createCookie(imageName: string): void {
      this.cookieService.set("imageName", imageName);
  }

  public obtenirImageId(identifiant: string): Observable<ImageSimple> {
      return this.http.get<ImageSimple>(IMAGE_URL + identifiant);
  }

  public obtenirImageName(imageName: string): Observable<ImageSimple> {
      return this.http.get<ImageSimple>(IMAGE_URL + imageName);
  }

  public async creerNouvelleImage(image: ImageSimple): Promise<Object> {
      return this.http.post(URL_AJOUTER, image).toPromise();
  }

  public convertImageToArrayToCheckSize(file: File): void {
    const self: DialogSimpleComponent = this;
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {
      const dv: DataView = new DataView(reader.result as ArrayBuffer);
      const imageInfo = {"size": dv.getUint16(28, true), "width": dv.getUint32(18, true), "height": dv.getUint32(22, true)};
      self.setWrongImageSizeOrTypeMessage(imageInfo);
    };
  }

  // Tested
  public setWrongImageSizeOrTypeMessage(imageInfo): void {
    this.checkIfWrongImageSize(imageInfo) || this.checkIfWrongImageType() ?
      this.wrongImageSizeOrTypeMessage = "*L'image doit être de format BMP 24 bits et de taille 640 x 480 pixels" :
      this.wrongImageSizeOrTypeMessage = "";
  }

  // Tested
  private checkIfWrongImageSize(imageInfo): Boolean {
    if (imageInfo["size"] !== 24 || imageInfo["width"] !== 640 || imageInfo["height"] !== 480) {
      return true;
    }

    return false;
  }

  // Tested
  private checkIfWrongImageType(): Boolean {
    if (this.selectedFiles[this.currentImageNumber] !== undefined
      && this.selectedFiles[this.currentImageNumber].type !== this.correctImageExtension) {
        return true;
    }

    return false;
  }

  // Tested
  public onNoClick(): void {
    this.dialogRef.close();
  }

  // Tested
  public onAddSimpleGameClick(): void {
    this.setWrongNumberOfImagesMessage();
    this.setOutOfBoundNameLengthMessage();
    this.closeDialogIfRequirements();
  }

  // Tested
  private checkIfWrongNumberOfImages(): Boolean {
    if (this.selectedFiles[0] === undefined || this.selectedFiles[0] === null
      || this.selectedFiles[1] === undefined || this.selectedFiles[1] === null) {
        return true;
      }

    return false;
  }

  // Tested
  public setWrongNumberOfImagesMessage(): void {
    this.checkIfWrongNumberOfImages() ?
    this.wrongNumberOfImagesMessage = '*Vous devez entrer deux images.' :
    this.wrongNumberOfImagesMessage = "";
  }

  // Tested
  private checkIfOutOfBoundNameLength(): Boolean {
    if (this.data.simpleGameName === "" || this.data.simpleGameName === undefined
    || this.data.simpleGameName.length < 3 || this.data.simpleGameName.length > 20) {
      return true;
    }

    return false;
  }

  // Tested
  public setOutOfBoundNameLengthMessage(): void {
    this.checkIfOutOfBoundNameLength() ?
      this.outOfBoundNameLengthMessage = "*Le nom du jeu doit être entre 3 et 20 charactères." :
      this.outOfBoundNameLengthMessage = "" ;
  }

  // Tested
  public checkIfNoErrorMessage(): Boolean {
    if (this.outOfBoundNameLengthMessage === ""
    && this.wrongNumberOfImagesMessage === ""
    && this.wrongImageSizeOrTypeMessage === "") {
      return true;
    }

    return false;
  }

  // Tested
  public closeDialogIfRequirements(): void {
   if (this.checkIfNoErrorMessage()) {
      this.onSubmit();
      this.dialogRef.close();
      this.createNewSimpleGameCardAndAddToList();
    }
  }

  // Tested
  public createNewSimpleGameCardAndAddToList(): void {
    const partieSimple: PartieSimpleInterface = {
        title: this.data.simpleGameName, imagePath: 'assets/NissanPatrol.jpg', isElevatedActive: false,
        timesSolo: [], timesOneVsOne: [],
      };
    this.addNewSimpleGameCardToList(partieSimple);
  }

  // Tested
  private addNewSimpleGameCardToList(partieSimple: PartieSimpleInterface): void {
    this.listeParties.listePartiesSimples.push(partieSimple);
  }

  // TODO : implementer le mat-error dans le html
  // public checkIfOutOfBoundName(bla: String): boolean {
  //   if (bla === "" || bla === undefined
  //   || bla.length < 3 || bla.length > 20) {
  //     this.outOfBoundNameLengthMessage = "*Le nom du jeu doit être entre 3 et 20 charactères.";

  //     return true;
  //   }
  //   this.outOfBoundNameLengthMessage = "" ;

  //   return false;
  // }
}
