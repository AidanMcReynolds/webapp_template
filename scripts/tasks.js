firebase.auth().onAuthStateChanged(function (user) {
  db.collection("users").doc(user.uid).collection("tasks").where("deleted", "!=", true).get().then((tasks) => {
    console.log(tasks.size);
    tasks.forEach((t) => {
      console.log(t.data().name);
    });
    // update the size of the container for the task list
    cont = document.getElementById("task-container");
    let rows = ""
    for(i=0;i<=tasks.size;i++){
      rows = rows + "15vh "
    }
    cont.style.gridTemplateRows = rows;
    //append the table with the user's tasks
    tasks.forEach((t) =>{
      cont.innerHTML = cont.innerHTML + taskRow(t.data().name);
    });
    //append the table with the add task button
    cont.innerHTML = cont.innerHTML + taskAdd();
    feather.replace()
    cont.style.visibility = "visible";
  });
});
function taskRow(taskName){
  let r = "";
  r = '<div class="task-check"><input class="form-check-input me-1" type="checkbox" value="" aria-label="..."></div>';
  r = r + '<div class="task-text">' + taskName + '</div>';
  r = r + '<div class="task-del"><button type="button" class="btn btn-outline-danger btn-sm"><i data-feather="trash-2"></i></button></div>'
  return r;
}
function taskAdd(){
  return '<div class="task-add"><button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModalTask"><i data-feather="plus"></i></button></div>'
}
