import { Component } from '@angular/core';
import { TunerComponent } from "./tuner/tuner.component";

@Component({
  selector: 'app-root',
  imports: [TunerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'guitar-tuner-app';
}
