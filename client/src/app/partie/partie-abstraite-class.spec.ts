import { PartieAbstraiteClass } from "./partie-abstraite-class";

import { tick, fakeAsync } from '@angular/core/testing';

// class AbstractClassInstance extends PartieAbstraiteClass {
//   protected ajouterTemps(temps: number) {
//   }
// }
//
// describe('PartieAbstraiteComponent', () => {
//  let abstractClassInstance: AbstractClassInstance;
//
//  beforeEach(() => {
//    abstractClassInstance = new AbstractClassInstance();
//  });
//
//  it('should create', () => {
//    expect(abstractClassInstance).toBeTruthy();
//  });
//
//  it('partieCommence should be false and blur true', () => {
//    expect(abstractClassInstance["partieCommence"]).toBeFalsy();
//    expect(abstractClassInstance["blur"]).toBeTruthy();
//  });
//
//  it('should return value 0', fakeAsync(() => {
//    tick(1000);
//    expect(abstractClassInstance["chrono"].getTime()).toBe(0);
//  }));
//
//  it('should return value 2', fakeAsync(() => {
//     abstractClassInstance["start"]();
//     tick(2000);
//     abstractClassInstance["terminerPartie"]();
//     expect(abstractClassInstance["chrono"].getTime()).toBe(2);
//  }));
// });
