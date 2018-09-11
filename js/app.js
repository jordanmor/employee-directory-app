const directory = new Directory();
directory.init(12);

// Modal event handlers
$('#gallery').on('click', 'div.card', function(e) {
  directory.modal.showModal(e.currentTarget);
});

$('#modal-close-btn').on('click', function() {
  directory.modal.hideModal();
});

$('.modal-btn-container button').on('click', function(e) {
  directory.modal.navigateModal(e);
});

// Search event handlers
$('#search-submit').on('click', function(e) {
  directory.performSearch(e);
});

$('.full-list-btn').on('click', function(e) {
  directory.returnToFullList(e);
});