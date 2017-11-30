This is an email and password authentication system built with Ionic and Firebase.

## How to code

go into the **app.component.ts** file and add your firebase credentials to the configuration object

```js
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: ""
};
```


The Starter offers:

* Login Page.
* Reset Password Page.
* Signup Page.

All of those functional and connected with an authentication provider.

--Redirecting Authenticated Users--
## to create an authentication listener onAuthStateChanged()
----- open app.component.ts and remove the assignment from rootPage
------rootPage: any;
-----onAuthStateChanged(): it adds an observer for auth state changes, meaning that whenever an authentication change happens, it will trigger the observer and the function inside it will run again.
------inside app.component.ts constructor add
```js
const unsubscribe = firebase.auth().onAuthStateChanged( user => {
  if (!user) {
    this.rootPage = 'LoginPage';
    unsubscribe();
  } else { 
    this.rootPage = HomePage;
    unsubscribe();
  }
});
```
When you log in or signup using Firebase, it will store an auth object inside your localStorage.
onAuthStateChanged() function if a user already exists or not.
But if there’s a user, it will return the user’s information, at that point the listener is going to send the user to the HomePage, since the user shouldn’t need to re-login inside the app.

unsubscribe() 
because the onAuthStateChanged() returns the unsubscribe function for the observer -> call itself once it redirects the user -> stop listening to the authentication state unless you run it again (it runs every time someone opens the app).
it’s a good practice to unsubscribe in most of the cases, because if there’s a sudden change in the authentication state that function will trigger.

## Building the Auth Provider
use the AuthProvider to handle all the authentication related interactions between our app and Firebase.
----- ionic generate provider Auth
-- open the file providers/auth/auth.ts, delete the methods it has, patse the following:

``` js
import {Injectable} from '@angular/core';

@Injectable()
export class AuthData {
  constructor() {}
}
```
-- import Firebase

-- create 4 functions: 
* Login to an existing account.
* Create a new account.
* Send a password reset email.
* Logout from the app.

#### loginUser(): 
inside the function we’ll create the Firebase login
-- Firebase signInWithEmailAndPassword() 
-- use a valid email as a username
-- If the function goes through, the user will log in, Firebase will store the authentication object in localStorage and the function will return the user as a promise.

***Database and authentication aren’t “connected”, like that, creating a user doesn’t store its information inside the database, it stores it in the authentication module of our app, so we need to manually copy that information inside the database.

```
signupUser(email: string, password: string): Promise<any> {
  return firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .then( newUser => {
    firebase
    .database()
    .ref('/userProfile')
    .child(newUser.uid)
    .set({ email: email });
  });
}
```

-- using the createUserWithEmailAndPassword() 
-- (not always) after the user is created the app also logs the user in automatically without calling the login function again
-- returns a Promise that will run some code for us when it’s done creating the new user and login into the app
```
firebase
  .database()
  .ref('/userProfile')
  .child(newUser.uid)
  .set({ email: email });
```

--check database to see

**** Reset Password

```
resetPassword(email: string): Promise<void> {
  return firebase.auth().sendPasswordResetEmail(email);
}
```
-- using the sendPasswordResetEmail() it returns a void Promise
-- the promise is empty, so you basically use it to perform other actions once the password reset link is sent.
-- AWESOME HINT: Firebase will take care of the reset login, they send an email to your user with a password reset link, the user follows it and changes password 

## TYPESCRIPT TIME

** login.ts
-- add the imports
-- explaination: 
 * Loading and FormGroup: declare the types of the loading component’s variable and the form variable
 * FormBuilder, Validators: get form validation going on with angular
 * AuthProvider: authentication provider you created
 * EmailValidator: a custom validator, follows this format: crush@crush.crush
 
 ** email.ts
 
 ```
import { FormControl } from '@angular/forms';

export class EmailValidator {

  static isValid(control: FormControl){
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    .test(control.value);

    if (re){
      return null;
    }

    return {
      "invalidEmail": true
    };
  }
}
 ```
 -- how to validate your data with both Ionic Framework and Firebase
 --- STEP #1: do client-side validation in the Ionic Form.
 --- STEP #2: add an extra layer of safety with TypeScript’s type declaration.
 --- STEP #3: validate the data server-side with Firebase (check in Firebase Databse Rules)
 
 ** reset-password.ts
 ```
 resetPassword(){
  if (!this.resetPasswordForm.valid){
    console.log(this.resetPasswordForm.value);
  } else {
    this.authProvider.resetPassword(this.resetPasswordForm.value.email)
    .then((user) => {
      let alert = this.alertCtrl.create({
        message: "We sent you a reset link to your email",
        buttons: [
          {
            text: "Ok",
            role: 'cancel',
            handler: () => { this.navCtrl.pop(); }
          }
        ]
      });
      alert.present();

    }, (error) => {
      var errorMessage: string = error.message;
      let errorAlert = this.alertCtrl.create({
        message: errorMessage,
        buttons: [{ text: "Ok", role: 'cancel' }]
      });
      errorAlert.present();
    });
  }
}
 ```
 
-- Same as login, it takes the value of the form field, sends it to the AuthProvider service and displays a loading component while we get Firebase’s response

** signup.ts
exactly the same as the login page but changing the forms name
