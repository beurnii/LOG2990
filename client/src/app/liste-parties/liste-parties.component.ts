import {Component, ElementRef, QueryList, ViewChildren} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {ListePartieServiceService} from "./liste-partie-service.service";
import {PartieMultiple} from "../admin/dialog-multiple/partie-multiple";
import {PartieSimple} from "../admin/dialog-simple/partie-simple";
import { TempsUser } from "../admin/temps-user";
import { DomSanitizer } from "@angular/platform-browser";

const NB_SECONDES: number = 60;
const DISPLAY: number = 10;
const BORNE_INF: number = 100;
const BORNE_SUP: number = 400;
const NB_ELEMENT: number = 4;

@Component({
    selector: "app-liste-parties",
    templateUrl: "./liste-parties.component.html",
    styleUrls: ["./liste-parties.component.css"],
    providers: [ListePartieServiceService]
})

export class ListePartiesComponent {

    @ViewChildren("image") public image: QueryList<ElementRef>;

    protected jouerOuReinitialiser: string;
    protected creerOuSupprimer: string;
    protected joindreOuSupprimer: string;
    protected isListePartiesMode: boolean;
    protected isAdminMode: boolean;
    protected isElevatedActive: boolean;
    protected listePartiesEnAttente: Array<string>;
    protected username: string;

    public constructor(public router: Router,
                       public sanitizer: DomSanitizer,
                       public listePartieService: ListePartieServiceService) {
        this.username = "username";
        this.jouerOuReinitialiser = "";
        this.creerOuSupprimer = "";
        this.joindreOuSupprimer = "";
        this.isListePartiesMode = false;
        this.isAdminMode = false;
        this.listePartiesEnAttente = new Array<string>();
        this.changerBoutonSelonRouter(router);
    }

    protected setjouerOuReinitialiserAndcreerOuSupprimer(url: string): void {
        if (url === "/liste-parties") {
            this.setToJouerAndCreer();
        } else if (url === "/admin") {
            this.setToReinitialiserAndSupprimer();
        }
    }

    protected getTitleFirstLetter(title: string): string {

        return title.substr(0, 1);
    }

    protected getTitleWithoutFirstLetter(title: string): string {

        return title.substr(1, title.length - 1);
    }

    protected getDisplayTime(tempsUser: TempsUser): string {
        const minutes: number = Math.floor(tempsUser.temps / NB_SECONDES);
        const secondes: number = tempsUser.temps - minutes * NB_SECONDES;

        return (secondes < DISPLAY) ? (minutes + ":0" + secondes) : minutes + ":" + secondes;
    }

    protected genererTableauTempsAleatoires(): Array<TempsUser> {
        const arr: Array<TempsUser> = [];
        for (let i: number = 1; i < NB_ELEMENT; i++) {
            arr.push(new TempsUser("Joueur " + i, this.genererTempsAleatoire()));
        }
        this.getSortedTimes(arr);

        return arr;
    }

    protected mettreBoutonsACreer(): void {
        this.joindreOuSupprimer = "Créer";
        this.creerOuSupprimer = "Créer";
    }

    private genererTempsAleatoire(): number {
        return Math.floor(Math.random() * BORNE_SUP) + BORNE_INF;
    }

    private getSortedTimes(arr: Array<TempsUser>): Array<TempsUser> {
        if (arr) {
            arr.sort((t1: TempsUser, t2: TempsUser) => {
                const time1: number = t1.temps;
                const time2: number = t2.temps;
                if (time1 > time2) {
                    return 1;
                }
                if (time1 < time2) {
                    return -1;
                }

                return 0;
            });
        }

        return arr;
    }

    private setToJouerAndCreer(): void {
        this.isAdminMode = false;
        this.isListePartiesMode = true;
        this.jouerOuReinitialiser = "Jouer";
        this.creerOuSupprimer = "Créer";
        this.joindreOuSupprimer = "Joindre";
    }

    private setToReinitialiserAndSupprimer(): void {
        this.isListePartiesMode = false;
        this.isAdminMode = true;
        this.jouerOuReinitialiser = "Réinitialiser";
        this.creerOuSupprimer = "Supprimer";
        this.joindreOuSupprimer = "Supprimer";
    }

    private changerBoutonSelonRouter(router: Router): void {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.setjouerOuReinitialiserAndcreerOuSupprimer(val.url);
            }
        });
    }

}
