import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  imports: [],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private auth: Auth = inject(Auth);
  private provider = new GoogleAuthProvider();
  user$ = user(this.auth);

  login() {
    signInWithPopup(this.auth, this.provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential;
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
