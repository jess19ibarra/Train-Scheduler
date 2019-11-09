var config = {
    apiKey: "AIzaSyBKGX5KCkAXKLr8W_39ao3yy6Db460wVk8",
    authDomain: "choochoo-c376e.firebaseapp.com",
    databaseURL: "https://choochoo-c376e.firebaseio.com",
    projectId: "choochoo-c376e",
    storageBucket: "choochoo-c376e.appspot.com",
    messagingSenderId: "294362656567",
    appId: "1:294362656567:web:bebc64dca7bea15b01b4b2",
    measurementId: "G-11KN482Q6B",
};

firebase.initializeApp(config);

var database = firebase.database();

$("#timeDisplay").text(moment().format("HH:MM A"));


$("#addTrain").on("click", function (event) {
    event.preventDefault();

    let trainName = $("#trainName").val().trim();
    let destination = $("#destination").val().trim();
    let firstTrainTime = $("#firstTrainTime").val().trim();
    let frequency = $("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });
    $("#userInputForm").trigger("reset");
});

database.ref().on("child_added", function (childSnapshot) {

    let newTrain = childSnapshot.val().trainName;
    let newDestination = childSnapshot.val().destination;
    let newFirstTrainTime = childSnapshot.val().firstTrainTime;
    let newFrequency = childSnapshot.val().frequency;

    console.log(newTrain);
    console.log(newDestination);
    console.log(newFirstTrainTime);
    console.log(newFrequency);

    let currentTime = moment();

    let startTimeConverted = moment(newFirstTrainTime, "HH:MM ").subtract(1, "years");

    let timeDifference = moment().diff(moment(startTimeConverted), "minutes");

    let remainder = timeDifference % newFrequency;

    let minutesAway = newFrequency - remainder;

    let nextArrival = moment().add(minutesAway, "minutes").format("HH:MM  A");

    let key = childSnapshot.key;

    $("#tableBody").append(
        "<tr><td class='text-center'>" + newTrain +
        "</td><td class='text-center'>" + newDestination +
        "</td><td class='text-center'>" + newFrequency +
        "</td><td class='text-center'>" + nextArrival +
        "</td><td class='text-center'>" + minutesAway +
        "</td><td class='text-center'><button class='delete btn btn-danger btn-xs' data-key='" + key + "'>X</button></td></tr>")
},

    function (errorObject) {
        console.log("Errors handeled: " + errorObject.code);
    });


$(document).on("click", ".delete", function () {
    keyRef = $(this).attr("data-key");
    database.ref().child(keyRef).remove();
    window.location.reload();
});