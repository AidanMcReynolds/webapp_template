// Progress
// Page loads to the progress page
//  Need the user-id
// The event in js - user has logged in 
//  Need all of the tasks data from the user - user collection -> task collection
// Need to convert data from list of tasks into %
//  Display % in progress bar onto page
//  (last step) - progress bars show user progress


// .orderBy('created')
//  Need the user-id // The event in js - user has logged in 
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

function progressPercent(tasks) {
    progressTaskPercent(tasks.docs[0])
    console.log(progressTaskPercent(tasks.docs[0]))

    let g = 1;
    tasks.forEach((t) => {
        g = progressTaskPercent(t) * g;
    });
    g = Math.pow(g, 1 / tasks.size)
    return g;
}

//Adding total # of days completed / today - date created = total # of days since it has been created
function progressTaskPercent(task) {
    let t = task.data().completed.length;

    var d = firebase.firestore.Timestamp.now()
    var c = task.data().created;
    var n = d.seconds - c.seconds;
    n = n / (60 * 60 * 24);
    n = Math.floor(n)

    n = n + 1;
    console.log(t / n);
    return t / n;
}

function progressDisplay(variable) {
    let x = document.getElementById("progress1");
    x.style.width = " " + (variable * 100) + "%";
}