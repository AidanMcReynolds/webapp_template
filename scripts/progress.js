//updates the progress bar when authentication in complete
firebase.auth().onAuthStateChanged(function (user) {
    progressUpdate(user);
});

//  Need all of the tasks data from the user - user collection -> task collection (reading database)
function progressUpdate(user) {
    db.collection("users").doc(user.uid).collection("tasks").where("deleted", "==", false).get().then((tasks) => {
        progressDisplay(progressPercent(tasks), "progress1");
        console.log(tasks)
        console.log(progressPercent(tasks));

        progressDisplay(progressPercentWeek(tasks), "progress2");
        console.log(tasks)
        console.log(progressPercentWeek(tasks));
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

//returns number of days since the task was created
function progressDays(task) {
    var d = firebase.firestore.Timestamp.now()
    var c = task.data().created;
    var n = d.seconds - c.seconds;
    n = n / (60 * 60 * 24);
    n = Math.floor(n)
    n = n + 1;
    return n;
}

<<<<<<< HEAD
//updates the progress bar
function progressDisplay(variable , eleID) {
    let x = document.getElementById(eleID);
=======
//updates the progress
function progressDisplay(variable) {
    let x = document.getElementById("progress1");
>>>>>>> a5d9b2ca9ee0e4e9c0fff011c0d4ea1f7cef6a38
    x.style.width = " " + (variable * 100) + "%";
}

//returns sum of all times all tasks within last week (7 days) completed divided by the total number of times tasks could have been completed
function progressPercentWeek(task){
    let days = 0;
    let n = 0;
    task.forEach((t) => {
        let m = 0;
        t.data().completed.forEach((s) => {
            if(s > firebase.firestore.Timestamp.now()-(60*60*24*7)){
                m++;
            }
        });
        let x = progressDays(t);
        if(x > 7){
            days = days + 7;
        }else{
            days = days + x;
        }
        n = n + m;
    });
    return n/days;
}