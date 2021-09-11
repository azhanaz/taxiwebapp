/**
 * Header Documentation for this file
 * 
 * @file <main.js>
 * @description this file will only run in index.html, this file will allow user to start booking a taxi ride by selecting time first.
 * @author Samuel Yong Hui Ming syon0008@student.monash.edu
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 */

"use strict"


/**
 * @function liveClock()
 * @description This function will display the live time.
 * **/
function liveClock() {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let second = date.getSeconds();
    let meridiem = "";
    // Check if it's before or afternoon
    if (hour < 12) {
        meridiem = "AM";
    }
    else {
        hour -= 12;
        meridiem = "PM";
    }
    // Add 0 in front if the value has only 1 digit
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    second = second < 10 ? "0" + second : second;
    let currentTime = `${hour}:${min}:${second} ${meridiem}`;
    let currentTimeRef = document.getElementById("currentTime");
    currentTimeRef.innerText = currentTime;
}

// First time call so that there'll be no delay for the clock to show up after loading.
liveClock();
// Call every 1000 ms
const UPDATE_TIME_MS = 1000;
setInterval(liveClock, UPDATE_TIME_MS);

//Click "Make a booking" button and call function showButtons

/**
 * @function showButtons()
 * @description This function will the button for selecting time after clicking the "Make a booking" button and the "Make a booking" button will be disabled.
 * **/
function showButtons() {
    let makeBookingRef = document.getElementById("makeBooking");
    let showButtonsRef = document.getElementById("showButtons");

    makeBookingRef.disabled = true;

    showButtonsRef.innerHTML =
        `<div class="mdl-grid">
            <!--Row 3-->
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet center_div">
            <p class="text1">Select the booking Date and Time.</p>
            </div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
        </div>
        
        <div class="mdl-grid">
            <!--Row 4-->
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet center_div">
                <input id="timeButton" class="time_button" type="datetime-local">
            </div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
        </div>
        
        <div class="mdl-grid">
            <!--Row 5-->
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet center_div">
                <button onclick="selectLocation()" id="selectLocation" 
                    class="select_location_button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Select
                    location</button>
            </div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
        </div>

        <div class="mdl-grid">
            <!--Row 6-->
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet center_div">
            </div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet"></div>
        </div>`;

}

let array = [];

/**
 * @function selectLocation()
 * @description This function will check for the validation of the selected time when "select location" button is clicked.
 * **/
function selectLocation() {
    let timeButtonRef = document.getElementById("timeButton");
    let timeButton = timeButtonRef.value;
    let msg = "";

    if (timeButton === "") {
        msg += "Please select an appropriate time";
    }
    if (msg.length !== 0) {
        alert(msg);
        return false;
    }
    // Convert the time input into Date object from string
    let inputDateTime = new Date(timeButtonRef.value);
    // Get the current time
    let intervalDateTime = new Date();
    // Increment by 1 minute
    intervalDateTime.setMinutes(intervalDateTime.getMinutes() + 1);
    let condition = inputDateTime > intervalDateTime;
    if (condition) {
        array += timeButton;
        let date = "";

        for (let j = 0; j < 10; j++) {
            date += `${array[j]}`;
        }

        let time = "";

        for (let i = 11; i < 16; i++) {
            time += `${array[i]}`;
        }

        // currentData._taxiType = taxiType;
        currentData._tripDate = date;
        currentData._timeSelected = time;

        updateLocalStorage(CURRENT_DATA, currentData);

        window.location.replace("map.html");
    }
    else {
        let msg = "The booking time is invalid.\nPlease choose a time that is at least 1 minute ahead from now."
        alert(msg);
        return condition;
    }
}


