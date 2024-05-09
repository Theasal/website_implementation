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
    this.querySelector(".fa-caret-down").classList.toggle("rotate");
  });
});

console.log(dropdownBtns);

const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/daily_textile_waste/";

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch(baseURL, requestOptions)
  .then((response) => response.json())
  .then((data) => showFactBox(data));

showFactBox = (facts) => {
  const factboxDiv = document.querySelector(".factbox ul");
  const textileWasteElement = document.createElement("li");
  textileWasteElement.innerHTML = `Textile waste in Australia: ${Math.round(
    facts.textile_waste_australia_now
  )} kg`;
  factboxDiv.appendChild(textileWasteElement);
  const slaveHoursElement = document.createElement("li");
  slaveHoursElement.innerHTML = `Slave hours worked: ${Math.round(
    facts.slave_hours_worked
  )}`;
  factboxDiv.appendChild(slaveHoursElement);
  const childHoursElement = document.createElement("li");
  childHoursElement.innerHTML = `Children hours worked: ${Math.round(
    facts.children_hours_worked
  )}`;
  factboxDiv.appendChild(childHoursElement);
  const profitElement = document.createElement("li");
  profitElement.innerHTML = `Profit: ${Math.round(facts.profit_ytd)}`;
  factboxDiv.appendChild(profitElement);
};
