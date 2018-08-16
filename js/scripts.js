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
            <p class="modal-text modal-address"></p>
            <p class="modal-text modal-birthday"></p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>`
);

$('.modal-container').hide();

/*=============-=============-=============-=============
                        COMPONENTS
===============-=============-=============-===========*/

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
    country: abbreviateCountry(nat),
    birthday: formatDate(dob.date)
  }
}

class Directory {
  constructor() {
    this.employees = [];
    this.$gallery = $('#gallery');
    this.$cards = $('#gallery .card');
    this.modal = null;
  };

  fetchData(num) {
    fetch(`https://randomuser.me/api/?nat=us,gb,ca,ie,au&results=${num}&noinfo`)
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
                    <p class="card-text cap">${city}, ${state}</p>
                </div>
              </div>`;
    });
    this.$gallery.append(html);
  }

}

class Modal {
  constructor(employees) {
    this.$modal = $('.modal-container');
    this.$body = $('body');
    this.$cards = $('.card');
    this.$modalCloseBtn = $('#modal-close-btn');
    this.employees = employees;

    this.$cards.on('click', e => this.showModal(e));
    this.$modalCloseBtn.on('click', () => this.hideModal());
  }

  showModal(e) {
    const $selectedCard = $(e.target).closest('.card');
    this.$modal.show();
    this.$cards.removeClass('active');
    $selectedCard.addClass('active');
    const currentEmployeeIndex = $selectedCard.index();
    const currentEmployee = this.employees[currentEmployeeIndex];
    this.populateModal(currentEmployee);
  }

  hideModal() {
    this.$modal.hide();
  }

  populateModal(employee) {
    const {image, name, email, city, cell, birthday} = employee;
    const {street, state, postcode} = employee;
    const address = `${street}, ${state} ${postcode}`;

    $('.modal-img').attr('src', image);
    $('.modal-name').text(name);
    $('.modal-email').text(email);
    $('.modal-city').text(city);
    $('.modal-cell').text(cell);
    $('.modal-address').text(address);
    $('.modal-birthday').text(birthday);
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

function abbreviateCountry(countryCode) {
  const countryAbbr = {
    AU: 'Australia',
    CA: 'Canada',
    GB: 'United Kingdom',
    IE: 'Ireland',
    US: 'United States'
  }

  return countryAbbr[countryCode];
}

/*=============-=============-=============-=============
                      PROGRAM INIT
===============-=============-=============-===========*/

const directory = new Directory();
directory.fetchData(12);
console.log(directory.employees)