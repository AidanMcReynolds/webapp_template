//popover enabled
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});

//preview replace image
function previewFile() {
  var fileImg = document.getElementById("previewImag");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    fileImg.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}