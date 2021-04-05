//set up canvas
var c = document.getElementById("clock");
var clock = c.getContext("2d");
//change center of clock
var translateX = 150;
var translateY = 75;
clock.translate(translateX,translateY);


var clockTime = new Date();
var clockHours = clockTime.getHours();
var clockMinutes = clockTime.getMinutes();
var clockSeconds = clockTime.getSeconds();
console.log(clockTime + " " + clockHours + " " + clockMinutes + " " + clockSeconds);




//pre-calculate where second pointer goes to & where numbers are
var pointerX = 0;
var pointerY = -50;
var pX, pY;
var pxArray = [pointerX]; //where pointer goes to is pushed into the array, 60 indexes bc there are 60 seconds
var pyArray = [pointerY]; //index 0 is 12 o'clock position
for (var i=0; i<59; i++) {
    pX = pointerX;
    pY = pointerY;
    pointerX = pX * Math.cos(2*Math.PI / 60) - pY * Math.sin(2*Math.PI / 60);
    pointerY = pY * Math.cos(2*Math.PI / 60) + pX * Math.sin(2*Math.PI / 60);
    pxArray.push(pointerX);
    pyArray.push(pointerY);
}

//precalculate where minutes pointer goes to



var pointOnArray = clockSeconds; //index of pxArray and pyArray for seconds, goes from 0 to 60
var minutesPointOnArray = clockMinutes;
var drawClock = function() {
    //draw circle (outline of clock)
    clock.beginPath();
    clock.arc(0, 0, 60, 0, 2 * Math.PI);
    clock.stroke();

    //draw numbers, index 0 is 12 o'clock
    for (var i=0; i<12; i++) {
      clock.textAlign = "center";
      clock.textBaseline = "middle";

      if(i===0) {
        clock.fillText(12-i, pxArray[0], pyArray[0]); //have to do this special case bc there is no pxArray[60]
      }
      else {
        clock.fillText(12-i, pxArray[60- i*5], pyArray[60- i*5]); //drawn counter-clockwise, 12 down to 1
      }
    }

    //draw minutes pointer
    clock.beginPath();
    clock.moveTo(0, 0);
    clock.lineTo(pxArray[minutesPointOnArray], pyArray[minutesPointOnArray]);
    clock.stroke();


    //draw seconds pointer
    clock.beginPath();
    clock.moveTo(0, 0);
    clock.lineTo(pxArray[pointOnArray], pyArray[pointOnArray]);
    clock.stroke();
    //index++ everytime seconds pointer moves
    if(pointOnArray<59) {
      pointOnArray++;
    }
    else {
      pointOnArray = 0;
    }
};
drawClock(); //initial clock drawing

var drawAndClear = function() {
    clock.clearRect(-translateX, -translateY, c.width, c.height); //clear line
    drawClock();
};
window.setInterval(drawAndClear, 1000); //draw circle and seconds pointer every second






///// Global Sound Effects /////
{
var playRing = function() {
    var audioEl = document.createElement("audio");
    audioEl.src = "https://www.kasandbox.org/programming-sounds/rpg/metal-chime.mp3";
    audioEl.autoplay = "true";
    document.body.appendChild(audioEl);
};
var playButtonSound = function() {
    var buttonSound = document.createElement("audio");
    buttonSound.src = "https://www.kasandbox.org/programming-sounds/retro/hit1.mp3";
    buttonSound.volume = 1;
    buttonSound.autoplay = "true";
    document.body.appendChild(buttonSound);
};
var playErrorSound = function() {
    var errorSound = document.createElement("audio");
    errorSound.src = "https://www.kasandbox.org/programming-sounds/retro/jump1.mp3";
    errorSound.volume = 0.05;
    errorSound.autoplay = "true";
    document.body.appendChild(errorSound);
};
}

                /******* Count Down Timer *******/
{
var countDownWatch = document.getElementById("count-down-watch");
var minutesInput;
var secondsInput;
var difTime;
var playRingInterval; //globally set an interval for timer end ring
///// Main timing function referenced by setInterval /////
var countDown = function() {
    //Calculate countDownWatch.textContent based on user's input
    //Everything calculated with the unit "seconds"
    //setInteval updates time every 10 milliseconds(0.01 sec)
    var hours = Math.floor(difTime%(24*60*60)/(60*60));
    var minutes = Math.floor(difTime%(24*60*60)%(60*60)/(60));
    var seconds = Math.floor(difTime%(24*60*60)%(60*60)%60/1);
    var centis = Math.round(difTime%(24*60*60)%(60*60)%60%1/0.01);

    if (difTime > 0) {
        difTime -= 0.01;
        countDownWatch.textContent = hours + "hrs " + minutes + "mins " + seconds + "secs." + centis;
    }
    else {
        clearInterval(countDownId);
        countDownWatch.textContent = "Time is up!, Click Reset Button to stop the ring";
        playRingInterval = window.setInterval(playRing, 100);
    }
};


///// Start button and setInterval (reset timer) /////
var stopped = true; //global var; false means setInterval is running

var startButton = document.getElementById("start-button");
var countDownId; //give countDown setInterval a global id so clearInterval knows what to clear
var startCountDown = function(){
    //update user's input when startButton is clicked
    minutesInput = parseFloat(document.getElementById("minutes-input").value);
    secondsInput = parseFloat(document.getElementById("seconds-input").value);
    difTime = parseFloat(60*minutesInput + secondsInput); //everything uses "seconds" as unit

    if (difTime > 0 && stopped === true) {
        playButtonSound();
        countDownId = window.setInterval(countDown, 10); //run countdown
        stopped = false;
    }
    else {
        playErrorSound();
        countDownWatch.textContent = "Timer value needs to be above 0"
    }

    //Stop timer end ring from playing
    window.clearInterval(playRingInterval);
};
startButton.addEventListener("click", startCountDown);


///// Stop button and clearInterval /////
var stopButton = document.getElementById("stop-button");
var stopCountDown = function() {
    if (difTime > 0 && stopped === false) {
        playButtonSound();
        window.clearInterval(countDownId);
    }
    else {
        playErrorSound();
        countDownWatch.textContent = "Timer is already stopped";
    }
    stopped = true;
};
stopButton.addEventListener("click", stopCountDown);


///// Continue button (calls setInterval w/o restarting timer) /////
var continueButton = document.getElementById("continue-button");
var continueCountDown = function() {
    if (difTime > 0 && stopped === true) {
        playButtonSound();
        countDownId = window.setInterval(countDown, 10);
        stopped = false;
    }
    else {
        playErrorSound();
        countDownWatch.textContent = "Please type in a time value and click Start";
    }
};
continueButton.addEventListener("click", continueCountDown);


///// Reset button (resets input value to 0) /////
var resetButton = document.getElementById("reset-button");
var resetCountDown = function() {
    if (stopped === false) {
        playButtonSound();
        window.clearInterval(countDownId);
        stopped = true;
    }

    //Reset values shown by input tag and update corresponding vars
    document.getElementById("minutes-input").value = 0;
    document.getElementById("seconds-input").value = 0;
    minutesInput = document.getElementById("minutes-input").value;
    secondsInput = document.getElementById("seconds-input").value;
    difTime = parseFloat(60*minutesInput + secondsInput);

    countDownWatch.textContent = "Please type in a time value";

    //Stop timer end ring from playing
    window.clearInterval(playRingInterval);
};
resetButton.addEventListener("click", resetCountDown);
}


        /******* Count Down Clock With Target Time *******/
{
var targetWatch = document.getElementById("target-watch");
var target;
var targetGetTime;
var now;
var duration;

var playRingInterval2; //globally set an interval for timer end ring
var targetCount = function() {
    //Calculations made using unit "milliseconds" because 'new Date().getTime();' gives me time in milliseconds
    //setInterval updates time every 1000 millis (1 sec)
    now = new Date().getTime();
    duration = targetGetTime - now;

    var targetDays = Math.floor(duration/(24*60*60*1000));
    var targetHours = Math.floor(duration%(24*60*60*1000)/(60*60*1000));
    var targetMinutes = Math.floor(duration%(24*60*60*1000)%(60*60*1000)/(60*1000));
    var targetSeconds = Math.floor(duration%(24*60*60*1000)%(60*60*1000)%(60*1000)/1000);

    if (duration > 0) {
        duration -= 1000;
        targetWatch.textContent = targetDays + "days " + targetHours + "hours " + targetMinutes + "minutes " + targetSeconds + "seconds";
    }
    else {
        window.clearInterval(targetInterval);
        targetWatch.textContent = "Time is Up! Click Stop/Reset to stop the ring";
        playRingInterval2 = window.setInterval(playRing, 100);
    }
};


var targetInterval;
var startTargetButton = document.getElementById("start-target-button");
var startTarget = function() {
    target = new Date(document.getElementById("date-time-input").value);
    targetGetTime = target.getTime();
    now = new Date().getTime();
    duration = targetGetTime - now;

    if (duration > 0) {
        targetInterval = window.setInterval(targetCount, 1000);
        playButtonSound();
    }
    else {
        targetWatch.textContent = "Please set target time to some time in the future";
        playErrorSound();
    }
};
startTargetButton.addEventListener("click", startTarget);


var stopTargetButton = document.getElementById("stop-target-button");
var stopTarget = function() {
    window.clearInterval(targetInterval);
    window.clearInterval(playRingInterval2); //Stop timer end ring
    targetWatch.textContent = "Please set target time to some time in the future";

    if (duration > 0) {
        var stopTime = new Date();
        targetWatch.innerHTML += "<br><br>Stopped at " + stopTime;
        playButtonSound();
    }
};
stopTargetButton.addEventListener("click", stopTarget);
}


                /****** Stopwatch Counting Up *******/
{
var countUpWatch = document.getElementById("count-up-watch");
var startUpTime; //when startbutton is pressed
var currentTime; //updated by setInterval every 1 millisecond
var upTime; //currentTime - startUpTime; what timer shows

var pauseStart = 0; //when stopbutton is pressed
var pauseEnd = 0; //when continue button is pressed
var pauseDuration = pauseEnd - pauseStart; //default to 0 so it's not undefined
///// Main timing function referenced by setInterval /////
var countUp = function() {
    currentTime = new Date().getTime();
    //now - when startbutton is pressed - how long pauses take(0 on program load)
    upTime = currentTime - startUpTime - pauseDuration;

    //everything with a base unit of milliseconds
    var upMinutes = Math.floor(upTime%(24*60*60*1000)%(60*60*1000)/(60*1000));
    var upSeconds = Math.floor(upTime%(24*60*60*1000)%(60*60*1000)%(60*1000)/1000);
    var upMillis = Math.floor(upTime%(24*60*60*1000)%(60*60*1000)%(60*1000)%1000/1);

    countUpWatch.textContent = upMinutes + ":" + upSeconds + "." + upMillis;
};


var counting = false; //if true, timer is running
var initialState = true; //only true when program loads or resetbutton is pressed
///// Start counting up, only runs after reset /////
var countUpInterval;
var startUpButton = document.getElementById("start-up-button");
var startUp = function() {
    if (counting === false && initialState === true) {
        playButtonSound();
        startUpTime = new Date().getTime();
        countUpInterval = window.setInterval(countUp, 1);
        counting = true;
    }
    else {
        playErrorSound();
    }
};
startUpButton.addEventListener("click", startUp);


///// Stop Counting and starting to record pause duration /////
var stopUpButton = document.getElementById("stop-up-button");
var stopUp = function() {
    if (counting === true) {
        playButtonSound();
        window.clearInterval(countUpInterval);
        pauseStart = new Date().getTime();
        counting = false;
        initialState = false;
    }
    else {
        playErrorSound();
    }
};
stopUpButton.addEventListener("click", stopUp);


///// Finish recording pause duration and continue to count /////
var continueUpButton = document.getElementById("continue-up-button");
var continueUp = function() {
    if (counting === false && pauseStart !== 0) {
        playButtonSound();
        pauseEnd = new Date().getTime();
        pauseDuration = pauseEnd - pauseStart;
        countUpInterval = window.setInterval(countUp, 1);
        counting = true;
        initialState = false;
    }
    else {
        playErrorSound();
    }
};
continueUpButton.addEventListener("click", continueUp);


///// End all interval and reset all vars to 0 (initialState) /////
var resetUpButton = document.getElementById("reset-up-button");
var resetUp = function() {
    playButtonSound();
    if (counting === true) {
        window.clearInterval(countUpInterval);
    }
    //reset everything to 0 to be sure
    counting = false;
    startUpTime = 0;
    currentTime = 0;
    upTime = 0;
    pauseStart = 0;
    pauseEnd = 0;
    pauseDuration = pauseEnd - pauseStart;
    countUpWatch.textContent = "0:0.0";
    initialState = true;
};
resetUpButton.addEventListener("click", resetUp);
}
