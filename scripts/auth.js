//if the user is not logged in redirect them to the homepage
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("hello " + user.email);
    sayHello();
    logOutUser();
  } else {
    window.location.pathname = "/index.html";
  }
});

//logout User
function logOutUser() {
  const logout = document.querySelector("#logOut");

  logout.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut().then(() => {
      // console.log("Sign-Out Successful!");
    }).catch((error) => {
      console.log("An error happened.\n" + error.message);
    });
  });
}

//display username on page
function sayHello() {
  firebase.auth().onAuthStateChanged(function (somebody) {
    if (somebody) {
      //console.log(somebody.uid);
      db.collection("users")
        .doc(somebody.uid)
        .get() //READ !!!
        .then(function (doc) {
          //console.log(doc.data().name);
          var n = doc.data().name;
          $("#name-goes-here").text(n);
          // get other things and do other things for this person
        })
    }
  })
}
