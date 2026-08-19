'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const mapElement = document.querySelector('#map')
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
/* 
const map = L.map('map');

navigator.geolocation.getCurrentPosition(function(location){
    console.log(location)
    const {latitude , longitude} = location.coords
    
    map.setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);



    
})


map.on('click' , function(mapObject){

    form.classList.remove('hidden')
    inputDistance.focus()

     const {lat  , lng } = mapObject.latlng
     mapElement.dataset.clickLat = lat;
     mapElement.dataset.clickLng = lng;


    
        
})

form.addEventListener("submit" , function(event){
    event.preventDefault();

    L.marker([mapElement.dataset.clickLat, mapElement.dataset.clickLng]).addTo(map)
        .bindPopup('Workout' , {
            maxWidth : 250,
            minWidth : 100,
            autoClose : false,
            closeOnClick : false,
            className : 'cycling-popup'
        })
        .openPopup();

    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""
    form.classList.add('hidden')
    
})


inputType.addEventListener('change' ,function(){
    inputDistance.focus()
    inputCadence.closest(".form__row").classList.toggle('form__row--hidden')
    inputElevation.closest(".form__row").classList.toggle('form__row--hidden')
}) */
/* 
//Refactoring our code //(myself)
class App{

    // workout array
    workouts = []

    //map rendered on webpage
    map

    //mapEventObject
    mapEvent

    #loadMap(position){

        const {latitude , longitude} = position.coords
    
        this.map = L.map('map').setView([latitude, longitude], 13);
        console.log(this.map)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        
        //adding click event handler to map
        this.map.on('click' , this.#showForm.bind(this) )
        


    }; 

    //function for getting user coordinates
    #getPosition(){
        navigator.geolocation.getCurrentPosition((location)=> {
        
        // loading map on webpage
        this.#loadMap(location);
        
    } , function(){
        console.log(`Could Not get Coordinates`)
    })};

    

    #showForm(mapEvent){
        this.mapEvent = mapEvent;

        form.classList.remove('hidden')
        inputDistance.focus();
    }

    #toggleInputType(){
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputDistance.focus()
    }

    #renderWorkoutMarker(){
        L.marker([this.mapEvent.latlng.lat, this.mapEvent.latlng.lng]).addTo(this.map)
        .bindPopup('Workout' , {
            maxWidth : 250,
            minWidth : 100,
            autoClose : false,
            closeOnClick : false,
            className : 'cycling-popup'
        })
        .openPopup();

    
    }


    #hideForm(){
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""
        form.classList.add('hidden')
    }

    #newWorkout(event){
        event.preventDefault()

        this.#renderWorkoutMarker()
        this.#hideForm()

    }

    

    

    constructor(){

        //get user position
        this.#getPosition()

        

        //adding submit event listener to form
        form.addEventListener('submit' , this.#newWorkout.bind(this))

        //adding 'change' event handler to input type
        inputType.addEventListener('change' , this.#toggleInputType.bind(this))

    }
}

const maptyApp = new App()

 */
class Workout{
    date = new Date()
    id = (Date.now() + '').slice(-10)
    clicks = 0;
    constructor(distance , duration , coords){

        this.distance = distance;  //in km
        this.duration = duration; //in min
        this.coords = coords //arr = [latitude , longitude]
        

    }

    click(){
        this.clicks++;
    }
}

class Running extends Workout {
    workoutType = 'running'
    constructor(distance , duration , coords , cadence){
        super(distance , duration , coords);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace(){

        //pace = min/km
        this.pace = this.duration / this.distance
        return this.pace;
    }
}

class Cycling extends Workout {

    workoutType = "cycling"
    constructor(distance , duration , coords , elevationGain){
        super(distance , duration , coords);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed(){

        //speed = km/min
        this.speed = (this.distance*60)/this.duration
        return this.speed
    }
}


////////////////////////////////////////////////////
//APPLICATION ARCHITECTURE //


class App{

    #map = L.map('map')
    #mapZoomLevel = 13

    workouts = []

    
    #mapEvent
    constructor(){
        this._getPosition()



        //getting local storage workouts
        this._getLocalStorage()


        form.addEventListener('submit' , this._newWorkout.bind(this))

        inputType.addEventListener('change', this._toggleElevationField )

        //Using Event Delegation
        containerWorkouts.addEventListener('click' , this._moveToPopup.bind(this))
    }
    _getPosition(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this) , ()=> {console.log(`Cannot access location`)})
    }

    _loadMap(position){
        const {latitude , longitude} = position.coords
        this.#map.setView([latitude , longitude], this.#mapZoomLevel)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click' , this._showForm.bind(this))

        this.workouts.forEach(workoutObj => {
            this._renderWorkoutMarker.call(this , workoutObj)
            
        });
    }

    _showForm(mapEvent){
        this.#mapEvent = mapEvent;

        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField(){
        inputCadence.closest(".form__row").classList.toggle('form__row--hidden')
        inputElevation.closest(".form__row").classList.toggle('form__row--hidden')
        inputDistance.focus()
    }

    _newWorkout(event){
        event.preventDefault()

        const workoutType = inputType.value;

        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        const cadence = Number(inputCadence.value);
        const elevationGain = Number(inputElevation.value);

        
        //check neg  and validate using helper functions
        if(!workoutType || !duration || !distance || (!cadence & !elevationGain)){
            alert('Inputs have to be positive numbers!')
        }
        else{

            let workoutObj

            if(workoutType === 'running'){
                workoutObj = new Running(distance , duration , [this.#mapEvent.latlng.lat , this.#mapEvent.latlng.lng] , cadence)


            }
            
            if(workoutType === 'cycling'){
                workoutObj = new Cycling(distance , duration , [this.#mapEvent.latlng.lat , this.#mapEvent.latlng.lng] , elevationGain)
                

            }

            workoutObj.latlng = this.#mapEvent.latlng
            console.log(workoutObj)

            this.workouts.push(workoutObj)
            this._hideForm()

            this._renderWorkout( workoutObj )

            this._renderWorkoutMarker(workoutObj)

            //calling function for setting up local storage
            this._setLocalStorage()
            
        }
        
        

        
    }

    _renderWorkoutMarker(workoutObj){
        let  descripStr
        if(workoutObj.workoutType === 'running'){
            descripStr = `🏃‍♂️ ${workoutObj.workoutType.toUpperCase()[0] + workoutObj.workoutType.slice(1)} on ${workoutObj.date.toLocaleString('default', { month: 'long' })} ${workoutObj.date.getDate()}`
        }
        if(workoutObj.workoutType === 'cycling'){
            descripStr = `🚴‍♀️ ${workoutObj.workoutType.toUpperCase()[0] + workoutObj.workoutType.slice(1)} on ${workoutObj.date.toLocaleString('default', { month: 'long' }) } ${workoutObj.date.getDate()}`
        }
        L.marker([workoutObj.latlng.lat, workoutObj.latlng.lng]).addTo(this.#map)
        .bindPopup(descripStr , {
            maxWidth : 250,
            minWidth : 100,
            autoClose : false,
            closeOnClick : false,
            className : `${workoutObj.workoutType}-popup`
        })
        .openPopup();

    }

    _hideForm(){

        
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""
        form.classList.add('hidden')


    }
    
    _renderWorkout(workoutObj){
        
        const htmlString = `<li class="workout workout--${workoutObj.workoutType}" data-id=${workoutObj.id}>
          <h2 class="workout__title">${workoutObj.workoutType.toUpperCase()[0] + workoutObj.workoutType.slice(1)} on ${workoutObj.date.toLocaleString('default', { month: 'long' }) } ${workoutObj.date.getDate()}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workoutObj.workoutType === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workoutObj.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workoutObj.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workoutObj.workoutType === 'running' ? workoutObj.pace : workoutObj.speed}</span>
            <span class="workout__unit">${workoutObj.workoutType === 'running' ? 'min/km' : 'km/hr'}</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${workoutObj.workoutType === 'running' ? '🦶🏼' : '⛰'}</span>
            <span class="workout__value">${workoutObj.workoutType === 'running' ? workoutObj.cadence : workoutObj.elevationGain}</span>
            <span class="workout__unit">${workoutObj.workoutType === 'running' ? 'spm' : 'm'}</span>
          </div>
        </li>`

        form.insertAdjacentHTML("afterend" , htmlString)

        // const workoutDomElement = document.querySelector(`li[data-id = "${workoutObj.id}"]`)
        // workoutDomElement.addEventListener('click' , this._moveToPopup.bind(this , workoutDomElement))
    } 
    
    
    _moveToPopup(  event /* workoutDomElement */){
        
        const workoutDomElement = event.target.closest('.workout')
        
        //guard clause
        if(!workoutDomElement) return;
        

        const workoutId = workoutDomElement.dataset.id;
        const workoutObj = this.workouts.find(workout => workout.id === workoutId);

        this.#map.setView(workoutObj.coords , this.#mapZoomLevel , {
            animate : true,
            pan : {
                duration : 1
            }
            
        })

        workoutObj.click() //using public interface on workouts.


        // const workoutId = workoutDomElement.dataset.id
        // const workoutObj = this.workouts.find(workout => workout.id === workoutId)

        // this.#map.setView(workoutObj.coords , 13 , {
        //     animate : true,
        //     duration : 0.5,
        // })



    }
    //Use of Event Delegation
    //For moving to popup on click on event in list , we were attaching event handler to each of the list dom elements as soon as they were being created.
    //But using Event delegation we don't need to add event handler to each of the dom elements in future when they are going to be created


    //function for setting up local Storage
    _setLocalStorage(){
        localStorage.setItem('workouts' , JSON.stringify(this.workouts))
    }
    _getLocalStorage(){
        let workoutsArray =  JSON.parse(localStorage.getItem('workouts'))

        if(!workoutsArray) return;
        this.workouts = workoutsArray.map(workoutObj => {
            workoutObj.date = new Date(workoutObj.date)

            if(workoutObj.workoutType === 'running'){
                Object.setPrototypeOf(workoutObj , Running.prototype)
            } else if(workoutObj.workoutType === 'cycling'){
                Object.setPrototypeOf(workoutObj , Cycling.prototype)
            }
            return workoutObj;
        })

        this.workouts.forEach(workoutObj => {
            this._renderWorkout.call(this , workoutObj)
            
        });



    }

    reset(){
        localStorage.removeItem('workouts')
        location.reload()
    }

}

const Mapty = new App()
