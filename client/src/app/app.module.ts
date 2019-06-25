import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {ReactiveFormsModule} from "@angular/forms";
import {StartComponent} from "./start/start.component";
import {HttpClientModule} from "@angular/common/http";
import {Ng4LoadingSpinnerModule} from "ng4-loading-spinner";
import {ToasterModule} from "angular2-toaster";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule, Routes} from "@angular/router";

import {AuthService} from "./services/core/azureAd/AuthService";
import {LoginComponent} from "./login/login.component";
import {HelloWorldService} from "./services/HelloWorldService";
import {HttpClientService} from "./services/core/azureAd/HttpClientService";

const appRoutes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "", component: StartComponent},
    {path: "**", component: StartComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        StartComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        Ng4LoadingSpinnerModule.forRoot(),
        ToasterModule.forRoot(),
        BrowserAnimationsModule,
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: false} // <-- debugging purposes only
        )
    ],
    providers: [AuthService, HelloWorldService, HttpClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
