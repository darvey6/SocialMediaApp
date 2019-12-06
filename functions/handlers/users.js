const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const { validateSignupData, validateLoginData } = require('../util/validators');


//signup route
exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle
    };

    //destructuring
    const {valid, errors} = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    //gives default image after sign up 
    const noImg = 'no-img.png';

   //validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return res.status(400).json({ handle: 'this handle is already taken' });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
          userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already is use' });
        } else {
          return res.status(500).json({ error: err.code });
        }
      });
  }


  //login route
  exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    //destructuring
    const {valid, errors} = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);


    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user.getIdToken();
      })
      .then((token) => {
        return res.json({ token });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/wrong-password') {
          return res
            .status(403)
            .json({ general: 'Wrong credentials, please try again' });
        } else return res.status(500).json({ error: err.code });
      });
    };

    exports.uploadImage = (req, res) => {

      //remember to npm install --save busboy in functions folder
      const BusBoy = require('busboy');

      //import default projects
      const path = require('path');
      const os = require('os');
      const fs = require('fs');

      //instantiate new instance of busboy
      const busboy = new BusBoy({ headers: req.headers });
      

      let imageFileName;
      let imageToBeUploaded = {};

      //file events
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);
        // my.image.png (png is the extension) - need to get the png
        // access last item of the array [filename.split('.').length - 1]
        const imageExtension = filename.split('.')[filename.split('.').length - 1];

        // example 213423984293.png
        const imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;

        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        
        file.pipe(fs.createWriteStream(filepath));
      });
      busboy.on('finish', () => {
        //can read firebase admin SDK documentation
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        })
        .then(() => {
          //adding alt=media it shows image on browser
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
      });
      busboy.end(req.rawBody);
    };