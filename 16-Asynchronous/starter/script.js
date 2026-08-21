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
  </article>
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
// Pending ---> Settled ---> [Fulfilled or Rejected ]
//A promises must first be created in order for it to be consuemed

//Fetch API__________________
//It is the modern way of making http requests

const request1 = fetch(`https://corsproxy.io/?url=https://www.apicountries.com/name/France`)
// console.log(request1)

//This fetch fucntion creates a promise , then consumes it and returns it
 

//Consuming Promises_______________________

//then method :-
//1) Every promise has a Promise.then(response) method in which we can pass in a callback fuction which is executed as soon as the promise is settled
//2) 'response' is the fulfilled value of the promise that we are handling
//3) Any value that we return from then method becomes the fullfilled value of the promise  , which is returned by the then method
//4) then method will not throw an error even if the request is not settled , It only throws and error in the case of network connection issue.

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
/* 
function getCountryData(countryName){
fetch(`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}`)
.then(response1 => {
  if(!response1.ok){
    throw new Error(`Something Went Wrong : (${response1.status})`)
  }
  return response1.json()})
.then(([data1]) => {
  renderCountry(data1)
  if(!data1.borders){
    throw new Error(`No Neighbours Found`)
  }
  const neighbour = data1.borders[0]

  


  return fetch(`https://corsproxy.io/?url=https://www.apicountries.com/alpha/${neighbour}`)
})
.then(response2 => {
  if(!response2.ok){
    throw new Error(`Something Went Wrong : (${response2.status})`)
  }
  return response2.json()
})
.then(data2 => {
  renderNeighbour(data2)
})
.catch(error => {
  countriesContainer.insertAdjacentText('beforeend' , `Your request was not fulfilled : ${error.message} `)
})
.finally(()=> {
  countriesContainer.style.opacity = '1'
})
}

btn.addEventListener('click' , getCountryData.bind(this , "Australia"))

*/

//Refactoring Above code //

 //helper function
const getCountryJSON = function(url){
const countryJSON = fetch(url)
.then(response => {
  if(!response.ok){
    throw new Error(`Something Went Wrong (${response.status})`)
  }


  return response.json()
})

return countryJSON
}

//main function

const getCountryData = function(countryName){
  getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${countryName}`)
  .then(([data]) => {
    renderCountry(data)

    if(!data.borders){
      throw new Error('No Neighbours Found')
    }

    const [neighbour] = data.borders

    return getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/alpha/${neighbour}`)

  })
  .then(data => {
    renderNeighbour(data)
  })
  .catch(error => {
    countriesContainer.insertAdjacentText('beforeend' , `Your request was not fulfilled : ${error.message} `)
  })
  .finally(()=> {
    countriesContainer.style.opacity = '1'
  })
}


//getCountryData()




//Catching and Handling Errors__________________
//.catch( callbackFunction(errorObject))
//this is executed only if promise is not fulfilled (example: user network connection stops working)
//genrally when an error is generated it falls through Promise chain 
//this error stops the code execution if it does not find any catch method

//Manually Throwing error________ -> this error will get delegated via promise chain and finally is catched by .catch() method.
// Syntax : throw new Error(errorMessageString) //
//can be used to for manually handling errors.


//.finally(callbackFunction)_____________
//  --> this method is attached at the end of promise chain and executed no matter  promise is fulfilled or not.


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}.
The AJAX call will be done to a URL with this format: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=52.508&longitude=13.381. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/


//Additionally using geolocation api to get users data
/* navigator.geolocation.getCurrentPosition((position) => whereAmI(position.coords.latitude , position.coords.longitude))
const whereAmI = function(latitude , longitude){
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
  .then(response => {
    if(!response.ok){
      throw new Error(`Something Went Wrong (${response.status})`)
    }

    return response.json()
  })
  .then(data => {
    console.log(data)
    console.log(`You are in ${data.principalSubdivision}, ${data.countryName}`)
    getCountryData(data.countryName)
  })
  .catch(error=> {
    console.log(error.message)
  })
}

btn.addEventListener("click" , whereAmI.bind(this , 52.508, 13.381)) */


//Event loop in practice___________________
/* console.log('Test Start')  //print 1
setTimeout(()=> console.log('0 second timeout') , 0) //this is placed in the callback que  //print 4

//this immediately resolves the promise
Promise.resolve('Resolved Promise 1').then((response)=> console.log(response))  //this is placed in the microtasks que  //print 3
Promise.resolve('Resolved Promise 2')
.then(response => {
  for(let i=0; i<10000000000; i++){}
  console.log(response)
})
console.log('Test End') //print 2
 */


//Building our own promise___________________________________________________________________________________
//We created our new promise by using Promise constructor fucntion
// new Promise(executorFunction(resolve , reject))

const lotteryPromise = new Promise(function(resolve , reject){
  
  console.log('///Lottery Drawn is happening///')

  setTimeout(()=> { //this is used just to simulate asynchronous behaviour

    if(Math.random() > 0.7){
      resolve('You won the lottery') //calling this func settles promise in resolved state with value passed as arguements
    } else {
      reject(new Error('You lost your money')) //calling this func settles promise in rejected state with value passed as arguements which is then passsed to error handler
    }
  } ,  2000)
})

lotteryPromise
.then((response)=> {
  console.log(response)
})
.catch((err)=> console.error(err))


//Promisifying SetTimeout Function//

//for reference
/* setTimeout(()=> {
  console.log('1 second passed')
  setTimeout(()=> {
    console.log('2 second passed')
    setTimeout(()=> {
      console.log('4 second passed')
      setTimeout(()=> {
        console.log('1 second passed')
      } , 1000)
    } , 1000)
  } , 1000)
} , 1000) */

function wait(seconds){
  return new Promise((resolve)=> {
    setTimeout(resolve() , seconds*1000)
  })
}



wait(1)
.then(()=>{
  console.log('1 second passed')

  return wait(1)
})
.then(()=>{
  console.log('2 second passed')

  return wait(1)
})
.then(()=>{
  console.log('3 second passed')

  return wait(1)
})
.then(()=>{
  console.log('4 second passed')

})

//Resolving / Rejecting a promise instantly________
Promise.resolve('Resolved Instantly').then((val)=> console.log(val))
Promise.reject('Rejected Instantly').catch(err => console.error(err))















