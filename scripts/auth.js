var user;
firebase.auth().onAuthStateChanged(function (u) {
  user = u;
  if (user) {
    console.log("hello " + user.email)
  } else {
    window.location.pathname = "/index.html"
  }
  db.collection("users").doc(user.uid).get().then(function(ut) {
    if (ut.exists) {
      console.log("hello " + ut.data().name);
    }
  
  });
  
})
