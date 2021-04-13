//if the user is not logged in redirect them to the homepage
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
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
    }).catch((error) => {
      alert(error.nessage);
    });
  });
}

//display username on page
function sayHello() {
  firebase.auth().onAuthStateChanged(function (somebody) {
    if (somebody) {
      db.collection("users")
        .doc(somebody.uid)
        .get() //READ !!!
        .then(function (doc) {
          var n = doc.data().name;
          $("#name-goes-here").text(n);
          // get other things and do other things for this person
        })
    }
  })
}
