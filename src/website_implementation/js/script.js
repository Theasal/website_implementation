var dropdownBtns = document.querySelectorAll(".dropdown-btn");

dropdownBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
    // Toggle the class for rotating the caret icon
    this.querySelector(".fa-caret-down").classList.toggle("rotate");
  });
});

window.addEventListener("DOMContentLoaded", function () {
  fetch("home.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(".main").innerHTML = data;
    });
});
