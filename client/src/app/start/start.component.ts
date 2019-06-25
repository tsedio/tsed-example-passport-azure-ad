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
    authButton = new FormControl("");
    form = new FormGroup({
        textInput: this.textInput,
        output: this.output,
        authButton: this.authButton
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

    async save() {
        const hello = await this.helloWorldService.helloWorld();
        console.log(`save - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello));
    }

    async authCall(event) {
        const hello = await this.helloWorldService.helloWorld();
        console.log(`helloAuth - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello));
        // event.stopPropagation()
    }
}
