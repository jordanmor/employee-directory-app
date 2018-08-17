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
    <button class="full-list-btn">Full List</button>
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
    this.$cards = $('#gallery .card');
    this.$modalContainer = $('.modal-container');
    this.modal = null;
    this.search = new Search();
  };

  init(numOfEmployees) {
    this.search.$fullListBtn.hide();
    this.$modalContainer.hide();
    this.fetchData(numOfEmployees);
  }

  fetchData(num) {
    fetch(`https://randomuser.me/api/?nat=us,ca,au&results=${num}&noinfo`)
        .then(res => res.json())
        .then(data => data.results)
        .then(employeesData => {
          return employeesData.map(employeeData => createEmployee(employeeData));
        })
        .then(employeesArray => {
          this.populateEmployees(employeesArray);
          this.$cards = $('.cards');
          employeesArray.map(employee => this.employees.push(employee));
          this.modal = new Modal(this.employees);
        });
  }

  populateEmployees(employees) {
    const html = employees.map(employee => {
      const { name, email, image, city, state} = employee;
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
  }
}

// -- MODAL COMPONENT -- //

class Modal {
  constructor(employees) {
    this.$modal = $('.modal-container');
    this.$body = $('body');
    this.$cards = $('.card');
    this.$modalCloseBtn = $('#modal-close-btn');
    this.$modalNavButtons = $('.modal-btn-container button');
    this.employees = employees;
    this.currentEmployeeIndex = 0;

    this.$cards.on('click', e => this.showModal(e));
    this.$modalCloseBtn.on('click', () => this.hideModal());
    this.$modalNavButtons.on('click', e => this.navigateModal(e));
  }

  showModal(e) {
    const $selectedCard = $(e.target).closest('.card');
    this.currentEmployeeIndex = $selectedCard.index();
    const currentEmployee = this.employees[this.currentEmployeeIndex];
    this.populateModal(currentEmployee);
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

  navigateModal(e) {
    const lastIndex = this.employees.length - 1;
    
    if(e.target.textContent === 'Prev') {
      if (this.currentEmployeeIndex === 0) {
        this.currentEmployeeIndex = lastIndex;
      } else {
        this.currentEmployeeIndex--;
      }
      const prevEmployee = this.employees[this.currentEmployeeIndex];
      this.populateModal(prevEmployee);
    } else if(e.target.textContent === 'Next') {
      if (this.currentEmployeeIndex === lastIndex) {
        this.currentEmployeeIndex = 0;
      } else {
        this.currentEmployeeIndex++;
      }
      const nextEmployee = this.employees[this.currentEmployeeIndex];
      this.populateModal(nextEmployee);
    }
  }
}

// -- SEARCH COMPONENT -- //

class Search {
  constructor(employees) {
    this.employees = employees;
    this.$fullListBtn = $('.full-list-btn');
    this.$searchInput = $('#search-input');
    this.$searchSubmitBtn = $('#search-submit');
   
    this.$searchSubmitBtn.on('click', () => this.searchSubmit());
    this.$fullListBtn.on('click', () => this.returnFullList());
  }

  searchSubmit() {
    this.$searchSubmitBtn.hide();
    this.$fullListBtn.show();
  }

  returnFullList() {
    this.$fullListBtn.hide(); 
    this.$searchSubmitBtn.show();
  }


}

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

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

function unAbbreviateCountry(countryCode) {
  const countryAbbr = {
    AU: 'Australia',
    CA: 'Canada',
    US: 'United States'
  }

  return countryAbbr[countryCode];
}

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