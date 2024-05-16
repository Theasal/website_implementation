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

const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/daily_textile_waste/";

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

if (window.location.pathname.includes("design.html")) {
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
}

var links = document.querySelectorAll(".sidenav a");

console.log(links);

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(event);

    var href = this.getAttribute("href");
    document.getElementById("content-frame").src = href;
  });
});

var links = document.querySelectorAll(".sidenav a");

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    links.forEach(function (link) {
      link.classList.remove("highlighted");
    });

    this.classList.add("highlighted");

    var href = this.getAttribute("href");
    document.getElementById("content-frame").src = href;
  });
});

const baseURLPost =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";

const handleFormSubmit = (event) => {
  event.preventDefault();

  const form = document.getElementById("contributeForm");
  const formData = new FormData(form);
  const sizes = [];
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      sizes.push(checkbox.value);
    });
  const sizesString = sizes.join(",");

  formData.set("product_info1", sizesString);

  const requestOptionsPost = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  fetch(baseURLPost, requestOptionsPost)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

document
  .getElementById("contributeForm")
  .addEventListener("submit", handleFormSubmit);
