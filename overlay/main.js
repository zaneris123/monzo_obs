var firebaseConfig = {
//Insert firebase config
};
var balanceDisplay = document.getElementById("balanceDisplay");
var currentBalance = 0; // Initial balance
var targetBalance = 0; // Updated balance
var transitionDuration = 3000; // Transition duration in milliseconds
var transitionInterval = 30; // Interval for updating the display during the transition

var balanceDisplay = document.getElementById("balanceDisplay");
var currentBalancePennies = 0; // Initial balance in pennies
var targetBalancePennies = 0; // Updated balance in pennies
var transitionDuration = 3000; // Transition duration in milliseconds
var transitionInterval = 30; // Interval for updating the display during the transition

// Function to update balance with smooth transition
function updateBalanceSmoothly(newBalancePennies) {
  targetBalancePennies = newBalancePennies;

  var startTime = Date.now();
  var difference = targetBalancePennies - currentBalancePennies;

  function update() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;

    if (elapsedTime < transitionDuration) {
      var interpolatedValuePennies = currentBalancePennies + (difference * elapsedTime) / transitionDuration;
      var interpolatedValueDollars = interpolatedValuePennies / 100; // Convert pennies to dollars
      balance.innerHTML = interpolatedValueDollars.toFixed(2);
      requestAnimationFrame(update);
    } else {
      var targetValueDollars = targetBalancePennies / 100; // Convert pennies to dollars
      balance.innerHTML = targetValueDollars.toFixed(2);
      currentBalancePennies = targetBalancePennies;
    }
  }

  update();
}

firebase.initializeApp(firebaseConfig);
var balanceRef = firebase.database().ref('/processed_transactions/currentbalance');
balanceRef.on('value', function(snapshot) {
  var balanceValue = snapshot.val();
  updateBalanceSmoothly(balanceValue);
});
