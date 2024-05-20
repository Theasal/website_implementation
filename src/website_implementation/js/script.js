// Global Constants
const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";
const my_website_code = "theassa";
const sidenavBtn = document.querySelector(".sidenav-btn");
const exitBtn = document.querySelector(".exit-btn");
const sidenav = document.getElementById("sidenav");
const main = document.querySelector(".main");
const body = document.querySelector("body");
const fileInput = document.getElementById("product_photo");
const fileLabel = document.getElementById("file_label");

// Constant Functions
const toggleNav = (open) => {
  if (open) {
    sidenav.classList.add("open");
    main.classList.add("hidden");
    body.classList.add("sidenav");
    exitBtn.classList.remove("hidden");
    sidenavBtn.classList.add("hidden");
  } else {
    sidenav.classList.remove("open");
    main.classList.remove("hidden");
    body.classList.remove("sidenav");
    exitBtn.classList.add("hidden");
    sidenavBtn.classList.remove("hidden");
  }
};

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
  formData.set("website_code", my_website_code);

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  fetch(baseURL, requestOptions)
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

const handleFileChange = () => {
  const fileInput = document.getElementById("product_photo");
  const fileLabel = document.getElementById("file_label");
  let fileName = fileInput.files[0].name;
  if (fileName.length > 20) {
    fileName = fileName.substring(0, 18) + "...";
  }
  fileLabel.innerHTML = `${fileName}`;
};

function renderProduct(product) {
  const productFlexContainerTop = document.querySelector(
    ".product-flex-container-top"
  );

  const productFlexContainerBottom = document.querySelector(
    ".product-flex-container-bottom"
  );
  const productFlexContainerAccessories = document.querySelector(
    ".product-flex-container-accessories"
  );

  const productBox = document.createElement("div");
  productBox.classList.add("product-box");

  const img = document.createElement("img");
  img.src = product.product_photo;
  img.alt = product.product_name;
  img.classList.add("product-picture");
  productBox.appendChild(img);

  const productName = document.createElement("p");
  productName.textContent = product.product_name;
  productBox.appendChild(productName);

  const productOwner = document.createElement("p");
  productOwner.textContent = product.product_owner;
  productBox.appendChild(productOwner);

  const productPrice = document.createElement("p");
  productPrice.textContent = `$${product.product_info2}`;
  productBox.appendChild(productPrice);

  if (product.product_name === "Sweater" || product.product_name === "Top") {
    if (productFlexContainerTop) {
      productFlexContainerTop.appendChild(productBox);
    }
  } else if (
    product.product_name === "Skirt" ||
    product.product_name === "Pant" ||
    product.product_name === "Jeans"
  ) {
    if (productFlexContainerBottom) {
      productFlexContainerBottom.appendChild(productBox);
    }
  } else {
    if (productFlexContainerAccessories) {
      productFlexContainerAccessories.appendChild(productBox);
    }
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  if (sidenavBtn) {
    // Event listener for sidenav button
    sidenavBtn.addEventListener("click", () => toggleNav(true));
  }

  if (exitBtn) {
    // Event listener for exit button
    exitBtn.addEventListener("click", () => toggleNav(false));
  }

  if (fileInput && fileLabel) {
    fileInput.addEventListener("change", handleFileChange);
  }

  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

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

  var links = document.querySelectorAll("#sidenav a");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var href = this.getAttribute("href");
      document.getElementById("content-frame").src = href;
      if (window.innerWidth < 769) {
        toggleNav(false);
      }
    });
  });

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

  const queryParams = {
    website_code: my_website_code,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const urlWithParams = baseURL + "?" + queryString;
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  fetch(urlWithParams, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        if (
          window.location.pathname.includes("ggc") &&
          product.product_owner === "GreenGarb Collective"
        ) {
          renderProduct(product);
        } else if (
          window.location.pathname.includes("ect") &&
          product.product_owner === "EcoChic Threads"
        ) {
          renderProduct(product);
        } else if (
          window.location.pathname.includes("eea") &&
          product.product_owner === "EarthlyElegance Apparel"
        ) {
          renderProduct(product);
        } else if (window.location.pathname.endsWith("products.html")) {
          renderProduct(product);
        }
      });
    });
});
