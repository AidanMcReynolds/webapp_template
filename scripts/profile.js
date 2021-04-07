firebase.auth().onAuthStateChanged((user) => {
  updateProfilePage(user);
});

//load profile page
function updateProfilePage(user) {
  console.log(user.photoURL);
  
  document.getElementById("file-input").setAttribute("onchange", "previewFile()");
  //check if profile pic is set & stored at Firebase Storage
  db.collection("users").doc(user.uid).get().then((t) => {
    if(t.data().profilePic !== null){
      console.log("Document data:", t.data().profilePic);
      document.getElementById("previewImag").setAttribute("src", t.data().profilePic);
    } else {
      console.log("No such document!\n"+ e.message);
      // document.getElementById("previewImag").setAttribute("src", "./images/profile_random.jpeg");
    }
  });
 
  // user.photoUrl = "./images/profile_random.jpeg";
  // document.getElementById("previewImag").innerHTML = user.photoUrl;
  //set user displayName & Email attributes
  setInputValue("displayNameText", "<h5>" + user.displayName + "</h5>");
  setInputValue("emailText", "<h5>" + user.email + "</h5>");

  document.getElementById("modalInputName").setAttribute("value", user.displayName);
  document.getElementById("modalInputEmail").setAttribute("value", user.email);

  //listeners
  document.getElementById("exampleModalName").addEventListener("submit", submitDisplayNameDB);
  document.getElementById("exampleModalEmail").addEventListener("submit", submitEmailDB);
  document.getElementById("exampleModalPassword").addEventListener("submit", submitPasswordDB);
  feather.replace();
}

//set html of an element
function setInputValue(name, content) {
  document.getElementById(name).innerHTML = content;
}

//get value of an element
function getInputValue(id) {
  return document.getElementById(id).value;
}

//popover enabled
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map((popoverTriggerEl) => {
  return new bootstrap.Popover(popoverTriggerEl);
});

//preview replace image
function previewFile() {
  var fileImg = document.getElementById("previewImag");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener("load", () => {
    fileImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    saveProfilePic(file);
  }
}

//save profile pic to firebase storage
function saveProfilePic(file) {
  user = firebase.auth().currentUser;
  var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg"); // Get reference
  storageRef.put(file).then(function () {
    console.log('Uploaded to Cloud Storage.');
    
    //save url of firebase storage to firebase
    storageRef.getDownloadURL()
    .then(function (url) { // Get URL of the uploaded file
      console.log(url); // Save the URL into users collection
      db.collection("users").doc(user.uid).update({
        "profilePic": url
      }).then(() => {
        // Upload picked file to cloud storage
        console.log('Added Profile Pic URL to Firestore.');
      })
    })
  }); 
}

//reAuthentication
function reAuthenticate(currentPassword) {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(cred);
}

//change password
function submitPasswordDB(e) {
  e.preventDefault();

  var currPassword = getInputValue("modalInputCurrPassword");
  //reAuthenticate user prior to change password
  reAuthenticate(currPassword).then(() => {
    var user = firebase.auth().currentUser;
    var newPassword = getInputValue("modalInputPassword");
    var confirmPassword = getInputValue("modalInputPasswordConfirm");

    if (newPassword !== confirmPassword) {
      alert("New password and confirm new password not same");
    } else {
      //change pw
      user.updatePassword(newPassword).then(() => {
        alert("Password was changed");
      }).catch((error) => {
        alert(error.message);
      });
    }
  }).catch((e) => {
    alert(e.message);
  });
  $('#exampleModalPassword').modal('hide');
}

//show changed display name
function submitDisplayNameDB(e) {
  e.preventDefault();

  var newDisplayName = getInputValue("modalInputName");
  changeDisplayName(newDisplayName);
  setInputValue("displayNameText", "<h5>" + newDisplayName + "</h5>");
}

//change display name
function changeDisplayName(name) {
  var user = firebase.auth().currentUser;

  console.log(db.collection("users").doc(user.uid));
  user.updateProfile({
    displayName: name
  }).then(() => {
    db.collection("users").doc(user.uid).update({
      name: user.displayName
    });
  }).then(() => {
    console.log(name);
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalName').modal('hide');
}

//change user email
function submitEmailDB(e) {
  e.preventDefault();

  var newEmail = getInputValue("modalInputEmail");

  var currPassword = getInputValue("modalInputCurrPasswordE");
  //reAuthenticate
  reAuthenticate(currPassword).then(() => {
    changeEmail(newEmail);
  }).catch((e) => {
    alert(e.message);
  });
  setInputValue("emailText", "<h5>" + newEmail + "</h5>");
}

//change email in firebase
function changeEmail(name) {
  var user = firebase.auth().currentUser;

  user.updateEmail(name).then(() => {
    // Update successful.
    console.log(name);
    db.collection("users").doc(user.uid).update({         //write to firestore                 //"users" collection
      email: user.email                          //with authenticated user's ID (user.uid)
    })
  }).then(() => {
    alert("Email was changed");
    console.log("changed user email in DB");
  }).catch(error => {
    alert(error.message);
  });
  $('#exampleModalEmail').modal('hide');
}

