import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CarConfigMainComponent} from './core/view/car-config-main/car-config-main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CarConfigMainComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('carconfig-app');
}
