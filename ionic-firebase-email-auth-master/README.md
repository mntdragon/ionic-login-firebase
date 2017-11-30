This is an email and password authentication system built with Ionic and Firebase.

## How to use this template

Using your terminal navigate to the application folder (_it's right here where you're reading this file_), and install all the dependencies from npm.

```bash
$ cd firebase-email-auth/
$ npm install
```

Right there your app is ready to work, all you need to do this is go into the **app.component.ts** file and add your firebase credentials to the configuration object

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
-----to create an authentication listener onAuthStateChanged()
----- open app.component.ts and remove the assignment from rootPage
------rootPage: any;
-----onAuthStateChanged(): it adds an observer for auth state changes, meaning that whenever an authentication change happens, it will trigger the observer and the function inside it will run again.
------inside app.component.ts constructor add
const unsubscribe = firebase.auth().onAuthStateChanged( user => {
  if (!user) {
    this.rootPage = 'LoginPage';
    unsubscribe();
  } else { 
    this.rootPage = HomePage;
    unsubscribe();
  }
});



