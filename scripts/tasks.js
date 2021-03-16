firebase.auth().onAuthStateChanged(function (user) {
  db.collection("users").doc(user.uid).collection("tasks").where("deleted", "!=", true).get().then((tasks) => {
    taskTable(tasks);
  });
});
function taskTable(tasks){
  // update the size of the container for the task list
  cont = document.getElementById("task-container");
  cont.innerHTML = "";
  let rows = ""
  for(i=0;i<=tasks.size;i++){
    rows = rows + "40pt "
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
}
function taskRow(taskName){
  let r = "";
  r = '<div class="task-check"><input class="form-check-input me-1" type="checkbox" value="" aria-label="..."></div>';
  r = r + '<div class="task-text">' + taskName + '</div>';
  r = r + '<div class="task-del"><button type="button" class="btn btn-outline-danger btn-sm"><i data-feather="trash-2"></i></button></div>'
  return r;
}
function taskAdd(){
  return '<div class="task-add"><button type="button" class="btn btn-outline-primary btn-sm"><i data-feather="plus"></i></button></div>'
}
