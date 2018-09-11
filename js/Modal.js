class Modal {

  constructor(employees) {
    this.employees = employees;
    this.selectedEmployeeIndex = 0;
    this.DOM = {
      modal: $('.modal-container')
    };
  }

  /* When user clicks an employee card, this method finds the index of that card 
    relevant to the entire list of cards in the dom, and uses that index to find 
    the same employee in the main employee array stored in the Directory component. */
  showModal(target) {
    const $selectedCard = $(target).closest('.card');
    this.selectedEmployeeIndex = $selectedCard.index();
    const selectedEmployee = this.employees[this.selectedEmployeeIndex];
    this.populateModal(selectedEmployee);
    this.DOM.modal.show();
  }

  hideModal() {
    this.DOM.modal.hide();
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
    const buttonText = e.target.textContent;
    // Navigation buttons only work if there is more than 1 employee in the employee list
    if(this.employees.length > 1) {
      const lastIndex = this.employees.length - 1;

      if(buttonText === 'Prev') {
        // If first employee in list is reached, moving back takes user to the last employee in the list
        if (this.selectedEmployeeIndex === 0) {
          this.selectedEmployeeIndex = lastIndex;
        } else {
          this.selectedEmployeeIndex--;
        }
        const prevEmployee = this.employees[this.selectedEmployeeIndex];
        this.populateModal(prevEmployee);

      } else if(buttonText === 'Next') {
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