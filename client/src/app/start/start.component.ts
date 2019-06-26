import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {ToasterService} from "angular2-toaster";

import {AuthService} from "../services/core/azureAd/AuthService";
import {HelloWorldService} from "../services/HelloWorldService";

@Component({
    selector: "app-start",
    templateUrl: "./start.component.html",
    styleUrls: ["./start.component.scss"]
})
export class StartComponent implements OnInit {

    textInput = new FormControl("");
    output = new FormControl("");
    authButtonWithScopes = new FormControl("");
    authButtonNoScopes = new FormControl("");
    noAuthButton = new FormControl("");
    form = new FormGroup({
        textInput: this.textInput,
        output: this.output,
        authButtonWithScopes: this.authButtonWithScopes,
        authButtonNoScopes: this.authButtonNoScopes,
        noAuthButton: this.noAuthButton
    });

    constructor(private http: HttpClient, protected spinnerService: Ng4LoadingSpinnerService, private toast: ToasterService,
                private authService: AuthService, private helloWorldService: HelloWorldService) {
    }

    async ngOnInit() {
        // this.authButton. registerOnChange((change) => {
        //     console.log(`auth button pressed`);
        //     this.authCall();
        // });
        await this.signin();
    }

    async signin() {
        // Sign in to Azure
        await this.authService.signIn();
    }

    async authCall(event) {
        const hello = await this.helloWorldService.helloAuthWorld();
        console.log(`helloNoAuth - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello));
        // event.stopPropagation()
    }

    async authCallNoScope(event) {
        const hello = await this.helloWorldService.helloAuthWorldNoScope();
        console.log(`helloNoAuth - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello));
        // event.stopPropagation()
    }

    async noAuthCall() {
        const hello = await this.helloWorldService.helloNoAuthWorld();
        console.log(`helloAuth - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello));
    }
}
