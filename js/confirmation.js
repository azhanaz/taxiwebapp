/**
 * Header Documentation for this file
 * 
 * @file <confirmation.js>
 * @description this file will only run in confirmation.html, this file contain funtion that display the booking data and 
 * function that allow user to book, go back and cancel.
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 * @author Shuta Gunraku 31024548 sgun0027@student.monash.edu
 */
"use strict";

/**
 * @function back()
 * @description this function will load when the user press back button, a confirmation will show up 
 * user will be direct to map page if confirmed
 */
function back() {
    let warning = confirm("If you press ok location will be delete");
    if (warning == true) {
        //direct to map
        window.location = "map.html";
    }
}

/**
 * @function cancel()
 * @description this function will run when cancel button is pressed, confirmation will pop up, if it is confirm all 
 * data created will be deleted, excluding saved data in view all booking, user will be direct to home page if confirmed
 */
function cancel() {
    let check = confirm("Are you sure you want to cancel this booking?");
    if (check == true) {
        //store to local storage
        updateLocalStorage(CURRENT_DATA, new Booking());
        //direct to booking
        window.location = "index.html";
    }
}

/**
 * @function book()
 * @description after user confirm all data will be save to a new local storage (DATA), the data created previously will be deleted
 * it will direct user to view all booking page
 */
function book() {
    let placeBooking = confirm("Do you want to make the booking?");
    //if click ok
    if (placeBooking == true) {
        updateLocalStorage(CURRENT_DATA, new Booking());
        viewData._data.push(currentData);
        updateLocalStorage(DATA, viewData);
        //direct to view all bookings
        window.location = "viewAllBookings.html";
    }
}

/**
 * @function displayVehicle()
 * @description this function will desplay taxitype choosen previously in map
 */
function displayVehicle() {
    let taxiTypeRef = document.getElementById("chooseTaxi");
    taxiTypeRef.value = currentData._taxiType;
}

/**
 * @function display()
 * @description this function will call most of the methoed in booking class and display the data to html
 */
function display() {
    //Dom
    let dateAndTimeRef = document.getElementById("bookingDate");
    let finalDestinationRef = document.getElementById("finalDestination");
    let stopsRef = document.getElementById("stops");
    let distanceRef = document.getElementById("estimatedDistance");
    let pickUpRef = document.getElementById("pickUp");
    let stopsLocationRef = document.getElementById("stopsLocations");
    let totalCostRef = document.getElementById("totalCost");
    let taxiTypeRef = document.getElementById("chooseTaxi");
    let noStops = 0;
    let convertBackToKm = 1000;
    let address = `<div>`;

    //run all method
    currentData.currentDate();
    currentData.calculateDistance();
    currentData.stops();
    currentData.calculateCost(taxiTypeRef.value);

    //assign
    dateAndTimeRef.innerText = `${currentData._dateBook}, ${currentData._timeSelected}`;
    finalDestinationRef.innerText = currentData._dropOff.address;
    stopsRef.innerText = currentData._numberOfStops;
    distanceRef.innerText = `${(currentData._estimatedDistance / convertBackToKm).toFixed(2)}km`;
    pickUpRef.innerText = currentData._pickUp.address;
    totalCostRef.innerText = `RM${currentData._estimatedFare.toFixed(2)}`;

    if (currentData._stops.length > noStops) {
        for (let i = 0; i < currentData._stops.length; i++) {
            let location = `<span>${currentData._stops[i].address}</span>`;
            address += location;
        }
    }
    else {
        address += `<span>No additional stops</span>`
    }
    address += `</div>`;
    stopsLocationRef.innerHTML = address;
    //give number 
    let one = 1;
    currentData._bookingNumber = viewData._data.length + one;
}

setTimeout(displayVehicle, 500);
//update the cost when taxi type changes
setInterval(display, 500);