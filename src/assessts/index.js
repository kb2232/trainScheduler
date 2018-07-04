// Initialize firebase
var config = {
	apiKey: 'AIzaSyBgDKz4Vd-_A9rTE4BCSKWcnsOO5mctSNM',
	authDomain: 'stylistsolution.firebaseapp.com',
	databaseURL: 'https://stylistsolution.firebaseio.com',
	projectId: 'stylistsolution',
	storageBucket: 'stylistsolution.appspot.com',
	messagingSenderId: '638260480533',
};
firebase.initializeApp(config);

$(document).ready(function() {
	$('#create-login').on('click', () => {
		let email = $('#inputemail').val();
		let password1 = $('#inputpassword1').val();
		let password2 = $('#inputpassword2').val();
		if (password1 === password2) {
			firebase.auth()
				.createUserWithEmailAndPassword(email, password1)
				.then(function() {
					alert('account created!!!');
					var user = firebase.auth().currentUser;
					user.sendEmailVerification()
						.then(function() {
							if (user) {
								window.location = 'login.html';
							} else {
								alert('failed to load page!!!');
							}
						})
						.catch(function(error) {
							alert("Couldn't send confirmation!");
						});
				})
				.catch(function(error) {
					alert(error.message);
					console.log('error = ', error.message);
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
				});
		} else {
			alert('Password does not match');
		}
	});

	$('#loggedIn').on('click', function() {
		let email = $('#login').val();
		let password = $('#password').val();
		console.log('email = ', email);
		console.log('password = ', password);
		firebase.auth()
			.signInWithEmailAndPassword(email, password)
			.then(function() {
				var user = firebase.auth().currentUser;
				if (user) {
					window.location = '../index.html';
				} else {
					alert('failed to load page!!!');
				}
			})
			.catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// ...
			});
	});

	$('#signedOut').on('click', () => {
		firebase.auth()
			.signOut()
			.then(function() {
				// Sign-out successful.
				alert('successful signed out!!!');
				if (firebase.auth().currentUser === null) {
					window.location = 'src/createLogin.html';
				} else {
					alert('failed to load page!!!');
				}
			})
			.catch(function(error) {
				alert('cannot sign out');
				console.log(error);
				// An error happened.
			});
	});

	//reference to database
	let database = firebase.database();
	//on click of the submit form - save into database
	$('#submitForm').on('click', () => {
		//get input values
		let trName = $('#trainName').val();
		let dest = $('#Destination').val();
		let freq = $('#freq').val();
		let nexAriv = $('#trainTime').val();

		let trainObj = {
			TrainName: trName,
			Destination: dest,
			Frequency: freq,
			NextArrival: nexAriv,
		};
		//push into database
		database.ref().push(trainObj);
	});

	//display on table
	database.ref().on('child_added', snapshot => {
		let trainName = snapshot.val().TrainName;
		let dest = snapshot.val().Destination;
		let freq = snapshot.val().Frequency;
		let firstTrainTime = snapshot.val().NextArrival;

		let StartTime = moment(firstTrainTime, 'HH:mm').subtract(1, 'years');
		let timeDiff = moment().diff(moment(StartTime), 'minutes');
		let timeRemain = timeDiff % freq;
		let minsAway = freq - timeRemain;
		let nextTrain = moment().add(minsAway, 'minutes');
		let nextArrival = moment(nextTrain).format('hh:mm');
		let newRow = $('<tr>').append(
			$('<td>').text(trainName),
			$('<td>').text(dest),
			$('<td>').text(freq),
			$('<td>').text(nextArrival),
			$('<td>').text(minsAway)
		);
		$('.schedule > tbody').append(newRow);
	});
});
