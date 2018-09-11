class Modal {

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

  navigateModal(e) {
    // Navigation buttons only work if there is more than 1 employee in the employee list
    if(this.employees.length > 1) {
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

}