import { Request, Response} from "express";
import { PartieSimpleInterface } from "../partieSimple/DB-partie-simple/DB-partie-simple";
import { PartieMultipleInterface } from "../partieMultiple/DB-partie-multiple/DB-partie-multiple";
import { injectable } from "inversify";
import * as fsx from "fs-extra";
import * as util from "util";
import * as fs from "fs";
import * as uniqid from "uniqid";
import * as constantes from "../constantes";
import { BaseDeDonnees } from "../baseDeDonnees/baseDeDonnees";
import { ChildProcess } from "child_process";
import { Schema, Model, Document } from "mongoose";
import uniqueValidator = require("mongoose-unique-validator");

export interface TempsUser {
  _user: string;
  _temps: number;
}

@injectable()
export abstract class DBPartieAbstract {

    protected baseDeDonnees: BaseDeDonnees;

    protected modelPartieBuffer: Model<Document>;
    protected modelPartieArray: Model<Document>;

    protected schemaBuffer: Schema;
    protected schemaArray: Schema;

    protected abstract listeChannelsMultijoueur: Map<string, number>;

    public constructor() {
      this.baseDeDonnees = new BaseDeDonnees();

      this.createSchemaArray();
      this.createSchemaBuffer();

      this.schemaBuffer.plugin(uniqueValidator);
      this.schemaArray.plugin(uniqueValidator);

    }

    public abstract async requeteAjouterPartie(req: Request, res: Response): Promise<void>;

    public abstract async requeteDeletePartie(req: Request, res: Response): Promise<void>;

    public async requetePartieId(req: Request, res: Response): Promise<void> {
      await this.baseDeDonnees.assurerConnection();
      res.send(await this.obtenirPartieId(req.params.id));
    }

    public async requeteGetPartie(req: Request, res: Response): Promise<void> {
      await this.baseDeDonnees.assurerConnection();
      res.send(await this.getPartieById(req.params.id));
    }

    public requetesupprimerChannelId(req: Request, res: Response): void {
      try {
        this.listeChannelsMultijoueur.delete(req.body.channelId);
      } catch (err) {
        res.status(constantes.HTTP_NOT_IMPLEMENTED).json(err);
      }
    }

    public requeteGetChannelId(req: Request, res: Response): void {
      try {
        const id: string = this.getChannelId();
        this.listeChannelsMultijoueur.set(id, 0);
        res.status(constantes.HTTP_CREATED).json(id);
      } catch (err) {
        res.status(constantes.HTTP_NOT_IMPLEMENTED).json(err);
      }
    }

    public requetePartieChargee(req: Request, res: Response): void {
      try {
        let nbrePartiesChargees: number = this.listeChannelsMultijoueur.get(req.body.channelId) as number;
        nbrePartiesChargees++;
        nbrePartiesChargees === constantes.NBRE_PARTIES_MULTIJOUEUR ? this.envoyerPartiesPretes(req.body.channelId)
                                  : this.listeChannelsMultijoueur.set(req.body.channelId, nbrePartiesChargees);
        res.status(constantes.HTTP_CREATED).json(req.body.channelId);
      } catch (err) {
        res.status(constantes.HTTP_NOT_IMPLEMENTED).json(err);
      }
    }

    public async requeteReinitialiserTemps(req: Request, res: Response): Promise<void> {
      await this.baseDeDonnees.assurerConnection();
      try {
          await this.reinitialiserTemps(req.params.id, req.body.tempsSolo, req.body.tempsUnContreUn);
          res.status(constantes.HTTP_CREATED);
      } catch (err) {
          res.status(constantes.HTTP_NOT_IMPLEMENTED).json(err);
      }
    }

    public async requeteAjouterPartieTemps(req: Request, res: Response): Promise<void> {
      try {
          await this.ajouterTemps(req.params.id, req.body.temps, req.body.isSolo);
          res.status(constantes.HTTP_CREATED);
      } catch (err) {
          res.status(constantes.HTTP_NOT_IMPLEMENTED).json(err);
      }
    }

    public async requeteGetListePartie(req: Request, res: Response): Promise<void> {
      await this.baseDeDonnees.assurerConnection();
      res.send(await this.getListePartie());
    }

    protected abstract async ajouterTemps(idPartie: string, temps: TempsUser, isSolo: boolean): Promise<void>;

    protected abstract async reinitialiserTemps(idPartie: String, tempsSolo: Array<TempsUser>,
                                                tempsUnContreUn: Array<TempsUser>): Promise<void>;

    protected abstract async getPartieByName(nomPartie: String): Promise<PartieSimpleInterface | PartieMultipleInterface>;

    protected abstract async getPartieById(partieID: String): Promise<PartieSimpleInterface | PartieMultipleInterface>;

    protected abstract async obtenirPartieId(nomPartie: String): Promise<string>;

    protected abstract async getListePartie(): Promise<PartieSimpleInterface[] | PartieMultipleInterface[]>;

    protected abstract async deletePartie(idPartie: string, res: Response): Promise<Response>;

    protected abstract async verifierErreurScript(child: ChildProcess,
                                                  partie: PartieSimpleInterface | PartieMultipleInterface): Promise<void>;

    protected abstract envoyerPartiesPretes(channelId: string): void;

    protected abstract createSchemaArray(): void;

    protected abstract createSchemaBuffer(): void;

    protected getSortedTimes(arr: Array<TempsUser>): Array<TempsUser> {
        if (arr) {
          arr.sort((t1: TempsUser, t2: TempsUser) => {
            const time1: number = t1["_temps"];
            const time2: number = t2["_temps"];
            if (time1 > time2) { return 1; }
            if (time1 < time2) { return -1; }

            return 0;
          });
        }

        return arr;
    }

    protected async makeImagesDirectory(): Promise<void> {
      const dir: string = constantes.IMAGES_DIRECTORY;
      const mkdirPromise: Function = util.promisify(fs.mkdir);
      const existsPromise: Function = util.promisify(fs.exists);
      if (await existsPromise(dir)) {
          await fsx.remove(dir);
      }

      await mkdirPromise(dir);
    }

    protected async deleteImagesDirectory(): Promise<void> {
      const dir: string = constantes.IMAGES_DIRECTORY;
      await fsx.remove(dir);
    }

    private getChannelId(): string {
      const id: string = uniqid();
      if (this.listeChannelsMultijoueur.has(id)) {
        this.getChannelId();
      }

      return id;
    }
}
