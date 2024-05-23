// Constants
const baseURL =
  "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";
const my_website_code = "theassa";

// Toggle side navigation
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

  // Save which dropdown is open
  document.querySelectorAll(".dropdown-container").forEach((dropdown) => {
    dropdownStates.push(dropdown.style.display === "block");
  });

  // Save which dropdown buttons is active
  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    dropdownActiveStates.push(btn.classList.contains("active"));
  });

  // Save which dropdown link is clicked
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

  // Set the right state on the dropdown containers
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

  // Set the right state on the dropdown buttons
  document.querySelectorAll(".dropdown-btn").forEach((btn, index) => {
    if (dropdownActiveStates[index]) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Set the right state on the dropdown links
  document.querySelectorAll("#sidenav a").forEach((link, index) => {
    if (highlightedLinks[index]) {
      link.classList.add("highlighted");
    } else {
      link.classList.remove("highlighted");
    }
  });
};

// Handle form submission
const handleFormSubmit = (event) => {
  event.preventDefault();

  //Get data from the form
  const form = document.getElementById("contribute-form");
  const formData = new FormData(form);

  //Create a string of the sizes
  let sizes = Array.from(
    document.querySelectorAll('input[name="size"]:checked')
  ).map((checkbox) => {
    if (checkbox.value === "Other") {
      return document.getElementById("other").value.trim() || "Other";
    }
    return checkbox.value;
  });
  const sizesString = sizes.join(",");

  //Set sizes in the form
  formData.set("product_info1", sizesString);

  //Create errortext element
  const errorText = document.createElement("p");
  const errorElement = document.getElementById("error-text");
  errorElement.appendChild(errorText);

  // Form validation
  if (formData.get("product_name") === "") {
    errorText.textContent = "You need to enter a product name";
  } else if (formData.get("product_owner") === "") {
    errorText.textContent = "You need to enter a product owner";
  } else if (formData.get("product_description") === "") {
    errorText.textContent = "You need to enter a product description";
  } else if (formData.get("product_info2") === "") {
    errorText.textContent = "You need to enter a price";
  } else if (formData.get("product_photo") === "") {
    errorText.textContent = "You need upload an image";
  } else {
    formData.set("website_code", my_website_code);

    //Post request
    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    //Post to baseUrl with data
    fetch(baseURL, requestOptions)
      .then((response) => {
        //Error if not sucessfull
        if (!response.ok) {
          errorText.textContent = "Network response was not successful";
        }
        return response.json();
      })
      //Sucessful response
      .then((data) => {
        console.log("Success:", data);
        document.getElementById("form-confirmation").classList.add("active");
        form.classList.add("hidden");
      });
  }
  //Replace errorelement
  errorElement.replaceChildren(errorText);
};

// Handle file input change
const handleFileChange = () => {
  //Get the photo and file label from html
  const fileInput = document.getElementById("product_photo");
  const fileLabel = document.getElementById("file_label");
  let fileName = fileInput.files[0].name;
  //Create a shortening if name is to long
  if (fileName.length > 20) {
    fileName = fileName.substring(0, 18) + "...";
  }
  fileLabel.innerHTML = `${fileName}`;
};

// Render product
const renderProduct = (product) => {
  // Get the products containers from html
  const productFlexContainerTop = document.querySelector(
    ".product-flex-container-top"
  );
  const productFlexContainerBottom = document.querySelector(
    ".product-flex-container-bottom"
  );
  const productFlexContainerAccessories = document.querySelector(
    ".product-flex-container-accessories"
  );

  // Create product html element
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

  //Filter products in category tops
  if (
    product.product_name === "Sweater" ||
    product.product_name === "Top" ||
    product.product_name === "T-shirt" ||
    product.product_name === "Hoodie" ||
    product.product_name === "Crewneck" ||
    product.product_name === "Longsleeve"
  ) {
    if (productFlexContainerTop) {
      productFlexContainerTop.appendChild(productBox);
    }
  }
  //Filter products in category bottoms
  else if (
    product.product_name === "Skirt" ||
    product.product_name.includes("Pant") ||
    product.product_name === "Jeans" ||
    product.product_name === "Shorts"
  ) {
    if (productFlexContainerBottom) {
      productFlexContainerBottom.appendChild(productBox);
    }
  } //Rest in accessories
  else {
    if (productFlexContainerAccessories) {
      productFlexContainerAccessories.appendChild(productBox);
    }
  }
};

// Fetch and render products
const queryParams = { website_code: my_website_code };
const queryString = new URLSearchParams(queryParams).toString();
const urlWithParams = baseURL + "?" + queryString;
//Get request option
const requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch(urlWithParams, requestOptions)
  //Return error if request was not sucessful
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  //Render products if sucessfull
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
  })
  //Catch errors
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Load HTML content
function loadHTML(elementId, filePath, callback) {
  fetch(filePath)
    //Error if request is not successful
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    //Set element by sucess
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (callback) callback();
    })
    .catch((error) => console.error("Error loading HTML:", error));
}

// Page setup on first load

document.addEventListener("DOMContentLoaded", () => {
  //Load header into pages
  loadHTML("header-placeholder", "header.html", () => {
    document.getElementById("logo").addEventListener("click", function () {
      document
        .querySelectorAll("#sidenav a")
        .forEach((link) => link.classList.remove("highlighted"));
      document
        .querySelectorAll(".dropdown-btn")
        .forEach((btn) => btn.classList.remove("activated"));
      saveSidenavState();
    });
  });

  //Load sidenav into pages
  loadHTML("sidenav-placeholder", "sidenav.html", () => {
    const sidenavBtn = document.getElementById("sidenav-btn");
    const exitBtn = document.getElementById("exit-btn");

    if (sidenavBtn) sidenavBtn.addEventListener("click", () => toggleNav(true));
    if (exitBtn) exitBtn.addEventListener("click", () => toggleNav(false));

    const fileInput = document.getElementById("product_photo");
    const fileLabel = document.getElementById("file_label");
    if (fileInput && fileLabel)
      fileInput.addEventListener("change", handleFileChange);

    const dropdownBtns = document.querySelectorAll(".dropdown-btn");
    //Open dropdown when dropdown button is clicked
    dropdownBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
        if (this.nextElementSibling) {
          const dropdownContent = this.nextElementSibling;
          dropdownContent.style.display =
            dropdownContent.style.display === "block" ? "none" : "block";
          this.querySelector(".fa-caret-down").classList.toggle("rotate");
        }
        saveSidenavState();
      });
    });

    // Highlight link is clicked
    const links = document.querySelectorAll("#sidenav a");
    links.forEach((link) => {
      link.addEventListener("click", function () {
        links.forEach((link) => link.classList.remove("highlighted"));
        this.classList.add("highlighted");
        saveSidenavState();
      });
    });

    loadSidenavState();
  });

  //Send post request when submit is clicked
  const form = document.getElementById("contribute-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});
