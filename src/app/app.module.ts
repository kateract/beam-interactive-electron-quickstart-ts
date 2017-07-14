import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";

import { ButtonDetailComponent } from './button-detail.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, ButtonDetailComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
