$('#gallery').after(
  `<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
            <h3 id="name" class="modal-name cap">name</h3>
            <p class="modal-text">email</p>
            <p class="modal-text cap">city</p>
            <hr>
            <p class="modal-text">(555) 555-5555</p>
            <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
            <p class="modal-text">Birthday: 10/21/2015</p>
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

class Directory {
  constructor() {
    this.employees = [];
    this.$gallery = $('#gallery');
  };

  fetchData(num) {
    fetch(`https://randomuser.me/api/?nat=us,gb,ca,ie,au&results=${num}&noinfo`)
        .then(res => res.json())
        .then(data => data.results)
        .then(employeesData => {
          return employeesData.map(employeeData => new Employee(employeeData));
        })
        .then(employeesArray => {
          this.populateEmployees(employeesArray);
          this.employees.push(employeesArray);
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

class Employee {
  constructor(data) {
    this.name = `${data.name.first} ${data.name.last}`;
    this.email = data.email;
    this.username = data.login.username;
    this.cell = data.cell;
    this.image = data.picture.large;
    this.street = data.location.street;
    this.city = data.location.city;
    this.state = data.location.state;
    this.postcode = data.location.postcode;
    this.country = abbreviateCountry(data.nat);
    this.birthday = formatDate(data.dob.date);
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