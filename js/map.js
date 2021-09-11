/**
 * Header Documentation for this file
 *
 * @file <map.js>
 * @description this file will only run in map.html, this file will display Map and  options to select locations as well as the Taxi type.
 * @author Mohamed Azhan Ameed Pillai mame0009@student.monash.edu
 * @author Shuta Gunraku 31024548 sgun0027@student.monash.edu
 * @author Sek Yu Heng 31109918 ysek0003@student.monash.edu
 * @author Samuel Yong 32238266 syon0008#@student.monash.edu
 */
"use strict";

// Retrieve the access token for mapbox API
mapboxgl.accessToken = MAPBOX_TOKEN;
// markers[] stores all the present markers
let markers = [];

// Display the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [101.6869, 3.1390],
    zoom: 10
});
// Add buttons for controlling the map
map.addControl(new mapboxgl.NavigationControl());

/**
 * @description Assign global variables here
 * category is to differentiate the types of location inputs. (first, last, stop(number)).
 * count is used to distribute unique ids to each input area for the stop points.
 * stoppingPointTotal is to track the number of input areas for the stop points to restrict the number of which
 * to be less than 3.
 */
let category = "";
let count = 0;
let stoppingPointTotal = 0;

/**
 * @function addStoppingLocation()
 * @description Add the input space for stopping points by using DOM manipulation.
 * Keep track of stoppingPointTotal for disabling the stopping_location_button and
 * increment count appropriately.
 * **/
function addStoppingLocation() {
    if (stoppingPointTotal <= 1) {
        stoppingPointTotal++;
        let stoppingLocationsRef = document.getElementById("stopping_locations");
        let addStoppingPointButtonRef = document.getElementById("stopping_location_button");
        let stoppingLocationHTML = `<span id="${count}">
                                        <input type="text" id="stop${count}" value="" class="location_input">
                                        <button
                                            class="booking_button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored location_input_margin20 inline_button"
                                            onclick="getData(this.parentElement.id)">Select
                                        </button>
                                        <button
                                            class="booking_button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored location_input_margin20 inline_button"
                                            onclick="deleteStoppingLocation(this.parentElement.id)">Delete
                                        </button>
                                    </span>`;
        stoppingLocationsRef.insertAdjacentHTML('beforeend', stoppingLocationHTML);
        count++;
        if (stoppingPointTotal === 2) {
            addStoppingPointButtonRef.disabled = true;
        }
    }
}

/**
 * @function deleteStoppingLocation()
 * @description Delete the selected span surrounding the input area by using DOM and
 * remove the marker for the input (if any) from markers[].
 * @param {number} position id of the span surrounding input area to be deleted.
 * **/
function deleteStoppingLocation(position) {
    stoppingPointTotal--;
    let stoppingLocationsRef = document.getElementById(`${position}`);
    stoppingLocationsRef.remove();
    // Delete the marker from the map and from the array
    for (let index in markers) {
        if (markers[index][1] === position) {
            markers[index][0].remove();
            markers.splice(index, 1);
        }
    }
    // Enable the button
    let addStoppingPointButtonRef = document.getElementById("stopping_location_button");
    addStoppingPointButtonRef.disabled = false;

    setTimeout(removeRoute,1000);
}

/**
 * @function currentLocation()
 * @description Get the user's current location by using geolocation.
 * **/
function currentLocation() {
    if (navigator.geolocation) {
        // Call getCurrentPosition with success and error callbacks
        navigator.geolocation.getCurrentPosition(succeess, error);
    }
    else {
        alert("Geolocation is not supported in your browser.");
    }
}

/**
 * @function success(position)
 * @description This function will be called if the geolocation.getCurrentPosition(succeess, error) call is successful
 * then will set the coordinates appropriately and call the geoCoding API to get the address.
 * @param position The result from the geoLocation call.
 * **/
function succeess(position) {
    category = 'first';
    let long = position.coords.longitude;
    let lat = position.coords.latitude;
    let data =
    {
        key: GEOCODING_KEY,
        q: `${lat},${long}`,
        callback: "showCurrentLocation",
        countrycode: "my"
    };
    webServiceRequest(`https://api.opencagedata.com/geocode/v1/json`, data);
}

/**
 * @function error()
 * @description This function will be called if the geolocation.getCurrentPosition(succeess, error)
 * call is unsuccessful, and shows an alert.
 * **/
function error() {
    // Could not obtain location
    alert("Current Location couldn't be obtained.");
}

/**
 * @function showCurrentLocation(response)
 * @description This function is responsible for displaying the result of the geoCoding call for
 * the user's current location on the map.
 * @param response The result from the geoCoding's API call.
 * **/
function showCurrentLocation(response) {
    if (response.status.message === "OK") {
        // Check that the response gives some location.
        if (response.results.length !== 0) {
            for (let index in markers) {
                // Remove the previous marker for pickup location if any.
                if (markers[index][1] === 'first') {
                    markers[index][0].remove();
                    markers.splice(index, 1);
                }
            }
            // Get the address and coordinates for the current location and display.
            let address = response.results[0]["formatted"];
            let currentLong = response.results[0].geometry["lng"];
            let currentLat = response.results[0].geometry["lat"];
            document.getElementById("city1").value = address;
            map.setCenter([currentLong, currentLat]);
            let marker = null;
            marker = new mapboxgl.Marker();
            // Add to markers[] to track marker data
            markers.push([marker, category, address]);
            marker.setLngLat([currentLong, currentLat]);
            marker.addTo(map);
        }
        else if (response.results.length === 0) {
            alert("Our application is currently unavailable in your location.");
        }

    }
    else {
        alert("Current Location seems invalid. Check your network and try again.");
    }
}

/**
 * @function webServiceRequest()
 * @description Use the parameter and create web service request and make a call.
 * @param url URL for the service request.
 * @param data Data to be attached to the call.
 * **/
function webServiceRequest(url, data) {
    // Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (params.length === 0) {
                // First parameter starts with '?'
                params += "?";
            } else {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
        }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

/**
 * @function getData()
 * @description This function gets user input for the locations and check the input type.
 * Then create a data object using the input and make a call to webServiceRequest().
 * @param type Indicates the input type (first, last, stop(number)).
 * **/
function getData(type) {
    // Delete markers based on their type
    for (let index in markers) {
        if (markers[index][1] === type) {
            markers[index][0].remove();
            markers.splice(index, 1);
        }
    }
    let locationListRef = document.getElementById("locationList");
    let html = `<option value="">`;
    locationListRef.innerHTML = html;
    let data = null;
    category = type;
    if (type === 'first') {
        let city1Ref = document.getElementById("city1");
        let city1 = city1Ref.value;
        data =
        {
            key: GEOCODING_KEY,
            q: city1,
            callback: "showData",
            // only available in Malaysia
            countrycode: "my"
        };
    }
    else if (type === 'last') {
        let city2Ref = document.getElementById("city2");
        let city2 = city2Ref.value;
        data =
        {
            key: GEOCODING_KEY,
            q: city2,
            callback: "showData",
            countrycode: "my"
        };
    }
    else {
        let stopLocationRef = document.getElementById(`stop${type}`);
        let stopLocation = stopLocationRef.value;
        data =
        {
            key: GEOCODING_KEY,
            q: stopLocation,
            callback: "showData",
            countrycode: "my"
        };
    }
    webServiceRequest(`https://api.opencagedata.com/geocode/v1/json`, data);

    setTimeout(removeRoute,1000);
}

/**
 * @function showData()
 * @description This function receives the response from geoCoding, gets the coordinates from there,
 * checks the category, and displays the marker accordingly.
 * @param response The response from the geoCoding call.
 * **/
function showData(response) {
    // setting up the mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    let results = response.results;
    let address = results[0]["formatted"];
    let pickup_latitude = results[0].geometry["lat"];
    let pickup_longitude = results[0].geometry["lng"];
    let marker = null;
    // Check the input location type by category
    if (category === "last") {
        marker = new mapboxgl.Marker({ color: 'red' });
    }
    else if (category === "first") {
        marker = new mapboxgl.Marker();
    }
    else {
        marker = new mapboxgl.Marker({ color: 'green', rotation: 70 });
    }
    // Add to markers[] to track marker data
    markers.push([marker, category, address]);
    marker.setLngLat([pickup_longitude, pickup_latitude]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`${results[0].formatted}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    // Set the bounds so that all the markers will be displayed inside the map.
    let arrayLng = [];
    let arrayLat = [];
    for (let j = 0; j < markers.length; j++) {
        arrayLng[j] = markers[j][0]._lngLat.lng;
        arrayLat[j] = markers[j][0]._lngLat.lat;
        let maxLng = Math.max(...arrayLng);
        let minLng = Math.min(...arrayLng);
        let maxLat = Math.max(...arrayLat);
        let minLat = Math.min(...arrayLat);
        map.fitBounds([[minLng - 0.2, minLat - 0.2], [maxLng + 0.2, maxLat + 0.2]]);
    }
}

/**
 * @function confirmation()
 * @description This function will be called by the confirmation button.
 * After input validation, gets the input data properly from markers[] into currentData.
 * **/
function confirmation() {
    let taxiTypeRef = document.getElementById("taxiType");
    let taxiType = taxiTypeRef.value;
    let start = document.getElementById("city1").value;
    let final = document.getElementById("city2").value;
    let stop = document.getElementById("stop0");
    let startToEnd = 2;
    //inform user
    if (taxiType === "-") {
        alert("Please select a taxi type");
    }
    else if (start == "" && final == "") {
        alert("Please fill in the pick up location and drop off location");
    }
    else if (start == "") {
        alert("Please fill in the pick up location");
    }
    else if (final == "") {
        alert("Please fill in the drop off location");
    }
    else if (markers == "") {
        alert("Please press select");
    }
    else if (markers != "") {
        let pick = "";
        let drop = "";
        let secondIndex = 1;
        for (let i = 0; i < markers.length; i++) {
            if (markers[i][secondIndex] == "first") {
                pick += markers[i][secondIndex];
            }
            else if (markers[i][secondIndex] == "last") {
                drop += markers[i][secondIndex];
            }
        }
        if (pick == "" && drop == "") {
            alert("Please press select for pick up location and drop off location");
        }
        else if (pick == "") {
            alert("Please press select for pick up location");
        }
        else if (drop == "") {
            alert("Please press select for drop off location");
        }
        else if (stop == null) {
            let to_confirmation = confirm("Do you want to proceed to confirmation?");
            if (to_confirmation) {
                //extract data needed
                markers.sort();
                let firstIndex = 0;
                let secondIndex = 1;
                let thirdIndex = 2;
                currentData._location = [];
                for (let i = 0; i < markers.length; i++) {
                    let extract = {
                        name: markers[i][secondIndex],
                        address: markers[i][thirdIndex],
                        coordinates: markers[i][firstIndex]._lngLat
                    };
                    currentData._location.push(extract);
                }
                currentData._taxiType = taxiType;
                currentData.assign();
                //direct to confirmation page
                window.location = "confirmation.html";
            }
        }
        else if (stop != null) {
            for (let i = 0; i < count; i++) {
                if (document.getElementById(`stop${i}`).value == "") {
                    alert("Please fill in location in the stop section");
                    return null;
                }
            }

            for (let i = 0; i < count; i++) {
                if (markers.length != (count + startToEnd)) {
                    alert("Please press select for the add location section")
                    return null;
                }
            }
            if (markers.length == (count + startToEnd)) {
                let to_confirmation = confirm("Do you want to proceed to confirmation?");
                if (to_confirmation) {
                    //extract confirmation needed
                    markers.sort();
                    let firstIndex = 0;
                    let secondIndex = 1;
                    let thirdIndex = 2;
                    currentData._location = [];
                    for (let i = 0; i < markers.length; i++) {
                        let extract = {
                            name: markers[i][secondIndex],
                            address: markers[i][thirdIndex],
                            coordinates: markers[i][firstIndex]._lngLat
                        };
                        currentData._location.push(extract);
                    }
                    currentData._taxiType = taxiType;
                    currentData.assign();
                    //direct to date page
                    window.location = "confirmation.html";
                }
            }
        }
    }
}

/**
 * @function back()
 * @description This function will be called when the back button is clicked.
 * **/
function back() {
    let warning = confirm("If you press ok all the data will be deleted");
    if (warning == true) {
        window.location = 'index.html';
    }
}
//create different id
let differentId = 0;

/**
 * @function displayRoute()
 * @description this function will display route
 */
function displayRoute() {
    //initialise
    let firstLength = 2;
    //only run when location selected is more than 1
    if (markers.length >= firstLength) {
        let firstIndex = 0;
        let secondIndex = 1;
        let thirdIndex = 2;
        let dropOff = [];

        //arrange data
        markers.sort();

        currentData._location = [];
        for (let i = 0; i < markers.length; i++) {
            let extract = {
                name: markers[i][secondIndex],
                address: markers[i][thirdIndex],
                coordinates: markers[i][firstIndex]._lngLat
            };
            currentData._location.push(extract);
        }

        currentData.assign();

        if (currentData._pickUp == "") {
            for (let i = 0; i < currentData._stops.length; i++) {
                dropOff.push(currentData._stops[i]);
            }
            dropOff.push(currentData._dropOff);
        }
        else if (currentData._stops == "") {
            dropOff.push(currentData._pickUp);
            dropOff.push(currentData._dropOff);
        }
        else if (currentData._dropOff == "") {
            dropOff.push(currentData._pickUp);
            for (let i = 0; i < currentData._stops.length; i++) {
                dropOff.push(currentData._stops[i]);
            }
        }
        else {
            dropOff.push(currentData._pickUp);
            for (let i = 0; i < currentData._stops.length; i++) {
                dropOff.push(currentData._stops[i]);
            }
            dropOff.push(currentData._dropOff);
        }

        currentData.calculateDistance();

        mapboxgl.accessToken = MAPBOX_TOKEN;
        let path = {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: []
                }
            }
        };
        
        //assign coordinates
        for (let i = 0; i < dropOff.length; i++) {
            path.data.geometry.coordinates.push([dropOff[i].coordinates.lng, dropOff[i].coordinates.lat]);
        }


        //only run when no route
        if (map.getLayer('route')) {

        }
        else {
            map.addSource(`way${differentId}`, path);

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': `way${differentId}`,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff9500',
                    'line-width': 8
                }
            });
            differentId++
        }

    }

}

/**
 * @function removeRoute()
 * @description remove route
 */
function removeRoute(){
    //remove layer if exist
    if (map.getLayer('route')) {
        map.removeLayer('route');
    }
}

//update layer constantly
setInterval(displayRoute, 1000);