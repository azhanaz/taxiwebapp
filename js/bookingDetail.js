/**
 * Header Documentation for this file
 * 
 * @file <map.js>
 * @description this file will only run in map.html, this file will display Map and  options to select locations as well as the Taxi type.
 * @author Mohamed Azhan Ameed Pillai mame0009@student.monash.edu
 * @author Shuta Gunraku 31024548 sgun0027@student.monash.edu
 * @author Samuel Yong 32238266 syon0008@student.monash.edu
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 */
"use strict";
let getDetails = localStorage.getItem(INDEX_STORE);
let getDetailsObject = JSON.parse(getDetails);
let estimatedDistanceObject = getDetailsObject._estimatedDistance;
let estimatedFareObject = getDetailsObject._estimatedFare;
let timeString = getDetailsObject._timeSelected;
let tripDateObject = getDetailsObject._tripDate;
let buttonRef = document.getElementById("button");

let data = viewData._data;
let index = 0;

for (let i = 0; i < data.length; i++) {
    if (data[i]._timeSelected == timeString && data[i]._estimatedDistance == estimatedDistanceObject && data[i]._estimatedFare == estimatedFareObject) {
        index += i;
    }
}

let date = new Date();
let currentTime = date.toLocaleTimeString();
let currentDate = date.toLocaleDateString();

/**
 * @param {array} currentTimeSplit
 * @description This parameter seperates the current hour and minute from each other (to be used to find the difference in time). e.g. "10:37:02 AM" will be converted to ["10", "37", "02 AM"].
 * **/
let currentTimeSplit = currentTime.split(":");

/**
 * @param {array} timeSplit
 * @description This parameter seperates the selected hour and minute from the selected from each other (to be used to find the difference in time).
 * **/
let timeSplit = timeString.split(":");

/**
 * @param {array} timeSplitHour
 * @description This parameter obtains the hour from the selected time as it might need to be converted to the 12 hour system.
 * **/
let timeSplitHour = (parseInt(timeSplit[0], 10));


/**
 * @param timeSplitEdit current time for hours
 * @description This ensures the current hours for current time is given based on a 12 hour system. e.g. 23:00, the hour 23 will be converted to 11.
 * **/
let timeSplitEdit = 0;
if (timeSplitHour >= 12) {
    timeSplitEdit += timeSplitHour - 12;
}
else {
    timeSplitEdit += timeSplitHour;
}



/**
 * @param {array} currentDateSplit
 * @description This parameter seperates the current year, month and day from each other (to be used to find the difference in time). e.g. "5/21/2021" will be converted to ["5", "21", "2021"].
 * **/
let currentDateSplit = currentDate.split("/");

/**
 * @param {array} dateSplit
 * @description This parameter seperates the year, month and day of the selected time for taxi ride from each other (to be used to find the difference in time).
 * **/
let dateSplit = tripDateObject.split("-");

/**
 * @param {number} dateDifferenceYear
 * @description This parameter finds the difference between year of selected time for taxi ride and year of current time in minutes. 
 * **/
let dateDifferenceYear = (parseInt(dateSplit[0], 10) * 365.25 * 24 * 60) - (parseInt(currentDateSplit[2], 10) * 365.25 * 24 * 60);

/**
 * @param {number} dateDifferenceMonth
 * @description This parameter finds the difference between month of selected time and month of current time in minutes. 
 * **/
let dateDifferenceMonth = (parseInt(dateSplit[1], 10) * 30.42 * 24 * 60) - (parseInt(currentDateSplit[0], 10) * 30.42 * 24 * 60);

/**
 * @param {number} dateDifferenceDay
 * @description This parameter finds the difference between day of selected time and day of current time in minutes. 
 * **/
let dateDifferenceDay = (parseInt(dateSplit[2], 10) * 24 * 60) - (parseInt(currentDateSplit[1], 10) * 24 * 60);

/**
 * @param {number} dateDifference
 * @description This parameter finds the difference between date of selected time and date of current time in minutes. (This parameter does not include the time)
 * **/
let dateDifference = dateDifferenceYear + dateDifferenceMonth + dateDifferenceDay;

/**
 * @param {number} timeDifference
 * @description This parameter finds the difference between the time of selected time and time of current time in minutes. (This parameter does not include the date) 
 * **/
let timeDifference = ((timeSplitEdit * 60) - (parseInt(currentTimeSplit[0], 10) * 60)) + ((parseInt(timeSplit[1], 10)) - (parseInt(currentTimeSplit[1], 10)));

/**
 * @param {number} totalDifference
 * @description This parameter adds the difference in date and difference in time together to find the total difference in time between selected time and and current time 
 * **/
let totalDifference = dateDifference + timeDifference;

/**
 * @function cancel()
 * @description This function cancels future bookings and moves the data to the list of cancelled bookings
 */
function cancel() {
    if (confirm("Click ok to cancel this booking")) {
        if (totalDifference > 10) {
            //let bookingIndex = parseInt(getCancelIndex, 10);
            //console.log(bookingIndex);
            let position = Number(localStorage.getItem(INDEX));
            viewData.cancelBooking(position);
            updateLocalStorage(DATA, viewData);
            alert`Booking cancelled!`;
            window.location.replace("viewAllBookings.html");
        }
        else if (totalDifference >= 0) {
            alert`Cannot cancel pending rides that are less than 10 minutes!`;
        }
        else {
            alert`This ride is already over (check status)!`;
        }
    }
}

/**
 * @function selectedDetails()
 * @description This function will be loaded when the page runs to display the necessary info of the selected data from the viewAllBookings page.
 */
window.onload = function selectedDetails() {
    let bookingDateRef = document.getElementById("bookingDate");
    let bookingNumberRef = document.getElementById("bookingNumber");
    let tripDateRef = document.getElementById("tripDate");
    let pickUpRef = document.getElementById("pickUp");
    let stopsLocationRef = document.getElementById("stopsLocations");
    let finalDestinationRef = document.getElementById("finalDestination");
    let stopsRef = document.getElementById("stops");
    let estimatedDistanceRef = document.getElementById("estimatedDistance");
    let totalCostRef = document.getElementById("totalCost");
    let timeSelectedRef = document.getElementById("timeSelected");
    let statusRef = document.getElementById("status");


    let bookingDateObject = getDetailsObject._dateBook;
    let bookingNumberObject = getDetailsObject._bookingNumber;  
    let locationObject = getDetailsObject._location;
    let stopsLocationObject = getDetailsObject._stops;

    bookingDateRef.innerHTML = "";
    bookingNumberRef.innerHTML = "";
    tripDateRef.innerHTML = "";
    pickUpRef.innerHTML = "";
    stopsLocationRef.innerHTML = "";
    finalDestinationRef.innerHTML = "";
    stopsRef.innerHTML = "";
    estimatedDistanceRef.innerHTML = "";
    totalCostRef.innerHTML = "";
    statusRef.innerHTML = ""


    let pickUpAddress = getDetailsObject._pickUp.address;
    let numberOfStops = getDetailsObject._numberOfStops;
    let finalDestinationAddress = getDetailsObject._dropOff.address;


    if (locationObject.length > 2) {
        pickUpRef.innerHTML += `${pickUpAddress}`;
        for (let i = 0; i < stopsLocationObject.length; i++) {
            stopsLocationRef.innerHTML += `${stopsLocationObject[i].address}` + `<br>`;
        }
        finalDestinationRef.innerHTML += `${finalDestinationAddress}`;
    }
    else {
        pickUpRef.innerHTML += `${pickUpAddress}`;
        stopsLocationRef.innerHTML += `No stops in taxi ride!`
        finalDestinationRef.innerHTML += `${finalDestinationAddress}`;
    }

    if (totalDifference < 0) {
        statusRef.innerHTML += `Done`;
    }
    else if (getDetailsObject._status == "" && totalDifference >= 0) {
        statusRef.innerHTML += `Pending`;
    }
    else if (getDetailsObject._status == "cancel") {
        statusRef.innerHTML += `CANCELLED`;
    }



    bookingDateRef.innerHTML += `${bookingDateObject}`;
    bookingNumberRef.innerHTML += `${bookingNumberObject}`;
    tripDateRef.innerHTML += `${tripDateObject}`;
    stopsRef.innerHTML += `${numberOfStops}`;
    timeSelectedRef.innerText = specificData._timeSelected;

    let convert = 1000; //Used to convert distance to kilometers.
    estimatedDistanceRef.innerHTML += `${(estimatedDistanceObject / convert).toFixed(2)} km`;

    totalCostRef.innerHTML += `RM ${estimatedFareObject.toFixed(2)}`;


//The logic statement below will disable cancel button if the selected data was already cancelled.
    if (getDetailsObject._status == "cancel") {
        buttonRef.disabled = true;
        buttonRef.innerHTML = "CANCELLED";
    }
    else if (totalDifference < 0) {
        buttonRef.disabled = true;
    }
}



/**
 * @function displayVehicle()
 * @description This function displays the selected taxi type and allows user to change taxi type if they intend to.
 */
function displayVehicle() {
    let taxiTypeRef = document.getElementById("chooseTaxi");
    taxiTypeRef.value = specificData._taxiType;

    if (getDetailsObject._status == "cancel") {
        taxiTypeRef.disabled = true;
    }
    else if (totalDifference < 0) {
        taxiTypeRef.disabled = true;
    }

}

/**
 * @function cost()
 * @description This function displays the cost of the ride.
 */
function cost() {
    let taxiTypeRef = document.getElementById("chooseTaxi").value;
    let costRef = document.getElementById("totalCost");
    specificData.calculateCost(taxiTypeRef);
    costRef.innerHTML = `RM ${(specificData._estimatedFare).toFixed(2)}`;
}

/**
 * @function back()
 * @description This function brings the user back to the viewAllBookings page and updates the necessary data.
 */
function back() {
    let i = localStorage.getItem(INDEX);
    if (viewData._data[i]._bookingNumber == specificData._bookingNumber) {
        viewData._data[i] = specificData;
        updateLocalStorage(DATA, viewData);
    }
    window.location = "viewAllBookings.html"
}
setTimeout(displayVehicle, 500);
setInterval(cost, 500);
//map
mapboxgl.accessToken = MAPBOX_TOKEN;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});
//initialise 
let pickUpLatitude = specificData._pickUp.coordinates.lat;
let pickUpLongitude = specificData._pickUp.coordinates.lng;
let dropOffLatitude = specificData._dropOff.coordinates.lat;
let dropOffLongitude = specificData._dropOff.coordinates.lng;

//The logic below displays the path of the taxi ride
if (specificData._stops.length == 0) {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [pickUpLongitude, pickUpLatitude],
        zoom: 10
    });

    map.on('load', function () {
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [pickUpLongitude, pickUpLatitude],
                        [dropOffLongitude, dropOffLatitude],
                    ]
                }
            }
        });
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff9500',
                'line-width': 8
            }
        });
    });

    
    //Line 325 to 339 will adjust the map according to the pickUp location, dropOff location and stops location.
    let arrayLng = [];
    let arrayLat = [];

    arrayLng[0] = pickUpLongitude;
    arrayLat[0] = pickUpLatitude;

    
    for (let j = 0; j < specificData._stops.length; j++)
    {
        let incrementIndexByOne = 1;    
        arrayLng[j + incrementIndexByOne] = specificData._stops[j].coordinates.lng;
        arrayLat[j + incrementIndexByOne] = specificData._stops[j].coordinates.lat;
    }

        
    arrayLng[arrayLng.length] = dropOffLongitude;
    arrayLat[arrayLat.length] = dropOffLatitude;

    let maxLng = Math.max(...arrayLng);
    let minLng = Math.min(...arrayLng);
    let maxLat = Math.max(...arrayLat);
    let minLat = Math.min(...arrayLat);


    map.fitBounds([[minLng - 0.1, minLat - 0.1], [maxLng + 0.1, maxLat + 0.1]]);


    let pickupMarker = new mapboxgl.Marker({});
    pickupMarker.setLngLat([pickUpLongitude, pickUpLatitude]);
    // marker.setPopup(popup);
    pickupMarker.addTo(map);
    let dropoffMarker = new mapboxgl.Marker({ color: 'red' });
    dropoffMarker.setLngLat([dropOffLongitude, dropOffLatitude]);
    // marker.setPopup(popup);
    dropoffMarker.addTo(map);
}
else if (specificData._stops.length != 0) {
    let minLength = 1;
    let maxLength = 2;
    let firstIndex = 0;
    let secondIndex = 1;

    if (specificData._stops.length == minLength) {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [pickUpLongitude, pickUpLatitude],
            zoom: 10
        });

        map.on('load', function () {
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [pickUpLongitude, pickUpLatitude],
                            [specificData._stops[firstIndex].coordinates.lng, specificData._stops[firstIndex].coordinates.lat],
                            [dropOffLongitude, dropOffLatitude],
                        ]
                    }
                }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff9500',
                    'line-width': 8
                }
            });
        });
        let pickupMarker = new mapboxgl.Marker({});
        pickupMarker.setLngLat([pickUpLongitude, pickUpLatitude]);
        // marker.setPopup(popup);
        pickupMarker.addTo(map);
        let dropoffMarker = new mapboxgl.Marker({ color: 'red' });
        dropoffMarker.setLngLat([dropOffLongitude, dropOffLatitude]);
        // marker.setPopup(popup);
        dropoffMarker.addTo(map);
        let stopMarker = new mapboxgl.Marker({ color: 'green' });
        stopMarker.setLngLat([specificData._stops[firstIndex].coordinates.lng, specificData._stops[firstIndex].coordinates.lat]);
        // marker.setPopup(popup);
        stopMarker.addTo(map);

        //Line 410 to 435 will adjust the map according to the pickUp location, dropOff location and stops location.
        let arrayLng = [];
        let arrayLat = [];

        arrayLng[0] = pickUpLongitude;
        arrayLat[0] = pickUpLatitude;

    
        for (let j = 0; j < specificData._stops.length; j++)
        {
            let incrementIndexByOne = 1;    
            arrayLng[j + incrementIndexByOne] = specificData._stops[j].coordinates.lng;
            arrayLat[j + incrementIndexByOne] = specificData._stops[j].coordinates.lat;
        }

        
        arrayLng[arrayLng.length] = dropOffLongitude;
        arrayLat[arrayLat.length] = dropOffLatitude;

        let maxLng = Math.max(...arrayLng);
        let minLng = Math.min(...arrayLng);
        let maxLat = Math.max(...arrayLat);
        let minLat = Math.min(...arrayLat);


        map.fitBounds([[minLng - 0.1, minLat - 0.1], [maxLng + 0.1, maxLat + 0.1]]);

    }

    else if (specificData._stops.length == maxLength) {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [pickUpLongitude, pickUpLatitude],
            zoom: 10
        });

        map.on('load', function () {
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [pickUpLongitude, pickUpLatitude],
                            [specificData._stops[firstIndex].coordinates.lng, specificData._stops[firstIndex].coordinates.lat],
                            [specificData._stops[secondIndex].coordinates.lng, specificData._stops[secondIndex].coordinates.lat],
                            [dropOffLongitude, dropOffLatitude],
                        ]
                    }
                }
            });
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff9500',
                    'line-width': 8
                }
            });
        });


        let pickupMarker = new mapboxgl.Marker({});
        pickupMarker.setLngLat([pickUpLongitude, pickUpLatitude]);
        // marker.setPopup(popup);
        pickupMarker.addTo(map);
        let dropoffMarker = new mapboxgl.Marker({ color: 'red' });
        dropoffMarker.setLngLat([dropOffLongitude, dropOffLatitude]);
        // marker.setPopup(popup);
        dropoffMarker.addTo(map);
        for (let i = 0; i < specificData._stops.length; i++) {
            let stopMarker = new mapboxgl.Marker({ color: 'green' });
            stopMarker.setLngLat([specificData._stops[i].coordinates.lng, specificData._stops[i].coordinates.lat]);
            // marker.setPopup(popup);
            stopMarker.addTo(map);
        }

        //Line 496 to 521 will adjust the map according to the pickUp location, dropOff location and stops location.
        let arrayLng = [];
        let arrayLat = [];

        arrayLng[0] = pickUpLongitude;
        arrayLat[0] = pickUpLatitude;

    
        for (let j = 0; j < specificData._stops.length; j++)
        {
            let incrementIndexByOne = 1;    
            arrayLng[j + incrementIndexByOne] = specificData._stops[j].coordinates.lng;
            arrayLat[j + incrementIndexByOne] = specificData._stops[j].coordinates.lat;
        }

        
        arrayLng[arrayLng.length] = dropOffLongitude;
        arrayLat[arrayLat.length] = dropOffLatitude;

        let maxLng = Math.max(...arrayLng);
        let minLng = Math.min(...arrayLng);
        let maxLat = Math.max(...arrayLat);
        let minLat = Math.min(...arrayLat);


        map.fitBounds([[minLng - 0.1, minLat - 0.1], [maxLng + 0.1, maxLat + 0.1]]);

    }
}
