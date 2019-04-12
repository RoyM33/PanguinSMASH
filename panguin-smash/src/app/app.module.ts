import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TileInterpreterComponent } from './tile-interpreter/tile-interpreter.component';
import { PenguinControllerDirective } from './directives/penguin-controller.directive';

@NgModule({
  declarations: [
    AppComponent,
    TileInterpreterComponent,
    PenguinControllerDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
