import {Component} from "@angular/core";
import {FormGroup, FormControl} from "@angular/forms";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "Application";
    version = "0.0.0";
    loadingText = this.title + " is busy ...";
    control = {dummy: new FormControl()}; // FromGroup constructor requires at least one.  But we ignore it!
    form: FormGroup = new FormGroup(this.control);

    save() {
        console.log(`submitted`);
    }
}
