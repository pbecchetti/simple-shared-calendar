import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  imports: [AsyncPipe],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private provider = new GoogleAuthProvider();
  user$ = user(this.auth);

  login() {
    signInWithPopup(this.auth, this.provider).then(() => {
      void this.router.navigateByUrl('/');
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
