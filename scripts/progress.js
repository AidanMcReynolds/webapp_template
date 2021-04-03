//updates the progress bar when authentication in complete
firebase.auth().onAuthStateChanged(function (user) {
    progressUpdate(user);
});

//  Need all of the tasks data from the user - user collection -> task collection (reading database)
function progressUpdate(user) {
    db.collection("users").doc(user.uid).collection("tasks").where("deleted", "==", false).get().then((tasks) => {
        progressDisplay(progressPercent(tasks));
        console.log(tasks)
        console.log(progressPercent(tasks));
    });
}

//returns sum of all times all tasks completed divided by the total number of times tasks could have been completed
function progressPercent(tasks) {
    let days = 0;
    let n = 0;
    tasks.forEach((t) => {
        days = days + progressDays(t);
        n = n + t.data().completed.length;
    });
    return n/days;
}

//returns number of days since the task was completed
function progressDays(task) {
    var d = firebase.firestore.Timestamp.now()
    var c = task.data().created;
    var n = d.seconds - c.seconds;
    n = n / (60 * 60 * 24);
    n = Math.floor(n)
    n = n + 1;
    return n;
}

//updates the progress bar
function progressDisplay(variable) {
    let x = document.getElementById("progress1");
    x.style.width = " " + (variable * 100) + "%";
}