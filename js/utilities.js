// Format birthday
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

/* The Random User Generator API only has country codes.
   This utility function translates that code into the full country name */
function unAbbreviateCountry(countryCode) {
  const countryAbbr = {
    AU: 'Australia',
    CA: 'Canada',
    US: 'United States'
  }

  return countryAbbr[countryCode];
}

/* The Random User Generator API only gives the full state name. 
This utlitity function abbreviates the state name */

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
        Yukon: "YT",
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