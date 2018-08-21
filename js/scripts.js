$('#gallery').after(
  `<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="" alt="">
            <h3 id="name" class="modal-name cap"></h3>
            <p class="modal-text modal-email"></p>
            <p class="modal-text cap modal-city"></p>
            <hr>
            <p class="modal-text modal-cell"></p>
            <p class="modal-text modal-address cap"></p>
            <p class="modal-text modal-country"></p>
            <p class="modal-text modal-birthday"></p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>`
);

$('.search-container').append(
  `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    <button class="full-list-btn is-hidden">Return to Full List</button>
  </form>`);

/*=============-=============-=============-=============
                        COMPONENTS
===============-=============-=============-===========*/

// -- EMPLOYEE COMPONENT -- //

const createEmployee = data => {
  const { name, email, cell, picture, location, nat, dob } = data;
  return {
    name: `${name.first} ${name.last}`,
    email,
    cell,
    image: picture.large,
    street: location.street,
    city: location.city,
    state: location.state,
    postcode: location.postcode,
    country: unAbbreviateCountry(nat),
    countryCode: nat,
    birthday: formatDate(dob.date)
  }
}

// -- DIRECTORY COMPONENT -- //

class Directory {
  constructor() {
    this.employees = [];
    this.$gallery = $('#gallery');
    this.$modalContainer = $('.modal-container');
    this.modal = null;
    this.$searchInput = $('#search-input');
    this.$fullListBtn = $('.full-list-btn');
    this.$submitBtn = $('#search-submit');

    this.$submitBtn.on('click', () => this.performSearch());
    this.$fullListBtn.on('click', () => this.returnToFullList());
  };
  // Init performs these actions when the page loads
  init(numOfEmployees) {
    this.$modalContainer.hide();
    this.$fullListBtn.hide();
    this.fetchData(numOfEmployees);
  }
  /* Fetched data is mapped over and used to make an array of employees 
     using the createEmployee component. This array of employees is stored 
     in the Directory component and used to populate the employee cards in the DOM */
  fetchData(num) {
    fetch(`https://randomuser.me/api/?nat=us,ca,au&results=${num}&noinfo`)
        .then(res => res.json())
        .then(data => data.results.map(employeeData => createEmployee(employeeData)))
        .then(employeesArray => {
          employeesArray.forEach(employee => this.employees.push(employee));
          this.populateEmployees(this.employees);
        });
  }

  populateEmployees(employees) {
    const html = employees.map(employee => {
      // Use destructuring to pull relevant data from the employees array
      const { name, email, image, city } = employee;
      return `<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${image} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${name}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${city}</p>
                </div>
              </div>`;
    });
    this.$gallery.append(html);
    /* A new instance of the Modal component is created every time the app populates 
    the employee cards in the DOM. This assures that the modal will work 
    with the list of employees if it is filtered. */
    this.modal = new Modal(employees);
  }

  performSearch() {
    const value = this.$searchInput.val().toLowerCase().trim();

    if(value !== '') {
      const filteredList = filterList(this.employees, 'name', value);
      this.$searchInput.val('');

      if(!filteredList.length) {
        this.$gallery.html('<h2>There are no employees that match this search</h2>');
      } else {
        this.$gallery.html('');
        this.populateEmployees(filteredList);
      }

      this.toggleSearchButtons();
    }
  }

  returnToFullList() {
    this.$gallery.html('');
    this.populateEmployees(this.employees);
    this.toggleSearchButtons();
  }

  toggleSearchButtons() {
    this.$submitBtn.toggle();
    this.$searchInput.toggle();
    this.$fullListBtn.toggle();
  }
}

// -- MODAL COMPONENT -- //

class Modal {
  /* Every time the Modal Component is instantiated, the main employee list 
     is passed down to it from the Directory component */
  constructor(employees) {
    this.$modal = $('.modal-container');
    this.$body = $('body');
    this.$cards = $('.card');
    this.$modalCloseBtn = $('#modal-close-btn');
    this.$modalNavButtons = $('.modal-btn-container button');
    this.employees = employees;
    this.selectedEmployeeIndex = 0;

    this.$cards.on('click', e => this.showModal(e));
    this.$modalCloseBtn.on('click', () => this.hideModal());
    this.$modalNavButtons.on('click', e => this.navigateModal(e));
  }

  /* When user clicks an employee card, this method finds the index of that card 
    relevant to the entire list of cards in the dom, and uses that index to find 
    the same employee in the main employee array stored in the Directory component. */
  showModal(e) {
    const $selectedCard = $(e.target).closest('.card');
    this.selectedEmployeeIndex = $selectedCard.index();
    const selectedEmployee = this.employees[this.selectedEmployeeIndex];
    this.populateModal(selectedEmployee);
    this.$modal.show();
  }

  hideModal() {
    this.$modal.hide();
  }

  populateModal(employee) {
    const {image, name, email, city, cell, birthday} = employee;
    const {street, state, postcode, country, countryCode} = employee;
    const address = `${street}, ${abbreviateState(state, countryCode)} ${postcode}`;

    $('.modal-img').attr('src', image);
    $('.modal-name').text(name);
    $('.modal-email').text(email);
    $('.modal-city').text(city);
    $('.modal-cell').text(cell);
    $('.modal-address').html(address);
    $('.modal-country').text(country);
    $('.modal-birthday').text(`Birthday: ${birthday}`);
  }

  // Switch back and forth between employees when detail modal is open
  navigateModal(e) {
    const lastIndex = this.employees.length - 1;
    
    if(e.target.textContent === 'Prev') {
      // If first employee in list is reached, moving back takes user to the last employee in the list
      if (this.selectedEmployeeIndex === 0) {
        this.selectedEmployeeIndex = lastIndex;
      } else {
        this.selectedEmployeeIndex--;
      }
      const prevEmployee = this.employees[this.selectedEmployeeIndex];
      this.populateModal(prevEmployee);
    } else if(e.target.textContent === 'Next') {
      // If last employee in list is reached, moving forward takes user to the first employee in the list
      if (this.selectedEmployeeIndex === lastIndex) {
        this.selectedEmployeeIndex = 0;
      } else {
        this.selectedEmployeeIndex++;
      }
      const nextEmployee = this.employees[this.selectedEmployeeIndex];
      this.populateModal(nextEmployee);
    }
  }
}

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/
// Function refactored so it can be used in other use cases as well
function filterList(list, filterBy, value) {
  return list.filter(list => list[filterBy].includes(value));
}
// Function used to format birthday
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();

  day < 10 ? day = `0${day}` : day;
  month < 10 ? month = `0${month}` : month;

  return `${month}/${day}/${year}`;
}

function capitalize(str) {
  return str.split(' ').map( item => item.slice(0,1).toUpperCase() + item.substring(1)).join(' ');
}
/* The Random User Generator API only has country codes, 
   so this function translates that code into the full country name */
function unAbbreviateCountry(countryCode) {
  const countryAbbr = {
    AU: 'Australia',
    CA: 'Canada',
    US: 'United States'
  }

  return countryAbbr[countryCode];
}
/* The Random User Generator API only gives the full state name. The example in the project mockup 
   uses an abbreviated state name, so this function serves that purpose */
function abbreviateState(state, countryCode) {

  const statesAbbr = {
    AU: {
        "Australian Capital Territory": "ACT",
        "Northern Territory": "NT",
        "New South Wales": "NSW",
        Queensland: "QLD",
        "South Australia": "SA",
        Tasmania: "TAS",
        Victoria: "VIC",
        "Western Australia": "WA"
    },
    CA: {
        Alberta: "AB",
        "British Columbia": "BC",
        Manitoba: "MB",
        "New Brunswick": "NB",
        "Newfoundland And Labrador": "NL",
        "Northwest Territories": "NT",
        "Nova Scotia": "NS",
        Nunavut: "NU",
        Ontario: "ON",
        "Prince Edward Island": "PE",
        Québec: "QC",
        Saskatchewan: "SK",
        "Yukon Territory": "YT"
    },
    US: {
        Alabama: "AL",
        Alaska: "AK",
        "American Samoa": "AS",
        Arizona: "AZ",
        Arkansas: "AR",
        California: "CA",
        Colorado: "CO",
        Connecticut: "CT",
        Delaware: "DE",
        "District Of Columbia": "DC",
        "Federated States Of Micronesia": "FM",
        Florida: "FL",
        Georgia: "GA",
        Guam: "GU",
        Hawaii: "HI",
        Idaho: "ID",
        Illinois: "IL",
        Indiana: "IN",
        Iowa: "IA",
        Kansas: "KS",
        Kentucky: "KY",
        Louisiana: "LA",
        Maine: "ME",
        "Marshall Islands": "MH",
        Maryland: "MD",
        Massachusetts: "MA",
        Michigan: "MI",
        Minnesota: "MN",
        Mississippi: "MS",
        Missouri: "MO",
        Montana: "MT",
        Nebraska: "NE",
        Nevada: "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        "Northern Mariana Islands": "MP",
        Ohio: "OH",
        Oklahoma: "OK",
        Oregon: "OR",
        Palau: "PW",
        Pennsylvania: "PA",
        "Puerto Rico": "PR",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        Tennessee: "TN",
        Texas: "TX",
        Utah: "UT",
        Vermont: "VT",
        "Virgin Islands": "VI",
        Virginia: "VA",
        Washington: "WA",
        "West Virginia": "WV",
        Wisconsin: "WI",
        Wyoming: "WY"
    }
  }

  return statesAbbr[countryCode][capitalize(state)];
}

/*=============-=============-=============-=============
                      PROGRAM INIT
===============-=============-=============-===========*/

const directory = new Directory();
directory.init(12);