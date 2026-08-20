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


//Function for rendering countries
function renderCountry(countryData){
  const htmlString = `
  <article class="country">
        <img class="country__img" src="${countryData.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${countryData.name}</h3>
          <h4 class="country__region">${countryData.region}</h4>
          <p class="country__row"><span>👫</span>${countryData.population}</p>
          <p class="country__row"><span>🗣️</span>${countryData.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${countryData.currencies[0].name}</p>
        </div>
  `

  countriesContainer.insertAdjacentHTML('beforeend' , htmlString)
  
}

//function for rendering neighbouring country
function renderNeighbour(countryData){
  const htmlString = `
  <article class="country neighbour">
        <img class="country__img" src="${countryData.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${countryData.name}</h3>
          <h4 class="country__region">${countryData.region}</h4>
          <p class="country__row"><span>👫</span>${countryData.population}</p>
          <p class="country__row"><span>🗣️</span>${countryData.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${countryData.currencies[0].name}</p>
        </div>
  `

  countriesContainer.insertAdjacentHTML('beforeend' , htmlString)

}
//Function for getting countries data from countries api
/* function getCountriesData(countryName){
  const request = new XMLHttpRequest(); //creation of new request

request.open('GET' ,`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}` )  
request.send();

request.addEventListener('load' , function(){
  const data = JSON.parse(request.responseText)[0]
  console.log(data)

  renderCountry(data);
  
  
})} */

// getCountriesData('Italy')
// getCountriesData('Lithuania')
// getCountriesData('Norway')
// getCountriesData('portugal')

//function for requesting NeighbourData
/* function getNeighbourData(neighbourCode){
  const requestNeighbour = new XMLHttpRequest()
  requestNeighbour.open('GET' , `https://corsproxy.io/?url=https://www.apicountries.com/alpha/${neighbourCode}` )

  requestNeighbour.addEventListener('load' , function(){
    const neighbourData = JSON.parse(requestNeighbour.responseText)
    renderCountry(neighbourData);

  })
} */


//Concept of Callback Hell____________________________________________
//Multiple Nested Callback functions if we want to execute one asynchronous task after tthe first asynchronous task is completed
//Due top multiple nested funtions one inside another code becomes harder to maintain.

//Example of callback hell-->

/* const request1 = new XMLHttpRequest()
request1.open('GET' , `https://corsproxy.io/?url=https://www.apicountries.com/name/France`)
request1.send()

request1.addEventListener('load' , function(){
  const [data1] = JSON.parse(request1.responseText)
  console.log(data1)
  renderCountry(data1);


  const request2 = new XMLHttpRequest()
  request2.open("GET" , `https://corsproxy.io/?url=https://www.apicountries.com/alpha/${data1.borders[0]}` )
  request2.send()

  request2.addEventListener('load' , function(){
    const data2 = JSON.parse(request2.responseText)

    console.log(data2)
    renderNeighbour(data2)

    const request3 = new XMLHttpRequest()
    request3.open("GET" , `https://corsproxy.io/?url=https://www.apicountries.com/alpha/${data2.borders[0]}`)
    request3.send()

    request3.addEventListener('load' , function(){
      const data3 = JSON.parse(request3.responseText)

      renderNeighbour(data3)
    })

  }) 
}) */


//Promises_______________________________________________________________
//A promise is a placeholder object used for the future value of a asynchronous task;
//States of a promise:
// Pending ---> Settled ---> [Fulfilled or Rejeted ]
//A promises must first be created in order for it to be consuemed

//Fetch API__________________
//It is the modern way of making http requests

const request1 = fetch(`https://corsproxy.io/?url=https://www.apicountries.com/name/France`)
console.log(request1)

//This fetch fucntion creates a promise , then consumes it and returns it
 

//Consuming Promises_______________________

//then method :-
//1) Every promise has a Promise.then(response) method in which we can pass in a callback fuction which is executed as soon as the promise is settled
//2) 'response' is the fulfilled value of the promise that we are handling
//3) Any value that we return from then method becomes the fullfille value of the promise  , which is returned by the then method

// To read the data from 'response' object , 
// call response.json() --> this also returns a promise 



/* function getCountryData(countryName){
  fetch(`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}`)
  .then(response => response.json())
  .then(data => console.log(data)) 
}
getCountryData('France')
 */
//Chaining Promises__________________________________

function getCountryData(countryName){
fetch(`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}`)
.then(response1 => response1.json())
.then(([data1]) => {
  renderCountry(data1);
  return fetch(`https://corsproxy.io/?url=https://www.apicountries.com/alpha/${data1.borders[0]}`)
})
.then(response2 => response2.json())
.then(data2 => {
  renderNeighbour(data2);
  return fetch(`https://corsproxy.io/?url=https://www.apicountries.com/alpha/${data2.borders[1]}`)
})
.then(response3 => response3.json())
.then(data3 => {
  renderNeighbour(data3);  
})
.catch(error => {
  console.error(`Your request was not fulfilled : ${error} `)
  countriesContainer.insertAdjacentText('beforeend' , `Your request was not fulfilled : ${error.message} `)
})
.finally(()=> {
  countriesContainer.style.opacity = '1'
})
}

btn.addEventListener('click' , getCountryData.bind(this , 'France'))


//Catching and Handling Errors 
//.catch( callbackFunction(errorObject))
//this is executed only if promise is not fulfilled (example: user network connection stops working)
//genrally when an error is generated it falls through Promise chain 
//this error stops the code execution if it does not find any catch method

//.finally(callbackFunction) --> this method is attached at the end of promise chain and executed no matter  promise is fulfilled or not.











