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