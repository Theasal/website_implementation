// Global Constants
const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";
const my_website_code = "theassa";

// Constant Functions
const toggleNav = (open) => {
  const sidenav = document.getElementById("sidenav");
  const main = document.querySelector(".main");
  const body = document.querySelector("body");
  const exitBtn = document.getElementById("exit-btn");
  const sidenavBtn = document.getElementById("sidenav-btn");

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

// Save sidenav state to localStorage
const saveSidenavState = () => {
  const dropdownStates = [];
  const dropdownActiveStates = [];
  const highlightedLinks = [];

  document.querySelectorAll(".dropdown-container").forEach((dropdown) => {
    dropdownStates.push(dropdown.style.display === "block");
  });

  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    dropdownActiveStates.push(btn.classList.contains("active"));
  });

  document.querySelectorAll("#sidenav a").forEach((link) => {
    highlightedLinks.push(link.classList.contains("highlighted"));
  });

  localStorage.setItem("dropdownStates", JSON.stringify(dropdownStates));
  localStorage.setItem(
    "dropdownActiveStates",
    JSON.stringify(dropdownActiveStates)
  );
  localStorage.setItem("highlightedLinks", JSON.stringify(highlightedLinks));
};

// Load sidenav state from localStorage
const loadSidenavState = () => {
  const dropdownStates = JSON.parse(
    localStorage.getItem("dropdownStates") || "[]"
  );
  const dropdownActiveStates = JSON.parse(
    localStorage.getItem("dropdownActiveStates") || "[]"
  );
  const highlightedLinks = JSON.parse(
    localStorage.getItem("highlightedLinks") || "[]"
  );

  document
    .querySelectorAll(".dropdown-container")
    .forEach((dropdown, index) => {
      if (dropdownStates[index]) {
        dropdown.style.display = "block";
        const caret =
          dropdown.previousElementSibling.querySelector(".fa-caret-down");
        if (caret) caret.classList.add("rotate");
      } else {
        dropdown.style.display = "none";
      }
    });

  document.querySelectorAll(".dropdown-btn").forEach((btn, index) => {
    if (dropdownActiveStates[index]) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll("#sidenav a").forEach((link, index) => {
    if (highlightedLinks[index]) {
      link.classList.add("highlighted");
    } else {
      link.classList.remove("highlighted");
    }
  });
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
  // Function to load HTML content from a file into a specified element
  function loadHTML(elementId, filePath, callback) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load ${filePath}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        if (callback) callback();
      })
      .catch((error) => console.error("Error loading HTML:", error));
  }

  // Load the header and sidenav into their respective placeholders
  loadHTML("header-placeholder", "header.html", () => {
    document.getElementById("logo").addEventListener("click", function () {
      // Remove highlighted class from all links
      document
        .querySelectorAll("#sidenav a")
        .forEach((link) => link.classList.remove("highlighted"));
      document
        .querySelectorAll(".dropdown-btn")
        .forEach((btn) => btn.classList.remove("activated"));
      // Save the sidenav state after clearing highlighted links
      saveSidenavState();
    });
  });
  loadHTML("sidenav-placeholder", "sidenav.html", () => {
    // Now that sidenav is loaded, add event listeners
    const sidenavBtn = document.getElementById("sidenav-btn");
    const exitBtn = document.getElementById("exit-btn");
    if (sidenavBtn) {
      sidenavBtn.addEventListener("click", () => toggleNav(true));
    }
    if (exitBtn) {
      exitBtn.addEventListener("click", () => toggleNav(false));
    }

    const fileInput = document.getElementById("product_photo");
    const fileLabel = document.getElementById("file_label");
    if (fileInput && fileLabel) {
      fileInput.addEventListener("change", handleFileChange);
    }

    const dropdownBtns = document.querySelectorAll(".dropdown-btn");

    dropdownBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");

        const dropdownContent = this.nextElementSibling;
        dropdownContent.style.display =
          dropdownContent.style.display === "block" ? "none" : "block";
        this.querySelector(".fa-caret-down").classList.toggle("rotate");
        saveSidenavState(); // Save state when dropdown is toggled
      });
    });

    const links = document.querySelectorAll("#sidenav a");
    links.forEach((link) => {
      link.addEventListener("click", function (event) {
        // Remove highlighted class from all links
        links.forEach((link) => link.classList.remove("highlighted"));
        // Add highlighted class to the clicked link
        this.classList.add("highlighted");
        saveSidenavState(); // Save state when a link is clicked
      });
    });

    // Load the sidenav state on page load
    loadSidenavState();
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

  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      handleFormSubmit();
    });
  }
});
