class Directory {
  constructor() {
    this.employees = [];
    this.$gallery = $('#gallery');
    this.$directory = $('#directory');
    this.$loader = $('.loader');
    this.$modalContainer = $('.modal-container');
    this.modal = null;
    this.$searchInput = $('#search-input');
    this.$fullListBtn = $('.full-list-btn');
    this.$submitBtn = $('#search-submit');

    this.$submitBtn.on('click', e => this.performSearch(e));
    this.$fullListBtn.on('click', e => this.returnToFullList(e));
  };

  // Init performs these actions when the page loads
  init(numOfEmployees) {
    this.$modalContainer.hide();
    this.$loader.hide();
    this.$fullListBtn.hide();
    this.fetchData(numOfEmployees);
  }

  /* Fetched data is mapped over and used to make an array of employees 
  using the createEmployee component. This array of employees is stored 
  in the Directory component and used to populate the employee cards in the DOM */
  fetchData(num) {
    this.startLoader();
    fetch(`https://randomuser.me/api/?nat=us,ca,au&results=${num}&noinfo`)
        .then(res => res.json())
        .then(data => data.results.map(employeeData => createEmployee(employeeData)))
        .then(employeesArray => {
          employeesArray.forEach(employee => this.employees.push(employee));
          this.endLoader();
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

    /* Old event listeners from the previous instance of the modal component 
    have to be removed before creating a new instance of the modal to avoid duplicates*/
    this.removeEventHandlers();

    /* A new instance of the Modal component is created every time the app populates 
    the employee cards in the DOM. This assures that the modal will work 
    with the list of employees if it is filtered. */
    this.modal = new Modal(employees);
  }

  performSearch(e) {
    e.preventDefault();
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

  returnToFullList(e) {
    e.preventDefault();
    this.$gallery.html('');
    this.populateEmployees(this.employees);
    this.toggleSearchButtons();
  }

  toggleSearchButtons() {
    this.$submitBtn.toggle();
    this.$searchInput.toggle();
    this.$fullListBtn.toggle();
  }

  startLoader() {
    this.$directory.fadeOut(0);
    this.$loader.show();
  }

  endLoader() {
    this.$loader.hide();
    this.$directory.fadeIn(1000);
  }

  removeEventHandlers() {
    $('.card').off();
    $('#modal-close-btn').off();
    $('.modal-btn-container button').off();
  }

}