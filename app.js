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

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

    trainData.ref().push(newTrain);

    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);

    alert("Train added!")

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var newT = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newFirstTrainTime = childSnapshot.val().firstTrainTime;
    var newFrequency = childSnapshot.val().frequency;

    var arrived = newFirstTrainTime.split(":")
    var time = moment()
        .hours(arrived[0])
        .minutes(arrived[1]);
    var maxMoment = moment.max(moment(), time);
    var minutes;
    var tArrival;

    if (maxMoment === newT) {
        tArrival = newT.format("hh:mm A");
        minutes = newT.diff(moment(), "minutes");
    } else {
        var timeDifference = moment().diff(newT, "minutes");
        var remainingTime = timeDifference % newFrequency;
        minutes = newFrequency - remainingTime;

        arrived = moment()
            .add(minutes, "m")
            .format("hh:mm A");
    }
    console.log("minutes", minutes);
    console.log("tArrival", tArrival);

    $("#tableBody").append(
        "<tr><td class='text-center'>" + newTrain +
        "</td><td class='text-center'>" + newDestination +
        "</td><td class='text-center'>" + newFrequency +
        "</td><td class='text-center'>" + nextArrival +
        "</td><td class='text-center'>" + minutesAway +
        "</td><td class='text-center'><button class='delete btn btn-danger btn-xs' data-key='" + key + "'>X</button></td></tr>")

    $(document).on("click", ".delete", function () {
        keyRef = $(this).attr("data-key");
        database.ref().child(keyRef).remove();
        window.location.reload();
    });
});
