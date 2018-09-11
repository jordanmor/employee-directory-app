class Directory {
  constructor() {
    this.employees = [];
    this.modal = null;
    this.DOM = {
      directory: $('#directory'),
      gallery: $('#gallery'),
      searchInput: $('#search-input'),
      fullListBtn:  $('.full-list-btn'),
      submitBtn: $('#search-submit'),
      loader: $('.loader')
    };
  };

  // Init performs these actions when the page loads
  init(numOfEmployees) {
    $('.modal-container').hide();
    this.DOM.loader.hide();
    this.DOM.fullListBtn.hide();
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
    this.DOM.gallery.append(html);

    /* A new instance of the Modal component is created every time the app populates 
    the employee cards in the DOM. This assures that the modal will work 
    with the list of employees if it is filtered. */
    this.modal = new Modal(employees);
  }

  performSearch(e) {
    e.preventDefault();
    const value = this.DOM.searchInput.val().toLowerCase().trim();

    if(value !== '') {
      const filteredList = this.filterList(this.employees, value);
      this.DOM.searchInput.val('');

      if(!filteredList.length) {
        this.DOM.gallery.html('<h2>There are no employees that match this search</h2>');
      } else {
        this.DOM.gallery.html('');
        this.populateEmployees(filteredList);
      }

      this.toggleSearchButtons();
    }
  }

  filterList(list, value) {
    return list.filter(list => list.name.includes(value));
  }

  returnToFullList(e) {
    e.preventDefault();
    this.DOM.gallery.html('');
    this.populateEmployees(this.employees);
    this.toggleSearchButtons();
  }

  toggleSearchButtons() {
    this.DOM.submitBtn.toggle();
    this.DOM.searchInput.toggle();
    this.DOM.fullListBtn.toggle();
  }

  startLoader() {
    this.DOM.directory.fadeOut(0);
    this.DOM.loader.show();
  }

  endLoader() {
    this.DOM.loader.hide();
    this.DOM.directory.fadeIn(1000);
  }
}