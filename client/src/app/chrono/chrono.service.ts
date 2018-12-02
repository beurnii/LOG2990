import { Injectable } from "@angular/core";

const NB_SECONDES: number = 60;
const UNE_SECONDE: number = 1000;
const DISPLAY: number = 10;

@Injectable({
  providedIn: "root"
})
export class ChronoService {
    protected temps: number;
    protected intervale: NodeJS.Timer;
    protected enMarche: boolean;

    public constructor() {
        this.temps = 0;
        this.enMarche = false;
    }

    public reset(): void {
        this.temps = 0;
        this.enMarche = false;
        clearInterval(this.intervale);
    }

    public arreterChrono(): void {
        this.enMarche = false;
        clearInterval(this.intervale);
    }

    public getTemps(): number {
        return this.temps ;
    }

    public commencerChrono(): void {
        if (!this.enMarche) {
            this.intervale = setInterval(() => { this.temps++; }, UNE_SECONDE);
            this.enMarche = true;
        }
    }

    protected getSecondesString(): string {
        return (this.temps % NB_SECONDES < DISPLAY) ? "0" + this.temps % NB_SECONDES : this.temps % NB_SECONDES + "";
    }

    protected getMinutesString(): string {
        return (this.temps / NB_SECONDES < DISPLAY) ?
        "0" + Math.floor(this.temps / NB_SECONDES) : Math.floor(this.temps / NB_SECONDES) + "";
    }
}
