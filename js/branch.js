"use strict";

// variables declarations
let form = document.querySelector(".form");
let containerWorkouts = document.querySelector(".workouts");
let inputSale = document.querySelector(".form__input--sale");
let inputProfit = document.querySelector(".form__input--profit");
let inputType = document.querySelector(".form__input--type");
let addBtn = document.querySelector(".form__btn");
var inputElement = document.querySelector(".form__input--city");
let clearbtnContainer = document.querySelector(".clearbtn-container");
let addressitems = document.querySelector(".adresses");
let mapBtn = document.querySelector(".show-workouts");
let navBtn = document.querySelector(".nav-btn");
let currPositionObj;

// autocomplete functionality
function addressAutocomplete(containerElement, callback) {
  // add input field clear button
  var clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = "";
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  clearbtnContainer.appendChild(clearButton);
  /* Current autocomplete items data (GeoJSON.Feature) */
  var currentItems;

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  var currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  var focusedItemIndex;

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function (e) {
    addressitems.style.display = "block"; //! change
    clearbtnContainer.style.display = "block";
    var currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true,
      });
    }

    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "72fc09687d6c4a329da78b273601895d";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        currentValue
      )}&limit=5&apiKey=${apiKey}`;

      fetch(url).then((response) => {
        // check if the call was successful
        if (response.ok) {
          response.json().then((data) => resolve(data));
        } else {
          response.json().then((data) => reject(data));
        }
      });
    });

    promise.then(
      (data) => {
        currentItems = data.features;

        /*create a DIV element that will contain the items (values):*/
        var autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        containerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.features.forEach((feature, index) => {
          /* Create a DIV element for each element: */
          var itemElement = document.createElement("DIV");
          /* Set formatted address as item value */
          itemElement.innerHTML = feature.properties.formatted;

          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function (e) {
            inputElement.value = currentItems[index].properties.formatted;

            callback(currentItems[index]);

            /* Close the list of autocompleted values: */
            closeDropDownList();
            addressitems.style.display = "none"; //! change
            clearbtnContainer.style.display = "none";
          });

          autocompleteItemsElement.appendChild(itemElement);
        });
      },
      (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      }
    );
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function (e) {
    var autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== itemElements.length - 1
            ? focusedItemIndex + 1
            : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== 0
            ? focusedItemIndex - 1
            : (focusedItemIndex = itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent("Event");
        event.initEvent("input", true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].properties.formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    var autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      containerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    var svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("height", "24");

    var iconElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    iconElement.setAttribute(
      "d",
      "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    );
    iconElement.setAttribute("fill", "currentColor");
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
}
addressAutocomplete(
  document.getElementById("autocomplete-container"),
  (data) => {
    currPositionObj = data;
  }
);

// WORKOUT CLASS
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, sale, profite, address, formatted) {
    this.coords = coords;
    this.sale = sale;
    this.profite = profite;
    this.address = address;
    this.formatted = formatted;
  }
  _description() {
    this.description = `${this.formatted.slice(0, 22)}...`;
  }
}

// Large CLASS

class Large extends Workout {
  type = "large";
  constructor(coords, sale, profite, address, formatted, lat, lon, state) {
    super(coords, sale, profite, address, formatted);

    this._description();
    this.currlat = lat;
    this.currlonng = lon;
    this.state = state;
    this.city = address;
  }
}

// Small  CLASS
class Small extends Workout {
  type = "small";

  constructor(coords, sale, profite, address, formatted, state) {
    super(coords, sale, profite, address, formatted);
    this._description();
    this.currlat = coords[0];
    this.currlonng = coords[1];
    this.state = state;
    this.city = address;
  }
}

//WORK ACCORDING TO ARCHITECTURE IN OOP
class App {
  map;
  MapEvent;
  workouts = [];
  constructor() {
    this._getPosition();
    // get data from local stoarage
    this._getLocalStorage();

    // attach event handlers
    form.addEventListener("submit", this._newWorkOut.bind(this));

    containerWorkouts.addEventListener("click", this._moveMap.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._LoadMap.bind(this),
        function () {
          alert("We could not Fetch your location");
        }
      );
    }
  }
  _LoadMap(position) {
    let { latitude, longitude } = position.coords;

    let cords = [latitude, longitude];

    this.map = L.map("map").setView(cords, 13);

    this.map.createPane("labels");
    this.map.getPane("labels").style.zIndex = 650;
    this.map.getPane("labels").style.pointerEvents = "none";
    //
    var positron = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      {
        attribution: "©OpenStreetMap, ©CartoDB",
      }
    ).addTo(this.map);

    var positronLabels = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      {
        attribution: "©OpenStreetMap, ©CartoDB",
        pane: "labels",
      }
    ).addTo(this.map);

    // HANDLING CLICKS ON MAP

    this.map.on("click", this._showForm.bind(this)); //i think its chnage
    this.workouts.forEach((work) => {
      this.renderWorkoutMarker(work);
    });
    // this.reset();
  }

  // show form when click
  _showForm(MapE) {
    this.MapEvent = MapE;

    form.classList.remove("hidden");
    inputSale.focus();
  }
  _hideForm() {
    // Empty the input
    inputSale.value = inputProfit.value = inputElement.value = "";

    setTimeout(() => {
      form.style.display = "grid";
    }, 1000);
  }
  _newWorkOut(e) {
    e.preventDefault();
    let { name, country, city, street, lat, lon, formatted, state } =
      currPositionObj.properties;
    let validinputs = function (...inputs) {
      return inputs.every((inp) => Number.isFinite(inp));
    };
    let allPositive = function (...inputs) {
      return inputs.every((inp) => inp >= 0);
    };

    // Get Data fro  from
    let type = inputType.value;
    let sale = +inputSale.value;
    let profite = +inputProfit.value;

    let workout;

    // if Workout is large create large object
    if (type === "large") {
      if (!validinputs(sale, profite) || !allPositive(sale, profite)) {
        return alert("inputs are must +numbers");
      }

      workout = new Large(
        [lat, lon],
        sale,
        profite,
        city,
        formatted,
        lat,
        lon,
        state
      );
    }

    // if Workout is small create small object
    if (type === "small") {
      if (!validinputs(sale, profite) || !allPositive(sale, profite)) {
        return alert("inputs are must +numbers");
      }
      workout = new Small([lat, lon], sale, profite, city, formatted, state);
    }
    this.workouts.push(workout);
    console.log("workout is", workout);

    this.renderWorkoutMarker(workout);

    // render workout on list
    this._RenderWorkout(workout);

    // empty fileds
    this._hideForm();

    // local staorage***********************************
    this._setLocalStorage();
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )

      .setPopupContent(
        ` ${workout.type === "large" ? "🏣" : "🗼"}${workout.description}`
      )
      .openPopup();
  }

  _RenderWorkout(workout) {
    console.log("This is li object", currPositionObj);

    let li = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description} <a target="_blank" href="https://www.google.com/maps/place/${workout.city},+${workout.state}/@${workout.currlat},${workout.currlonng},10z" class="getirection"><ion-icon class='location-icon' name="location-outline"></ion-icon> </a></h2>
          <div class="workout-details-container">
          <div class="workout__details">
          
            <span class="workout__value">City:</span>
            <span class="workout__unit">${workout.address}</span>    
          </div>
         <div class="workout__details">
           <span class="workout__value">Sale:</span>
           <span class="workout__unit">${workout.sale}</span>
         </div>
          <div class="workout__details">
           <span class="workout__value">profite:</span>
           <span class="workout__unit">${workout.profite}</span>
         </div>
         <div class="workout__details">
           <span class="workout__value">branch:</span>
           <span class="workout__unit">${workout.type}</span>
         </div>
          </div>
       </li>
    
    `;

    addressitems.insertAdjacentHTML("afterend", li);
  }
  _moveMap(e) {
    let workoutEl = e.target.closest(".workout");
    console.log(workoutEl);
    if (!workoutEl) return;
    let workout = this.workouts.find((el) => el.id === workoutEl.dataset.id);
    console.log(workout);
    this.map.setView(workout.coords, 13, {
      Animate: true,
      pan: {
        duration: 2,
      },
    });
  }
  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.workouts));
  }
  _getLocalStorage() {
    let data = JSON.parse(localStorage.getItem("workouts"));
    let data1 = data;

    if (!data1) return;
    this.workouts = data1;
    this.workouts.forEach((work) => {
      this._RenderWorkout(work);
    });
  }

  //remove all the lists from local storage

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

let app = new App();
