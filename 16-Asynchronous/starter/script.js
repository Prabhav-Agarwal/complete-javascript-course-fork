'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imagesContainer = document.querySelector('.images')

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
// navigator.geolocation.getCurrentPosition((position) => whereAmI(position.coords.latitude , position.coords.longitude))
/* const whereAmI = function(latitude , longitude){
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
} */

// btn.addEventListener("click" , whereAmI.bind(this , 52.508, 13.381)) 


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
/* 
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
.catch((err)=> console.error(err)) */


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

function wait(seconds , resolveValue){
  return new Promise(resolve=> {
    setTimeout(()=> resolve(resolveValue), seconds*1000)
  })
}


/*
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

}) */

//Resolving / Rejecting a promise instantly________
// Promise.resolve('Resolved Instantly').then((val)=> console.log(val))
// Promise.reject('Rejected Instantly').catch(err => console.error(err))

//Promisifying geolocation API____________________


/* function getClientPosition(){
  return new Promise((resolve , reject)=> {
    // navigator.geolocation.getCurrentPosition((position)=>{
    //   resolve(position)
    // } , ()=>{
    //   reject(new Error('Unable to get the Coordinates'))
    // })

    navigator.geolocation.getCurrentPosition(resolve , () => reject(new Error('Unable to get the coordinates')))
  })
} */

/*
function whereAmI(){
  getClientPosition()
  .then(position => {
    const {latitude , longitude} = position.coords
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
  })
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

btn.addEventListener("click" , whereAmI)  */
  

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
 */

/* function createImage(imgPath){
  return new Promise((resolve , reject)=> {
    const img = document.createElement('img')
    img.setAttribute('src' , imgPath)
    
    img.addEventListener('load' , ()=> {
      imagesContainer.insertAdjacentElement("afterbegin" , img1)
      resolve(img)
    })

    img.addEventListener('error',  (e)=> {
      reject(e)
    })
  })
}
createImage(`img/img-1.jpg`)
.then(responseValue=> {
  return wait(3 , responseValue) //stopping the execution for 2 sec |returns promise with img as response
})
.then(responseValue => {

  responseValue.style.display = 'none'

  return createImage(`img/img-2.jpg`)
})
.then(responseValue => {
  return wait(3 , responseValue)
})
.then(responseValue => responseValue.style.display = 'none')
.catch(error => console.error(`Something Went wrong : ${error}`)) */

//Consuming Promises with 'Async & Await' keyword_______________________________________________________________________________

//Note: Async & Await is just syntx sugar  over then method of consumiung promises.

//'async' Keyword______ :-
//1) Using async keyword before a function makes the function asynchronous in nature.
//2) async function always returns a promise | if we return a normal value promise is fulfilled by that value | no return , then fulfilled by undefined.

//'await' Keyword______ :-
//1) await keyword can only be used inside asunc function
//2) await Promise() --> stops the execution of async function until the promise is settled and then returns with fulfilled value
//3) await (any other value) ---> immediate returns that value like in case of Promise.resolve(any other value)
//4) await also unwraps the element for the vareiable storage insid async function

//try...catch___________________________________
//used to catch any errors in code wrapped inside try block
/* 
try {

} catch {

} 
*/

//whereAmI using async / await______
/* 
const whereAmI = async function (){

  try {  
    //getting user coordinates
    const {latitude , longitude} = await new Promise((resolve  , reject)=> {
      navigator.geolocation.getCurrentPosition((position) => resolve(position.coords) ,reject )
    } )

    const dataFromCoords = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
   if(!dataFromCoords.ok){throw new Error('Unable to get country')}
    const countryData = await dataFromCoords.json()

    const countryName = countryData.countryName

    getCountryData(countryName)

    //returning a value
    return `You are in ${countryName}`
  } catch(err){
    console.error(`Something Went Wrong : ${err.message}`)
    throw err;
  }
}

btn.addEventListener('click' , whereAmI); */



//async function always returns a promise fullfilled with return value of function  
// in case of no return : promise fulfiled with undefined
//if we throw an error than that error can be handeled by the catch handler attached to promise returned by async function

/* console.log('Step 1 :')

whereAmI()
.then((res)=> {
  console.log(res)
})
.catch(err => {
  console.error(`Something Went Wrong : ${err.message}`)
})
.finally(() => console.log('Step 3')) */

//Above execution using async await

//IIFE.....

/* (async function() {

  console.log('I am first')
  try{
    
    const res = await whereAmI()
    console.log(res)
    
  } catch(err){
    console.error(`Something Went Wrong : ${err.message}`)
  }
  console.log('I am third')
})() */

//Running Promises in Parallel________________________________________________________________________________________
//If one request does not depend on others we can make multiple asynchronous calls at once

//Promise.all() method____________
//Promise.all([]array of promises) --> This is a combinator function which executes all the promises present in array at once
//Promise.all() also returns a prmomise fullfilled by an array of result of each promise in arguments array
//If any promise from arguments array is rejected , entire promise returned by Promise.all() rejected



//Function in which 3 countries passed as and log capital cities as an array

//helper function


/* const getThreeCountriesCapital = async function(c1 , c2 , c3){

  try{
  //In series : 

  // const [country1] = await getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c1}`)
  // const [country2] = await getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c2}`)
  // const [country3] = await getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c3}`)

  // console.log([country1.capital , country2.capital , country3.capital])
  
  //In parallel :

  const countriesArray = await Promise.all([
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c1}`),
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c2}`),
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/${c3}`)
  ])

  console.log(countriesArray.map(country => country[0].capital))
  } catch(e){
    console.error(`Something went wrong : ${e}`)
  }

}

getThreeCountriesCapital('Japan' , 'Russia' , 'Norway'); */

//Promise Combinator Functions___________________________

//1) Promise.all([] array of promises)_____
// Studied above

//2) Promise.race([] array of promises)______
// This method returns a promise.
// As soon as one of the promises in the promises array is settled Promise.race() returns a promise with the settled value race winning promise
//Either rejected or fulfilled doesn't matter

//Ex:
/* (async function (){
  const [raceWinner]  = await Promise.race([
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/Italy`),
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/Canada`),
    getCountryJSON(`https://corsproxy.io/?url=https://www.apicountries.com/name/Mexico`)
  ])

  console.log(raceWinner.name)
})(); */

//Usecase : Promise.race() can be use to  automatically rejects requests after a defined time if in case it is taking too much time

/* (async function (){

    try {
      const response =  await Promise.race([
      new Promise((resolve)=> {
        setTimeout(() => resolve('Promise 1 Won')  , 4000)
      }) ,
      new Promise((resolve)=> {
        setTimeout(() => resolve('Promise 2 Won')  , 5000)
      }),
      new Promise((resolve , reject)=> {
        setTimeout(()=> reject('Took too long fulfill request') , 3000)  //promise is going to rejected after 3 seconds 
      })
    ])

    console.log(response)
    } catch(e){
      console.error(e)
    }


  })() */

//3) Promise.allSettled([] array of promises)______
//Promise.allSettled() waits for all the promises in the array to get settled (rejected or fulfilled doesn't matter) and it returns an array conataining outcome of all the settled promised.

//Main dif. b/w Promise.all() and Promise.allSettled() is that first one short circuits as soons as one of array's promise is rejected

/* const res1 = Promise.allSettled([
  Promise.resolve('Promise 1 resolved'),
  Promise.resolve('Promise 2 resolved'),
  Promise.reject('Promise 3 rejected'),
  Promise.resolve('Promise 4 resolved')
])
console.log(res1)
 */

//4) Promise.any([] array of promises)______
//It returns the first resolved promise from the array unlike Promise.race() which returns the frist settled promise


/* 
const res2 = Promise.any([
  Promise.reject('Promise 1 rejected'),
  Promise.reject('Promise 2 rejected'),
  Promise.resolve('Promise 3 resolved'),
  Promise.resolve('Promise 4 resolved')
])
console.log(res2)
 */


///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
 */

///////////////////////////////////////
// Coding Challenge #3

/*
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

//Solution: Part 1


function createImage(imgPath){
  return new Promise((resolve , reject)=> {
    const img = document.createElement('img')
    img.setAttribute('src' , imgPath)
    
    img.addEventListener('load' , ()=> {
      imagesContainer.insertAdjacentElement("afterbegin" , img)
      resolve(img)
    })

    img.addEventListener('error',  (e)=> {
      reject(e)
    })
  })
}

/*
const loadNPause = async function(imgPath){


  try{
    const image1  = await createImage('img/img-1.jpg')
    await wait(3 , image1)
    image1.style.display = 'none'

    const image2 = await createImage('img/img-2.jpg')
    await wait(3 , image2)
    image2.style.display = 'none'
    

  } catch(e) {
    console.error(e)
  }

  
}
 loadNPause(`img/img-1.jpg`) */

 //Solution : Part 2

const loadAll = async function(imgPathArr){
  const imgs = imgPathArr.map(async (imgPath)=> {
    return await createImage(imgPath)
  })
  console.log(imgs)
  
  const images = await Promise.all(imgs)
  images.forEach(img => img.classList.add('parallel'))
  console.log(images)
   
}
loadAll([`img/img-1.jpg` , `img/img-2.jpg`, `img/img-3.jpg`])