'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://countries-api-836d.onrender.com/countries/
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

//XMLHttpRequest______________________________________

function getCountriesData(countryName){
  const request = new XMLHttpRequest(); //creation of new request

request.open('GET' ,`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}` )  
request.send();

request.addEventListener('load' , function(){
  const data = JSON.parse(request.responseText)[0]
  console.log(data)
  
  const htmlString = `
  <article class="country">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${data.population}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
  `

  countriesContainer.insertAdjacentHTML('afterbegin' , htmlString)
  countriesContainer.style.opacity = '1'
})}

getCountriesData('Italy')
getCountriesData('Lithuania')
getCountriesData('Norway')
getCountriesData('portugal')





