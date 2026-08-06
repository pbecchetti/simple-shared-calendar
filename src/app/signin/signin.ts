import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  imports: [],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private provider = new GoogleAuthProvider();

  currentUser = toSignal(user(this.auth), { initialValue: undefined });
  loginError = '';

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        void this.router.navigateByUrl('/');
      }
    });
  }

  login() {
    this.loginError = '';
    signInWithPopup(this.auth, this.provider).catch((error: unknown) => {
      console.error('sign in error', error);
      this.loginError = 'Erreur de connexion, réessaie.';
    });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('signed out');
      })
      .catch((error) => {
        console.log('sign out error: ' + error);
      });
  }
}
