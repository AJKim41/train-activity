// Initialize Firebase
$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyBGAUNHjABpsWWJ-V9ok9r3t0OAKU1MZQU",
    authDomain: "train-activity-harcam.firebaseapp.com",
    databaseURL: "https://train-activity-harcam.firebaseio.com",
    projectId: "train-activity-harcam",
    storageBucket: "train-activity-harcam.appspot.com",
    messagingSenderId: "132850691652"
  };
  firebase.initializeApp(config);

  let database = firebase.database();

  $("#save").on("click", event => {
    event.preventDefault();
    let trainName = $("#train-input")
      .val()
      .trim();
    let destination = $("#destination-input")
      .val()
      .trim();
    let firstTrainTime = $("#train-time-input")
      .val()
      .trim();
    let frequency = $("#frequency-input")
      .val()
      .trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    });
    database.ref().on("child_added", snapshot => {
      let data = snapshot.val();
      var currentTime = moment();
      var updatedCurrentTime = moment().subtract(1, "years");
      var firstTrain = data.firstTrainTime;
      var frequencyTime = data.frequency;
      var firstTrainT = moment(firstTrain, "HH:mm").subtract(1, "years");
      var timeDifference = moment().diff(moment(firstTrainT), "minutes");
      var timeLeft = timeDifference % +frequencyTime;
      var minutesAway = +frequencyTime - timeLeft;
      var nextArrival = moment()
        .add(minutesAway, "minutes")
        .format("hh:mm A");
      var beforeCalc = moment(firstTrainT).diff(updatedCurrentTime, "minutes");
      var beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());

      let html = `
            <tr>
                <th scope="row">${data.trainName}</th>
                <td>${data.destination}</td>
                <td>${frequencyTime}</td>
                <td>${nextArrival}</td>
                <td>${minutesAway}</td>
              </tr>`;

      $("#train-section").append(html);
    });
  });
});
