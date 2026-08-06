import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Auth, signOut, user } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('simple-shared-calendar');

  private auth = inject(Auth);
  currentUser = toSignal(user(this.auth), { initialValue: undefined });

  logout() {
    signOut(this.auth).catch((error: unknown) => console.error('sign out error', error));
  }
}
