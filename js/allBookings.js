/**
 * Header Documentation for this file
 * 
 * @file <allBookings.js>
 * @description this file will only run in viewAllBookings.html, this file will display commenced, future and past data in table form
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 */
"use strict";

/**
 * @function view()
 * @description after pressing index and specific data will be store, it will direct to booking detail page
 * @param {number} index 
 */
function view(index) {
    //adjust index due to sorting
    let adjust = 1;
    let store = viewData._data[index];
    let indexStore = viewData._data.length - adjust - index;
    //storing data
    updateLocalStorage(INDEX_STORE, store);
    updateLocalStorage(INDEX, indexStore);
    //redirect to view.html
    window.location = "bookingDetail.html";
}

//sort data
let hold = "";
let half = 2;
let adjustLength = 1;
//data will be exchange with a mirror line at the centre
for (let i = 0; i < viewData._data.length / half; i++) {
    hold = viewData._data[i];
    viewData._data[i] = viewData._data[viewData._data.length - adjustLength - i];
    viewData._data[viewData._data.length - adjustLength - i] = hold;
}
currentData.currentDate();
//Dom
let waitingRef = document.getElementById("waiting");
let doneRef = document.getElementById("done");
let commencedRef = document.getElementById("commenced");
let currentDay = currentData._dateBook;
let convert = 1000;
let time = new Date().toTimeString();
let sixthIndex = 5;
let currentTime = "";

//to find five minutes before and after from current time
for (let i = 0; i < sixthIndex; i++) {
    currentTime += time[i];
}
let hold1 = "";
let secondIndex = 1;
let thirdIndex = 2;
let fiveMinutesBefore = "";
let fiveMinutesAfter = "";

for (let i = 0; i < thirdIndex; i++) {
    hold1 += currentTime[i];
}
for (let i = 3; i < currentTime.length; i++) {
    hold1 += currentTime[i];
}
let hold2 = (Number(hold1) + 5).toString();
let hold3 = (Number(hold1) - 5).toString();

if (hold2.length == 4) {
    for (let i = 0; i < thirdIndex; i++) {
        fiveMinutesBefore += hold3[i];
        fiveMinutesAfter += hold2[i];
    }
    fiveMinutesAfter += ":";
    fiveMinutesBefore += ":";
    for (let i = 2; i < hold2.length; i++) {
        fiveMinutesBefore += hold3[i];
        fiveMinutesAfter += hold2[i];
    }
}
else if (hold2.length == 3) {
    for (let i = 0; i < secondIndex; i++) {
        fiveMinutesBefore += "0" + hold3[i];
        fiveMinutesAfter += "0" + hold2[i];
    }
    fiveMinutesAfter += ":";
    fiveMinutesBefore += ":";
    for (let i = 1; i < hold2.length; i++) {
        fiveMinutesBefore += hold3[i];
        fiveMinutesAfter += hold2[i];
    }
}

//assign all data into html in a table form
for (let i = 0; i < viewData._data.length; i++) {
    //all canceled data will be send to past data
    if (viewData._data[i]._status == "cancel") {
        let done = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
        ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
        ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
        ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
        </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="color">Canceled</td><td class="button_border">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button"
        onclick = "view(${i})">view</button></td></tr>`;
        doneRef.innerHTML += done;
    }
    //all data in here will be display in commenced table
    else if (viewData._data[i]._tripDate == currentDay) {
        if (viewData._data[i]._timeSelected < fiveMinutesBefore) {
            let commenced = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
        ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
        ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
        ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
        </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="color">Done</td><td class="button_border">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button"
        onclick = "view(${i})">view</button></td></tr>`;
            commencedRef.innerHTML += commenced;
        }
        else if (viewData._data[i]._timeSelected > fiveMinutesAfter) {
            let commenced = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
        ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
        ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
        ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
        </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="color">Coming soon</td><td class="button_border">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button" 
        onclick = "view(${i})">view</button></td></tr>`;
            commencedRef.innerHTML += commenced;
        }
        else {
            let commenced = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
            ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
            ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
            ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
            </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="color">In progress</td><td class="button_border">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button"
            onclick = "view(${i})">view</button></td></tr>`;
            commencedRef.innerHTML += commenced;
        }
    }
    //past data will be display in past data
    else if (viewData._data[i]._tripDate < currentDay) {
        let done = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
        ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
        ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
        ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
        </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="color">Done</td><td class="button_border">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button"
        onclick = "view(${i})">view</button></td></tr>`;
        doneRef.innerHTML += done;
    }
    //future data will be display in schedule table
    else if (viewData._data[i]._tripDate > currentDay) {
        let waiting = `<tr class="height"><td class="color">${viewData._data[i]._dateBook}</td><td class="color">
        ${viewData._data[i]._bookingNumber}</td><td class="color">${viewData._data[i]._tripDate}</td><td class="color">
        ${viewData._data[i]._pickUp.address}</td><td class="color">${viewData._data[i]._dropOff.address}</td><td class="color">
        ${viewData._data[i]._numberOfStops}</td><td class="font_size color">${(viewData._data[i]._estimatedDistance / convert).toFixed(2)} km
        </td><td class="color">RM ${(viewData._data[i]._estimatedFare).toFixed(2)}</td><td class="button_border">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent button" 
        onclick = "view(${i})">view</button></td></tr>`;
        waitingRef.innerHTML += waiting;
    }

}