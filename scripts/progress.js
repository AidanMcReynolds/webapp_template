//updates the progress bar when authentication in complete
firebase.auth().onAuthStateChanged(function (user) {
    progressUpdate(user);
});

//  Need all of the tasks data from the user - user collection -> task collection (reading database)
function progressUpdate(user) {
    db.collection("users").doc(user.uid).collection("tasks").where("deleted", "==", false).get().then((tasks) => {

        progressDisplayHtml();
        progressDisplay(progressPercent(tasks), "progress1");
        // console.log(tasks);
        // console.log(progressPercent(tasks));

        //Number of days
        let weekly = 7;
        let daily = 1;
        progressDisplay(progressPercentage(tasks, weekly), "progress2");
        // console.log(tasks, weekly);
        // console.log(progressPercentage(tasks, weekly));

        progressDisplay(progressPercentage(tasks, daily), "progress3");
        // console.log(tasks, daily);
        // console.log(progressPercentage(tasks, daily));
    });
}

//html code representing a progress bar
function progressDisplayHtml() {
    let subTitle = ["All-Time", "Weekly", "Daily"];
    cont = document.getElementById("prog-container");
    cont.innerHTML = "";

    cont.innerHTML = cont.innerHTML + "<div class='title'><h1 class='display-1'>Track Your Progress</h1></div><br/>";

    for (let i = 0; i < 3; i++) {
        cont.innerHTML = cont.innerHTML + progressDisplayHtmlRow(subTitle[i], i + 1);
    }

    function progressDisplayHtmlRow(subtitle, num) {
        let r = '<br/><br/><br/><div class="title"><h1 class="display-4">' + subtitle + '</h1></div><div class="progress" style="height: 20px;">';
        r = r + '<div id="progress' + num + '" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
        return r;
    }
}

//returns sum of all times all tasks completed divided by the total number of times tasks could have been completed
function progressPercent(tasks) {
    let days = 0;
    let n = 0;
    tasks.forEach((t) => {
        days = days + progressDays(t);
        n = n + t.data().completed.length;
    });
    return n / days;
}

//returns number of days since the task was created
function progressDays(task) {
    var d = firebase.firestore.Timestamp.now();
    var c = task.data().created;
    var n = d.seconds - c.seconds;
    n = n / (60 * 60 * 24);
    n = Math.floor(n);
    n = n + 1;
    return n;
}

//updates the progress bar
function progressDisplay(variable, eleID) {
    let x = document.getElementById(eleID);
    x.style.width = " " + (variable * 100) + "%";
}

//returns sum of all times all tasks within last week (7 days) completed divided by the total number of times tasks could have been completed
function progressPercentage(task, dayNumber) {
    let days = 0;
    let n = 0;
    task.forEach((t) => {
        let m = 0;
        t.data().completed.forEach((s) => {
            if (s > firebase.firestore.Timestamp.now() - (60 * 60 * 24 * dayNumber)) {
                m++;
            }
        });
        let x = progressDays(t);
        days = x > dayNumber ? days + dayNumber : days + x;
        n = n + m;
    });
    return n / days;
}
