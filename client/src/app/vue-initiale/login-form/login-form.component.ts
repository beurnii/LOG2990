import { Component, OnInit, ErrorHandler } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../login-form/user";
import { UserService } from "../user.service";
import { myParams, myStyle } from "../../../assets/particles";
import { CookieService } from "ngx-cookie-service";

export const USER_URL: string = "http://localhost:3000/users/";
const PARTICULES_WIDTH: number = 100;
const PARTICULES_HEIGHT: number = 100;
const MAX_LENGTH_USERNAME: number = 12;
const MIN_LENGTH_USERNAME: number = 3;

@Component({
    selector: "app-login-form",
    providers: [UserService],
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.css"]
})

export class LoginFormComponent implements OnInit {

    protected loginForm: FormGroup;
    protected usernameTaken: Boolean;
    protected username: string;

    // Paramètres de particles background
    public myStyle: object = {};
    public myParams: object = {};
    public width: number = PARTICULES_WIDTH;
    public height: number = PARTICULES_HEIGHT;

    public constructor(private router: Router,
                       private userService: UserService,
                       private cookieService: CookieService) {
        this.loginForm = this.creerFormulaire();
    }

    public ngOnInit(): void {
        this.myStyle = myStyle;
        this.myParams = myParams;

        if (this.cookieService.check("username")) {
            this.router.navigate(["/liste-parties"])
            .catch(() => ErrorHandler);
        }
    }

    protected surLogin(): void {
        const username: string = this.loginForm.value.username;
        const result: User = new User(username);
        this.userService.creerUsager(result)
            .subscribe(
                (data) => {
                    this.usernameTaken = false;
                    this.creerCookie(username);
                    this.router.navigate(["/liste-parties"])
                    .catch(() => ErrorHandler);
                },
                (error) => {
                    this.usernameTaken = true;
                });
    }

    private creerFormulaire(): FormGroup {
        return new FormGroup({
            username: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z0-9]+$"),
                Validators.maxLength(MAX_LENGTH_USERNAME),
                Validators.minLength(MIN_LENGTH_USERNAME)
            ])
        });
    }

    private creerCookie(username: string): void {
        this.cookieService.set("username", username);
    }
}
