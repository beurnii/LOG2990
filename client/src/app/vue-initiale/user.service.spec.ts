import { TestBed, inject } from "@angular/core/testing";

import { UserService } from "../vue-initiale/user.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("UserService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
  });

  it("should be created", inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
