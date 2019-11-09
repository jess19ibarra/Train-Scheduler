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

    database.ref().push(newTrain);

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
    var minutesAway;
    var tArrival;

    if (maxMoment === time) {
        tArrival = time.format("h:mm A");
        minutesAway = time.diff(moment(), "minutes");
    } else {
        var timeDifference = moment().diff(time, "minutes");
        var remainingTime = timeDifference % newFrequency;
        minutesAway = newFrequency - remainingTime;

        arrived = moment()
            .add(minutesAway, "m")
            .format("h:mm A");
    }
    console.log("tmin", minutesAway);
    console.log("tArrival", tArrival);

    $("#tableBody").append(
        $("<tr>").append(
            $("<td class='text-center'>").text(newT),
            $("<td class='text-center'>").text(newDestination),
            $("<td class='text-center'>").text(newFrequency),
            $("<td class='text-center'>").text(tArrival),
            $("<td class='text-center'>").text(minutesAway)
        )
    )
});
