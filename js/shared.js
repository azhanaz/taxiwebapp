/**
 * Header Documentation for this file
 * 
 * @file <shared.js>
 * @description This file will run in all html, it contain all the class, when user firt time use this app local storage will 
 * auto created, all data will be restore when enter each html, all calculation is included in this file, this file also contain all the
 * keys
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 * @author Mohamed Azhan Ameed Pillai mame0009@student.monash.edu
 * 
 */
"use strict";

/**
 * @key 
 * @description all key is placed here
 */

// Mapbox login info
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXpoYW4yMyIsImEiOiJja29qdzc3ZWswMDF3MnBxbnh0MXJhenkzIn0.QmpeXC1Lx1jkXkqmu3jxMw";
// Geocoding API key
const GEOCODING_KEY = "1c91a965ec5c4993831bd73c530242cf";

//constant use for key
const CURRENT_DATA = "currentBooking";
const DATA = "viewBooking";
const INDEX_STORE = "bookingIndex";
const INDEX = "index";

/**
 * @classdesc booking
 * @description all data is create in here, it also contain the main method like calculation
 */
class Booking {
    /**
     * @class constructor()
     * @return none
     */
    constructor() {
        this._taxiType = "";
        this._timeSelected = "";
        this._pickUp = "";
        this._dropOff = "";
        this._tripDate = "";
        this._estimatedDistance = 0;
        this._estimatedFare = 0;
        this._numberOfStops = 0;
        this._dateBook = "";
        this._stops = [];
        this._location = [];
        this._bookingNumber = "";
        this._status = "";
    }
    //accessor
    get taxiType() {
        return this._taxiType;
    }
    get timeSelected() {
        return this._timeSelected;
    }
    get pickUp() {
        return this._pickUp;
    }
    get dropOff() {
        return this._dropOff;
    }
    get tripDate() {
        return this._tripDate;
    }
    get estimatedDistance() {
        return this._estimatedDistance;
    }
    get estimatedFare() {
        return this._estimatedFare;
    }
    get numberOfStops() {
        return this._numberOfStops;
    }
    get dateBook() {
        return this._dateBook;
    }
    get stops() {
        return this._stops;
    }
    get location() {
        return this._location;
    }
    get bookingNumber() {
        return this._bookingNumber;
    }
    get status() {
        return this._status;
    }
    //mutator
    set taxiType(taxiType) {
        this._taxiType = taxiType;
    }
    set timeSelected(timeSelected) {
        this._timeSelected = timeSelected;
    }
    set pickUp(pickUp) {
        this._pickUp = pickUp;
    }
    set dropOff(dropOff) {
        this._dropOff = dropOff;
    }
    set tripDate(tripDate) {
        this._tripDate = tripDate;
    }
    set estimatedDistance(estimatedDistance) {
        this._estimatedDistance = estimatedDistance;
    }
    set estimatedFare(estimatedFare) {
        this._estimatedFare = estimatedFare;
    }
    set dateBook(date) {
        this._dateBook = date;
    }
    set stops(stops) {
        this._stops = stops;
    }
    set location(location) {
        this._location = location;
    }
    set bookingNumber(number) {
        this._bookingNumber = number;
    }
    set status(status) {
        this._status = status;
    }
    //method
    /**
     * @methode currentDate()
     * @description find the current date and arrange them
     * @return none
     */
    currentDate() {
        //get date only
        let today = new Date().toLocaleDateString();
        //initialise
        let lengthOfDate = today.length;
        let fullLength = 10;
        let shortLength = 8;
        let midLength = 9;
        this._dateBook = "";
        let thirdIndex = 2;
        let sixthIndex = 5;
        let secondIndex = 1;
        let fourthIndex = 3;
        let fifthIndex = 4;
        //formating date
        if (lengthOfDate == fullLength) {
            for (let i = 6; i < lengthOfDate; i++) {
                this._dateBook += today[i];
            }
            this._dateBook += "-";
            for (let i = 0; i < thirdIndex; i++) {
                this._dateBook += today[i];
            }
            this._dateBook += "-";
            for (let i = 3; i < sixthIndex; i++) {
                this._dateBook += today[i];
            }
        }
        //when month and day is single digit
        else if (lengthOfDate == shortLength) {
            for (let i = 4; i < lengthOfDate; i++) {
                this._dateBook += today[i];
            }
            this._dateBook += "-";
            for (let i = 0; i < secondIndex; i++) {
                this._dateBook += today[i];
            }
            this._dateBook += "-";
            for (let i = 2; i < fourthIndex; i++) {
                this._dateBook += today[i];
            }
        }
        else if (lengthOfDate == midLength) {
            //when month is single digit
            if (today[secondIndex] == "/") {
                for (let i = 5; i < lengthOfDate; i++) {
                    this._dateBook += today[i];
                }
                this._dateBook += "-";
                for (let i = 0; i < secondIndex; i++) {
                    //zero is added to single digit
                    this._dateBook += "0" + today[i];
                }
                this._dateBook += "-";
                for (let i = 2; i < fifthIndex; i++) {
                    this._dateBook += today[i];
                }
            }
            //when day is single digit
            else if (today[secondIndex] != "/") {
                for (let i = 5; i < lengthOfDate; i++) {
                    this._dateBook += today[i];
                }
                this._dateBook += "-";
                for (let i = 0; i < thirdIndex; i++) {
                    this._dateBook += today[i];
                }
                this._dateBook += "-";
                for (let i = 3; i < fifthIndex; i++) {
                    //zero is added to single digit
                    this._dateBook += "0" + today[i];
                }
            }
        }
    }

    /**
     * @methode calculateDistance()
     * @description use formula to calculate distance
     * @return none
     */
    calculateDistance() {
        //formula base 
        //[longitude,latitude]
        //initialise 
        let dropOff = [];
        if (this._pickUp == "") {
            for (let i = 0; i < this._stops.length; i++) {
                dropOff.push(this._stops[i]);
            }
            dropOff.push(this._dropOff);
        }
        else if (this._stops == "") {
            dropOff.push(this._pickUp);
            dropOff.push(this._dropOff);
        }
        else if (this._dropOff == "") {
            dropOff.push(this._pickUp);
            for (let i = 0; i < this._stops.length; i++) {
                dropOff.push(this._stops[i]);
            }
        }
        else {
            dropOff.push(this._pickUp);
            for (let i = 0; i < this._stops.length; i++) {
                dropOff.push(this._stops[i]);
            }
            dropOff.push(this._dropOff);
        }

        let adjustedValue = 1;
        this._estimatedDistance = 0;
        //run for many stops
        for (let i = 0; i < dropOff.length - adjustedValue; i++) {
            const RADIUS = 6371; // km
            const LATITUDE1 = dropOff[i].coordinates.lat * Math.PI / 180; // latitude in radians
            const LATITUDE2 = dropOff[i + adjustedValue].coordinates.lat * Math.PI / 180;
            const CHANGE_IN_LATITUDE = (dropOff[i + adjustedValue].coordinates.lat - dropOff[i].coordinates.lat) * Math.PI / 180;
            const CHANGE_IN_LONGITUDE = (dropOff[i + adjustedValue].coordinates.lng - dropOff[i].coordinates.lng) * Math.PI / 180;

            const HAVERSINE = Math.sin(CHANGE_IN_LATITUDE / 2) * Math.sin(CHANGE_IN_LATITUDE / 2) +
                Math.cos(LATITUDE1) * Math.cos(LATITUDE2) *
                Math.sin(CHANGE_IN_LONGITUDE / 2) * Math.sin(CHANGE_IN_LONGITUDE / 2);
            const ANGULAR_DISTANCE = 2 * Math.atan2(Math.sqrt(HAVERSINE), Math.sqrt(1 - HAVERSINE));

            this._estimatedDistance += RADIUS * ANGULAR_DISTANCE; // in km
        }
        let convertToMetre = 1000;
        this._estimatedDistance = this._estimatedDistance * convertToMetre;
    }

    /**
     * @method stops()
     * @description calculate number of stops
     * @return none
     */
    stops() {
        //initialise
        //set to zero
        let finalStop = 1;
        this._numberOfStops = 0;
        //end point and stops is included
        this._numberOfStops = finalStop + this._stops.length;
    }

    /**
     * @method calculateCost()
     * @description calculate cost for different taxi and time and date
     * @param {string} taxiType 
     * @return none
     */
    calculateCost(taxiType) {
        //initialise
        let flagRate = 3;
        let suv = 5;
        let van = 10;
        let minibus = 15;
        let distanceFare = 0.1 / 115;
        let advanceBooking = 2;
        let nightLevy = 1.5;
        let twoIndex = 2;
        let hour = "";
        //take the hour only
        for (let i = 0; i < twoIndex; i++) {
            hour += this._timeSelected[i];
        }
        //convert to number
        let time = Number(hour);
        this._taxiType = taxiType;
        //for each taxi
        if (this._taxiType == "Sedan") {
            //today
            if (this._tripDate == this._dateBook) {
                //midnight to 6 am
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + this._estimatedDistance * distanceFare) * nightLevy;
                }
                //from 6am to 12am
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + this._estimatedDistance * distanceFare;
                }
            }
            //future booking
            else if (this._tripDAte != this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + this._estimatedDistance * distanceFare + advanceBooking) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + this._estimatedDistance * distanceFare + advanceBooking;
                }
            }
        }
        //extra charges from here
        else if (this._taxiType == "SUV") {
            if (this._tripDate == this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + suv + this._estimatedDistance * distanceFare) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + suv + this._estimatedDistance * distanceFare;
                }
            }
            else if (this._tripDAte != this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + suv + this._estimatedDistance * distanceFare + advanceBooking) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + suv + this._estimatedDistance * distanceFare + advanceBooking;
                }
            }
        }
        else if (this._taxiType == "Van") {
            if (this._tripDate == this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + van + this._estimatedDistance * distanceFare) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + van + this._estimatedDistance * distanceFare;
                }
            }
            else if (this._tripDAte != this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + van + this._estimatedDistance * distanceFare + advanceBooking) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + van + this._estimatedDistance * distanceFare + advanceBooking;
                }
            }
        }
        else if (this._taxiType == "Minibus") {
            if (this._tripDate == this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + minibus + this._estimatedDistance * distanceFare) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + minibus + this._estimatedDistance * distanceFare;
                }
            }
            else if (this._tripDAte != this._dateBook) {
                if (time >= 0 && time < 6) {
                    this._estimatedFare = (flagRate + minibus + this._estimatedDistance * distanceFare + advanceBooking) * nightLevy;
                }
                else if (time >= 6 && time <= 23) {
                    this._estimatedFare = flagRate + minibus + this._estimatedDistance * distanceFare + advanceBooking;
                }
            }
        }
    }

    /**
     * @methode assign()
     * @description place the value and value is assigned to proper attribute
     * @return none
     */
    assign() {
        this._pickUp = "";
        this._dropOff = "";
        this._stops = [];
        for (let i = 0; i < this._location.length; i++) {
            if (this._location[i].name == "first") {
                this._pickUp = this._location[i];
            }
            else if (this._location[i].name == "last") {
                this._dropOff = this._location[i];
            }
            else {
                let stops = this._location[i];
                this._stops.push(stops);
            }
        }
        updateLocalStorage(CURRENT_DATA, currentData)
    }
    /**
     * @method fromData()
     * @description retore when page load, mainly restore data
     * @param {object} data 
     */
    fromData(data) {
        this._taxiType = data._taxiType;
        this._timeSelected = data._timeSelected;
        this._pickUp = data._pickUp;
        this._dropOff = data._dropOff;
        this._tripDate = data._tripDate;
        this._estimatedDistance = data._estimatedDistance;
        this._estimatedFare = data._estimatedFare;
        this._numberOfStops = data._numberOfStops;
        this._dateBook = data._dateBook;
        this._location = data._location;
        this._stops = data._stops;
        this._bookingNumber = data._bookingNumber;
        this._status = data._status;
    }
}
/**
 * @classdesc allbookings
 * @description this class is a array that hold all the booking class
 */
class AllBookings {
    constructor() {
    /**
     * @class constructor()
     * @return none
     */
        this._data = [];
    }
    //accessor 
    get data() {
        return this._data;
    }
    //method

    /**
     * @method cancelBooking()
     * @description assign cancel to status
     * @param {numebr} index 
     */
    cancelBooking(index) {
        //only given to booking that is canceled
        viewData._data[index]._status = "cancel";
    }
    /**
     * @method fromData()
     * @description restore data
     * @param {objects} arr 
     */
    //restore when reload page
    fromData(arr) {
        this._data = [];
        for (let i = 0; i < arr._data.length; i++) {
            let data = new Booking();
            data.fromData(arr._data[i]);
            this._data.push(data);
        }
    }
}

/**
 * @function checkLocalStorage()
 * @description check local storage exist or not
 * @param {string} key 
 * @returns {boolean} 
 */
function checkLocalStorage(key) {
    //initialise from localstorage
    let item = localStorage.getItem(key);
    //check exist or not
    if (item === null) {
        return false;
    }
    else if (item !== null) {
        return true;
    }
}
/**
 * @function updateLocalStorage()
 * @param {string} key 
 * @param {object} data 
 */
function updateLocalStorage(key, data) {
    //initialise the data
    //stringify
    let json = JSON.stringify(data);
    //post to local storage
    localStorage.setItem(key, json);
}

/**
 * @function retrieveData()
 * @param {string} key 
 * @returns object of the data
 */
function retrieveData(key) {
    //get local storage
    let data = localStorage.getItem(key);

    //convert to object
    try {
        data = JSON.parse(data);
    }
    catch (error) {
        //data is in string 
        console.log(error)
    }
    finally {
        return data;
    }
}
//variable that can be use
let currentData = new Booking();
let viewData = new AllBookings();
let specificData = new Booking();

//check current data in local storage
if (checkLocalStorage(CURRENT_DATA) == true) {
    //get data
    let json = retrieveData(CURRENT_DATA);
    //make back instance
    currentData.fromData(json);
}
else if (checkLocalStorage(CURRENT_DATA) == false) {
    //create a local storage
    updateLocalStorage(CURRENT_DATA, currentData);
}

//check if data in local storage
if (checkLocalStorage(DATA) == true) {
    //get data
    let json = retrieveData(DATA);
    //make back instance
    viewData.fromData(json);
}
else if (checkLocalStorage(DATA) == false) {
    //create a local storage
    updateLocalStorage(DATA, viewData);
}

if (checkLocalStorage(INDEX_STORE) == true) {
    //get data
    let json = retrieveData(INDEX_STORE);
    //make back instance
    specificData.fromData(json);
}