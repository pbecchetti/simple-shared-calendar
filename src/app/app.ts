import { Component, signal } from '@angular/core';

import { HomeComponent } from './app/home/components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('simple-shared-calendar');
}
