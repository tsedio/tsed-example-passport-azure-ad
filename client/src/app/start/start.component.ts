import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {ToasterService} from "angular2-toaster";

import {AuthService} from "../services/AuthService";
import {HelloWorldService} from "../services/HelloWorldService";

@Component({
    selector: "app-start",
    templateUrl: "./start.component.html",
    styleUrls: ["./start.component.scss"]
})
export class StartComponent implements OnInit {

    textInput = new FormControl("");
    output = new FormControl("")
    form = new FormGroup({
        textInput: this.textInput,
        output: this.output
    });

    constructor(private http: HttpClient, protected spinnerService: Ng4LoadingSpinnerService, private toast: ToasterService,
                private authService: AuthService, private helloWorldService: HelloWorldService) {
    }

    async ngOnInit() {
        await this.signin();
    }

    async signin() {
        // Sign in to Azure
        await this.authService.signIn();
    }

    async save() {
        const hello = await this.helloWorldService.helloWorld();
        console.log(`save - from server: ${hello}`);
        this.output.setValue(JSON.stringify(hello))
    }
}
