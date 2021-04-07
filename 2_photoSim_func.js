// Last Update 4_7_18 5:41pm by EB
//DOM OBJECTS//
//var canvas = null; //document.getElementById("mainCanvas");
//var ctx = null; //canvas.getctx("2d");
//image change is a spirite
var c = $("#mainCanvas");

// Interaction Data vars
 if(typeof window.parent.wiseAPI === "function"){
	wiseAPI = window.parent.wiseAPI(); // get the WISE API from parent frame
	interactionDataOn = true;
} 

var resets = 0;
var saves = 0;
var record_trial = 0;
var runs = 0;
var pauses = 0;
var energySlider = 0;
var matterSlider = 0;


//GLOBAL VARIABLES//
var mouseXp = 0;
var mouseYp = 0;
var mouseX = 0;
var mouseY = 0;
var canvasWidth = 0;
var canvasHeight = 0;

var dragging = false;
var mousePressed = false;
var active_drag = null;
var update_rate = 15; // overall speed of simulation, lower is faster, dont forget to change it in reset
var leftPanelW = 225;
var energyLevel = 0;
var matterLevel = 0;
var macroLevel = 3;
var playing = false;
var stage = 0;
var trial = 0;
var totalStages = 1;
var alerting = false;

var energyBefore = 0;
var energyCurrent = 0;
var energyAfter = 0;
var energyProgress = 0;
var matterBefore = 0;
var matterAfter = 0;

var reasoningUnlocked = false;

var totalO2 = 0; // O2 formed
var addedO2 = 0; // O2 moved to graphs

var glucoseH = 0; // hydrogen gathered during cycle
var glucoseC = 0; // carbon gathered during cycle
var glucoseO = 0; // oxygen gathered during cycle

var internalCO2 = 0; // CO2 inside the chloroplast
var internalH2O = 0; // H2O inside the chloroplast
var internalLight = null; // light particle inside the chloroplast for current cycle
var newLight = false;
var moleculesBroken = 0;
var totalLight = 0;

var count = 0;
var energyStored = 0;
var pause = 0;
var pauseFrames = 0;
var delay = 0;
var completeCycles = 0;


var vibrateAmt = 0.5;
var vibrateSpeed = 5;

var sliders = [new slider(leftPanelW * 0.2, 0), new slider(leftPanelW * 0.7, 1)];
var atomImagePath = ["hydrogen.png", "oxygen.png", "carbon.png", "halfGlucose.png", "photoSim_glucose.png", "lightEnergyWave.png", "chemicalEnergy.png", "heatWave.png"];
var atomRadii = [7, 10, 10, 0, 0, 0, 0];
//object list is the spirites
var objectList = [];
var pi = Math.PI;

var hGO = [];
var hGC = [];
var hGH = [];
var hGX = [-2, 11, 19, -8, -14, -18, -16, 7, -5, -1, 20, -5]; //6 hydrogen, 3 carbon, 3 oxygen
var hGY = [2, -17, 6, 32, -31, -17, -21, -8, 4, -20, -2, 22];
var fGX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var fGY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


var centerX = 0;
var centerY = 0; // - 20 is standard

var enterPath = [new coord(leftPanelW, canvasHeight * 0.9), new coord(leftPanelW * 1.4, canvasHeight * 0.9), new coord(leftPanelW * 1.6, canvasHeight * 0.8)];

var initialPositions = [];
var done = true;
var thermalEnergy = false;

var funcHandle = -1;
var fasterPressed = false;

var narrationPressed = false;
var termsAudioPressed = false;
var sound = new Audio();
var termType = "";
var nextNA = false;
var slidersMoved = false;

var level = 1;
var curLevel = 1;

var lives = 3;
var score = 0;

var noLivesSound = new Audio('failed.mp3');

 

       noLivesSound.loop = false;

 

       noLivesSound.volume = 0.3;

 

      

 

       var wrongSound = new Audio('wrong.mp3');

 

       wrongSound.loop = false;

 

       wrongSound.volume = 0.3;

 

      

 

       var loseLifeSound = new Audio('loselife.mp3');

 

       loseLifeSound.loop = false;

 

       loseLifeSound.volume = 0.3;

 

      

 

       var finishSound = new Audio('finish.mp3');

 

       finishSound.loop = false;

 

       finishSound.volume = 0.3;

 

      

 

       var scoreSound = new Audio('scoresound.mp3');

 

       scoreSound.loop = false;

 

       scoreSound.volume = 0.3;

 

      

 

       var correctSound = new Audio('correct.mp3');

 

       correctSound.loop = false;

 

       correctSound.volume = 0.3;

 

      

 

       var warningSound = new Audio('warning_sound.mp3');

 

       warningSound.loop = false;

 

       warningSound.volume = 0.3;

 

       var failedSound = new Audio('failed.mp3');

 

       failedSound.loop = false;

 

       failedSound.volume = 0.3;

      

 

       var hintSound = new Audio('hintsound.mp3');

 

       hintSound.loop = false;

 

       hintSound.volume = 0.3;

 

      

 

      

 

       var readySound = new Audio('readysound.mp3');

 

       readySound.loop = false;

 

       readySound.volume = 0.3;




//button counters
var faster;

//METHODS//

//var superSel = null;

//Run button colors
function btnHover(x) {
    if (x.innerText == "Run") {
        x.style.background = "#669967";
    } else {
        x.style.background = "#915e5e";
    }
}

function btnNormal(x) {
    if (x.innerText == "Run") {
        x.style.background = "#7b7";
    } else {
        x.style.background = "#c77";
    }
}

//format text colors
function formatText(text) {
    text = replaceAll(text, "light energy", '<b><font color="gold">light energy</font></b>');
    text = replaceAll(text, "Light energy", '<b><font color="gold">Light energy</font></b>');
    text = replaceAll(text, "Light Energy", '<b><font color="gold">Light Energy</font></b>');
    text = replaceAll(text, "Remember to SUBMIT your trial when the table is filled out.", '<font color="red">Remember to SUBMIT your trial when the table is filled out.</font>');
}

function resetAlertBoxSize(sizePx) {
    document.getElementById('alertBoxTerms').style.height = sizePx + "px";
    document.getElementById('alertBoxTermsFrame').style.height = sizePx - 10 + "px";
}


function reset() {
    thermalEnergy = false;
    done = true;
    objectList = [];
    dragging = false;
    mousePressed = false;
    active_drag = null;
    update_rate = 15; // overall speed
    leftPanelW = 225;
    energyLevel = 0;
    matterLevel = 0;
    macroLevel = 3;
    playing = false;
    stage = 0;
    totalStages = 1;
    alerting = false;
    delay = 0;

    energyBefore = 0;
    energyAfter = 0;
    energyCurrent = 0;
    energyProgress = 0;
    matterBefore = 0;
    matterAfter = 0;

    totalO2 = 0;
    addedO2 = 0;

    glucoseH = 0;
    glucoseC = 0;
    glucoseO = 0;

    internalCO2 = 0;
    internalH2O = 0;
    internalLight = null;
    newLight = false;
    moleculesBroken = 0;
    totalLight = 0;

    count = 0;
    energyStored = 0;
    pause = 0;
    pauseFrames = 0;
    completeCycles = 0;
    fasterPressed = false;

    document.getElementById('energySetting' + getTrialNum(false)).innerHTML = "<img src='nolight.png'><font color='grey'>None</font>";
    document.getElementById('matterSetting' + getTrialNum(false)).innerHTML = "<img src='nomatter.png'><font color='grey'>None</font>";
    document.getElementById('energySettingMini').innerHTML = "<img src='nolight.png'><font color='grey'>None</font>";
    document.getElementById('matterSettingMini').innerHTML = "<img src='nomatter.png'><font color='grey'>None</font>";

    
    document.getElementById('bmMini').value = "";
    document.getElementById('amMini').value = "";
    document.getElementById('beMini').value = "";
    document.getElementById('aeMini').value = "";
    


    document.getElementById('playPause').disabled = false;
    document.getElementById('playPause').innerHTML = "<b>Run</b>";
    document.getElementById('playPause').style.background = "#7b7";

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].y = 215; //260
    }

    document.getElementById('film').style.visibility = "hidden";
    document.getElementById('draggable').style.visibility = 'hidden';

    slidersMoved = false;
}
//$(document).ready(function(){
canvas = document.getElementById("mainCanvas");
canvasWidth = canvas.width;
canvasHeight = canvas.height;
window.ctx = canvas.getContext("2d");

centerX = leftPanelW * 2;
centerY = canvasHeight * 0.5 - 70;


var initialPositions = [new coord(leftPanelW + 65, canvasHeight * 0.5 + 50), new coord(leftPanelW + 120, canvasHeight * 0.5 + 50), new coord(leftPanelW + 175, canvasHeight * 0.5 + 50),
    new coord(leftPanelW + 265, canvasHeight * 0.5 + 50), new coord(leftPanelW + 320, canvasHeight * 0.5 + 50), new coord(leftPanelW + 375, canvasHeight * 0.5 + 50),
    new coord(leftPanelW + 80, canvasHeight * 0.5 + 80), new coord(leftPanelW + 135, canvasHeight * 0.5 + 80), new coord(leftPanelW + 190, canvasHeight * 0.5 + 80),
    new coord(leftPanelW + 255, canvasHeight * 0.5 + 80), new coord(leftPanelW + 310, canvasHeight * 0.5 + 80), new coord(leftPanelW + 365, canvasHeight * 0.5 + 80),

    new coord(leftPanelW + 95, canvasHeight * 0.5 + 110), new coord(leftPanelW + 140, canvasHeight * 0.5 + 110), new coord(leftPanelW + 185, canvasHeight * 0.5 + 110),
    new coord(leftPanelW + 255, canvasHeight * 0.5 + 110), new coord(leftPanelW + 300, canvasHeight * 0.5 + 110), new coord(leftPanelW + 345, canvasHeight * 0.5 + 110),
    new coord(leftPanelW + 115, canvasHeight * 0.5 + 140), new coord(leftPanelW + 155, canvasHeight * 0.5 + 140), new coord(leftPanelW + 195, canvasHeight * 0.5 + 140),
    new coord(leftPanelW + 245, canvasHeight * 0.5 + 140), new coord(leftPanelW + 285, canvasHeight * 0.5 + 140), new coord(leftPanelW + 325, canvasHeight * 0.5 + 140)
]; // ... ad more up to 24 coords
//ctx.translate(0.5,0.5);
//ctx.imageSmoothingEnabled = true;
$('#fasterBtn').prop('disabled', true);

var loop = setInterval(mainLoop, update_rate);

function mainLoop() { //main looping method that updates everything
    //resets the canvas

    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    document.getElementById("reQs").classList.add("hidden");

    drawActiveBG();

    var collisions = [];

    if (playing) {
        count++;
        if (delay > 0) {
            delay--;
        } else {
            if (pauseFrames > 0) {
                pauseFrames--;
            }
            if (stage == 1 || stage == 7) { //move light into chloroplast one at a time.
                if (energyLevel == 0 && matterLevel == 0) {
                    termType = 'n13';
                    nextNA = true;
                    window.setTimeout(
                        alertBoxNext, 2000,
                        "<img src='nolives.png'>Oh no! Your plant is dead.</br></br><b>Photosynthesis <u><font color='red'>CANNOT</font></u> happen <font color='red'>WITHOUT</font> <font color=\'#ff9803\'>light energy</font> and <b><font color='blue'>matter</font>.</b>");
                    playing = false;
                    var sound = new Audio(audioLink + 'ohno.mp3');
                    sound.play();
                    //resetMiniTable();
                    macroLevel = 0;
                    //syncTables(false);
                    document.getElementById('playPause').disabled = true;
                    document.getElementById('nextTrialP').style.visibility = "inherit";
                    return;
                }
                if (internalLight == null && totalLight < energyLevel * 2) {
                    var light0 = new particle(leftPanelW + 5, -40, 10, [5], [0], [0]);
                    light0.collidable = false;
                    light0.width = 70;
                    light0.height = 35;
                    light0.vx = 0;
                    light0.vy = 0;
                    light0.vr = 0;
                    light0.internal = true;
                    if (matterLevel == 0) {
                        light0.route.push(new coord(leftPanelW + 5, canvasHeight * 0.6), new coord(leftPanelW * 1.2 + (90 * totalLight), canvasHeight * 0.55));
                    } else if (matterLevel == 1) {
                        if (completeCycles < 1) {
                            light0.route.push(new coord(leftPanelW + 5, canvasHeight * 0.3), new coord(leftPanelW * 2 - 105, canvasHeight * 0.3));
                        } else {
                            light0.route.push(new coord(leftPanelW + 5, canvasHeight * 0.6), new coord(leftPanelW * 1.2 + (90 * totalLight), canvasHeight * 0.55));
                        }
                    } else {
                        light0.route.push(new coord(leftPanelW + 5, canvasHeight * 0.3), new coord(leftPanelW * 2 - 105, canvasHeight * 0.3));
                    }
                    objectList.push(light0);
                    internalLight = light0;
                    totalLight++;
                    newLight = true;
                }
                if (matterLevel == 0) {

                    if (internalLight == null) { // no more light
                        if (pause < 105) {
                            pause++;
                        } else {
                            done = true;
                            macroLevel = 0;
                            var sound = new Audio(audioLink + 'ohno.mp3');
                            //sound.play();
                            //if(matterLevel == 1 || matterLevel == 2){
                            console.log("Triggers LE can't transform into CE... feedback");
                            console.log("low/none ; high/none ;")
                            nextNA = false;
                            //}
                            termType = "n15";
                            // window.setTimeout(
                            //    alertBoxNext
                            //    , 2000, "The extra <font color=\"#ff9803\">light energy</font> <u><b>transformed (changed)</b></u> into <font color=\"red\">thermal energy.</font>");
                            window.setTimeout(
                                alertBoxNext, 2000,
                                "<img src='nolives.png'>Oh no! Your plant is dead.</br></br><b>Photosynthesis <u><font color='red'>CANNOT</font></u> happen <font color='red'>WITHOUT</font> <font color=\'#ff9803\'>light energy</font> and <b><font color='blue'>matter</font>.</b>");
                            playing = false;
							var sound = new Audio(audioLink + 'ohno.mp3');
                            sound.play();
                            //resetMiniTable();
                            //syncTables(false);
                            document.getElementById('playPause').disabled = true;
                            document.getElementById('nextTrialP').style.visibility = "inherit";
                            return;
                        }
                    } else { // transform light into heat
                        done = false;
                        if (internalLight.route.length == 0) {
                            thermalEnergy = true;
                            internalLight.path = "lightToHeat.png";
                            internalLight.anim = 10;
                            internalLight.types[0] = 7;
                            internalLight = null;
                            pause = 0;
                            var sound = new Audio(audioLink + 'transformsound.mp3');
                            sound.play();
                        }
                    }
                }
                if (internalLight == null) { // not enough light
                    if (matterLevel > 0) {
                        playing = false;
                        //resetMiniTable();
                        //syncTables(false);
                        document.getElementById('playPause').disabled = true;
                        document.getElementById('nextTrialP').style.visibility = "inherit";
                        stage = 14;
                        if (matterLevel == 2) {
                            completeCycles = 1;
                            if (energyLevel == 0) {
                                macroLevel = 0;
                                termType = 'n13';
                                nextNA = true;
                                window.setTimeout(
                                    alertBoxNext, 2000,
                                    "<img src='nolives.png'>Oh no! Your plant is dead.</br></br><b>Photosynthesis <u><font color='red'>CANNOT</font></u> happen <font color='red'>WITHOUT</font> <font color=\'#ff9803\'>light energy</font> and <b><font color='blue'>matter</font>.</b>");
                                var sound = new Audio(audioLink + 'ohno.mp3');
                                sound.play();
                                console.log("none/high");
                            } else {
                                macroLevel = 1;
                                if (energyLevel == 0 && matterLevel == 2) {
                                    console.log("high/none");
                                    window.setTimeout(
                                        alertBoxCompleteThermal, 2000);
                                }
                                nextNA = true;
								hintSound.play();
                                window.setTimeout(
                                    alertBoxComplete, 2000, "<img src='datacollection_icon.png'><font color='#006600'><b>Record Your Data</b></font><br><br>You have finished your experiment. <br><br>Look at the <mark><b><i>ENERGY Graph</mark></i><b> and the <b><i><span style='background-color: #66b9bf'>MATTER graph</span></i></b>.<img src='arrow_right.png'><p style='background-color:#ebfaeb;><b>What happened to <font color='orange'>light energy</font>? <br><br>What happened to <font color='purple'><b>carbon dioxide</b> and <b>water</font></b>? </p><img src='datacollection_icon.png'><font color='red'>Record your findings from the graphs to the table below.</font><br><br><img src='recordtable1.png></font>");

                                console.log("low/a-lot");
								hintSound.play();
                            }
                        } else {
                            macroLevel = 0;
                            var sound = new Audio(audioLink + 'ohno.mp3');
                            sound.play();
                            termType = 'n13';
                            nextNA = true;
                            window.setTimeout(
                                alertBoxNext, 2000,
                                "<img src='nolives.png'>Oh no! Your plant is dead.</br></br><b>Photosynthesis <u><font color='red'>CANNOT</font></u> happen <font color='red'>WITHOUT</font> <font color=\'#ff9803\'>light energy</font> and <b><font color='blue'>matter</font>.</b>");
                            console.log("none/little");
							var sound = new Audio(audioLink + 'ohno.mp3');
                            sound.play();
                        }
                        return;
                    }
                } else {
                    var distance = dist(leftPanelW * 2 - 105, canvasHeight * 0.3, internalLight.x, internalLight.y);
                    var distance2O = dist(leftPanelW * 2, centerY, internalLight.x, internalLight.y);
                    var dir = Math.atan2(centerY - internalLight.y, leftPanelW * 2 - internalLight.x);
                    if (newLight && distance + 70 < getInternalRadius(dir + pi) && totalLight <= matterLevel * 2) {
                        newLight = false;
                        energyBefore += 45 / 2; // add lightEnergy 
                    }
                    if (distance <= 3) {
                        internalLight.vy = 0;
                        internalLight.vx = 0;
                        if (internalCO2 == 3 && internalH2O == 3) {
                            for (var i = 0; i < objectList.length; i++) {
                                if (objectList[i].internal && objectList[i].types[0] < 3) {
                                    objectList[i].vel += 1;
                                    objectList[i].vx = objectList[i].vel * Math.cos(objectList[i].dir);
                                    objectList[i].vy = objectList[i].vel * Math.sin(objectList[i].dir);
                                }
                            }
                            if (pauseFrames == 0) {
                                if (stage == 1) {
                                    stage = 2;
                                } else {
                                    stage = 8;
                                }
                                pauseFrames += 150;
                            }
                        }
                    }
                }
            }

            if (stage == 2 || stage == 8) {
                if (moleculesBroken == 6) {
                    if (pauseFrames == 0) {
                        if (stage == 2) {
                            stage = 3;
                        } else {
                            stage = 9;
                        }
                        pauseFrames += 150;
                    }
                }
            }
            if (stage == 3 || stage == 9) {
                if (internalLight != null) {
                    internalLight.path = "lightToChem.png";
                    internalLight.anim = 5;
                    internalLight.types[0] = 6;
                    internalLight.height = 70;
                    internalLight = null;
                    energyAfter += 45 / 2; //graph

                    //sound effect light to chemical energy
                    var sound = new Audio(audioLink + 'transformsound.mp3');
                    sound.play();
                }
                if (pauseFrames == 0) {
                    if (stage == 3) {
                        stage = 4;
                    } else {
                        stage = 10;
                    }
                    pauseFrames += 50;
                }
            }
            if ((stage == 4 || stage == 10) && addedO2 == 3) { // check for all O2 to have been formed
                for (var i = 0; i < objectList.length; i++) { // target all remaining atoms inthe chloroplast and add them to respective arrays for gathering
                    if (objectList[i].internal) {
                        objectList[i].collidable = false;
                        switch (objectList[i].types[0]) {
                            case 0:
                                hGH.push(objectList[i]);
                                break;
                            case 1:
                                hGO.push(objectList[i]);
                                break;
                            case 2:
                                hGC.push(objectList[i]);
                                break;
                        }
                    }
                }
                if (pauseFrames == 0) {
                    if (stage == 4) {
                        stage = 5;
                    } else {
                        stage = 11;
                    }
                }
            }
            if (stage == 5) { // Draw atoms toward hGConfiguration using the element arrays and position arrays for halfGlucose
                for (var i = 0; i < hGH.length; i++) {
                    var distance = dist(leftPanelW * 2 + hGX[i], centerY + hGY[i], objectList[objectList.indexOf(hGH[i])].x, objectList[objectList.indexOf(hGH[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + hGY[i] - objectList[objectList.indexOf(hGH[i])].y, leftPanelW * 2 + hGX[i] - objectList[objectList.indexOf(hGH[i])].x);
                        objectList[objectList.indexOf(hGH[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGH[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGH[i])].vx = 0;
                        objectList[objectList.indexOf(hGH[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGH[i])].disabled) {
                            objectList[objectList.indexOf(hGH[i])].disabled = true;
                            glucoseH++;
                        }
                    }
                }
                for (var i = 0; i < hGC.length; i++) {
                    var distance = dist(leftPanelW * 2 + hGX[i + 6], centerY + hGY[i + 6], objectList[objectList.indexOf(hGC[i])].x, objectList[objectList.indexOf(hGC[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + hGY[i + 6] - objectList[objectList.indexOf(hGC[i])].y, leftPanelW * 2 + hGX[i + 6] - objectList[objectList.indexOf(hGC[i])].x);
                        objectList[objectList.indexOf(hGC[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGC[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGC[i])].vx = 0;
                        objectList[objectList.indexOf(hGC[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGC[i])].disabled) {
                            objectList[objectList.indexOf(hGC[i])].disabled = true;
                            glucoseC++;
                        }
                    }
                }
                for (var i = 0; i < hGO.length; i++) {
                    var distance = dist(leftPanelW * 2 + hGX[i + 9], centerY + hGY[i + 9], objectList[objectList.indexOf(hGO[i])].x, objectList[objectList.indexOf(hGO[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + hGY[i + 9] - objectList[objectList.indexOf(hGO[i])].y, leftPanelW * 2 + hGX[i + 9] - objectList[objectList.indexOf(hGO[i])].x);
                        objectList[objectList.indexOf(hGO[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGO[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGO[i])].vx = 0;
                        objectList[objectList.indexOf(hGO[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGO[i])].disabled) {
                            objectList[objectList.indexOf(hGO[i])].disabled = true;
                            glucoseO++;
                        }
                    }
                }

                if (glucoseH == 6 && glucoseC == 3 && glucoseO == 3) {
                    glucoseH = 0;
                    glucoseC = 0;
                    glucoseO = 0;

                    for (var i = 0; i < hGH.length; i++) {
                        objectList.splice(objectList.indexOf(hGH[i]), 1);
                    }
                    for (var i = 0; i < hGC.length; i++) {
                        objectList.splice(objectList.indexOf(hGC[i]), 1);
                    }
                    for (var i = 0; i < hGO.length; i++) {
                        objectList.splice(objectList.indexOf(hGO[i]), 1);
                    }

                    hGO = [];
                    hGC = [];
                    hGH = [];

                    var newHG = new particle(leftPanelW * 2 - 30, centerY - 42, 0, [3], [0], [0]);
                    newHG.vr = 0;
                    newHG.vx = 0;
                    newHG.vy = 0;
                    newHG.width = 60;
                    newHG.height = 86;
                    newHG.collidable = false;
                    objectList.push(newHG);
                    stage = 6;
                }
            }

            if (stage == 11) {
                for (var i = 0; i < hGH.length; i++) {
                    var distance = dist(leftPanelW * 2 + fGX[i], centerY + fGY[i], objectList[objectList.indexOf(hGH[i])].x, objectList[objectList.indexOf(hGH[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + fGY[i] - objectList[objectList.indexOf(hGH[i])].y, leftPanelW * 2 + fGX[i] - objectList[objectList.indexOf(hGH[i])].x);
                        objectList[objectList.indexOf(hGH[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGH[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGH[i])].vx = 0;
                        objectList[objectList.indexOf(hGH[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGH[i])].disabled) {
                            objectList[objectList.indexOf(hGH[i])].disabled = true;
                            glucoseH++;
                        }
                    }
                }
                for (var i = 0; i < hGC.length; i++) {
                    var distance = dist(leftPanelW * 2 + fGX[i + 6], centerY + fGY[i + 6], objectList[objectList.indexOf(hGC[i])].x, objectList[objectList.indexOf(hGC[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + fGY[i + 6] - objectList[objectList.indexOf(hGC[i])].y, leftPanelW * 2 + fGX[i + 6] - objectList[objectList.indexOf(hGC[i])].x);
                        objectList[objectList.indexOf(hGC[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGC[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGC[i])].vx = 0;
                        objectList[objectList.indexOf(hGC[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGC[i])].disabled) {
                            objectList[objectList.indexOf(hGC[i])].disabled = true;
                            glucoseC++;
                        }
                    }
                }
                for (var i = 0; i < hGO.length; i++) {
                    var distance = dist(leftPanelW * 2 + fGX[i + 9], centerY + fGY[i + 9], objectList[objectList.indexOf(hGO[i])].x, objectList[objectList.indexOf(hGO[i])].y);
                    if (distance > 3) {
                        var dir = Math.atan2(centerY + fGY[i + 9] - objectList[objectList.indexOf(hGO[i])].y, leftPanelW * 2 + fGX[i + 9] - objectList[objectList.indexOf(hGO[i])].x);
                        objectList[objectList.indexOf(hGO[i])].vx = (1 + (distance / 50)) * Math.cos(dir);
                        objectList[objectList.indexOf(hGO[i])].vy = (1 + (distance / 50)) * Math.sin(dir);
                    } else {
                        objectList[objectList.indexOf(hGO[i])].vx = 0;
                        objectList[objectList.indexOf(hGO[i])].vy = 0;
                        if (!objectList[objectList.indexOf(hGO[i])].disabled) {
                            objectList[objectList.indexOf(hGO[i])].disabled = true;
                            glucoseO++;
                        }
                    }
                }

                if (glucoseH == 6 && glucoseC == 3 && glucoseO == 3) {
                    glucoseH = 0;
                    glucoseC = 0;
                    glucoseO = 0;

                    for (var i = 0; i < hGH.length; i++) {
                        objectList.splice(objectList.indexOf(hGH[i]), 1);
                    }
                    for (var i = 0; i < hGC.length; i++) {
                        objectList.splice(objectList.indexOf(hGC[i]), 1);
                    }
                    for (var i = 0; i < hGO.length; i++) {
                        objectList.splice(objectList.indexOf(hGO[i]), 1);
                    }

                    hGO = [];
                    hGC = [];
                    hGH = [];

                    for (var i = 0; i < objectList.length; i++) {
                        if (objectList[i].types[0] == 3) {
                            objectList.splice(i, 1);
                        }
                    }

                    var newfG = new particle(leftPanelW * 2 - 60, centerY - 55, 0, [4], [0], [0]);
                    newfG.vr = 0;
                    newfG.vx = 0;
                    newfG.vy = 0;
                    newfG.width = 85;
                    newfG.height = 95;
                    newfG.collidable = false;
                    objectList.push(newfG);
                    stage = 12;
                }
            }

            if (stage == 6 || stage == 12) {
                for (var i = 0; i < objectList.length; i++) {
                    if (objectList[i].types[0] == 6) {
                        var distance = dist(leftPanelW * 2 - (objectList[i].width / 2), centerY - (objectList[i].height / 2), objectList[i].x, objectList[i].y);
                        if (distance > 3) {
                            var dir = Math.atan2(centerY - (objectList[i].height / 2) - objectList[i].y, leftPanelW * 2 - (objectList[i].width / 2) - objectList[i].x);
                            objectList[i].vx = (3 + (distance / 50)) * Math.cos(dir);
                            objectList[i].vy = (3 + (distance / 50)) * Math.sin(dir);
                        } else {
                            objectList.splice(i, 1);
                            energyStored++;
                            if (stage == 6) {
                                stage = 7;
                                internalCO2 = 0;
                                internalH2O = 0;
                                moleculesBroken = 0;
                                totalO2 = 0;
                                addedO2 = 0;
                            } else {
                                stage = 13;
                            }
                        }
                    }
                }
            }

            if (stage == 13) {
                for (var i = 0; i < objectList.length; i++) {
                    if (objectList[i].types[0] == 4) {
                        if (objectList[i].route.length == 0) {
                            objectList[i].route.push(new coord(leftPanelW * 2.8, canvasHeight * 0.55), new coord(leftPanelW * 2.6, canvasHeight * 0.9 - 50), new coord(leftPanelW * 3, canvasHeight * 0.9 - 50), new coord(leftPanelW * 3.5, canvasHeight * 0.8));
                        }
                        var distance = dist(leftPanelW * 3.5, canvasHeight * 0.8, objectList[i].x, objectList[i].y);
                        if (distance <= 3) {
                            objectList.splice(i, 1);
                            matterAfter += 180 * (45 / 372); // 186
                            //energyAfter += 45;
                            if (matterLevel < 2 || completeCycles == 1) {
                                if (energyLevel < 2) {

                                    stage = 14;
                                    //resetMiniTable();
                                    //syncTables(false);
                                    playing = false;
                                    document.getElementById('playPause').disabled = true;
                                    document.getElementById('nextTrialP').style.visibility = "inherit";
                                    termType = 'n14';
									hintSound.play();
                                    window.setTimeout(
                                        alertBoxComplete, 2000, "<img src='datacollection_icon.png'><font color='#006600'><b>Record Your Data</b></font><br><br>You have finished your experiment. <br><br>Look at the <mark><b>ENERGY Graph</mark></b> and the <b><span style='background-color: #66b9bf'>MATTER graph</span></b>.<img src='arrow_right.png'><p style='background-color:#ebfaeb;><b>Was <font color='orange'>light energy</font> transformed into <font color='green'>glucose</font>?</b> </p><img src='datacollection_icon.png'><font color='red'>Record your findings from the graphs to the table below.</font><br><br><img src='recordtable1.png></font>");//some-some
                                    macroLevel = 1;

                                } else {
                                    stage = 14;
                                    //playing = false;
                                }
                            } else if (completeCycles == 0) {
                                completeCycles++;
                                stage = 1;
                                internalCO2 = 0;
                                internalH2O = 0;
                                moleculesBroken = 0;
                                totalO2 = 0;
                                addedO2 = 0;
                            }
                        }
                    }
                }
            }

            if (stage == 14 && playing) {
                if (internalLight == null && totalLight < energyLevel * 2) {
                    var light0 = new particle(leftPanelW + 5, -40, 10, [5], [0], [0]);
                    light0.collidable = false;
                    light0.width = 70;
                    light0.height = 35;
                    light0.vx = 0;
                    light0.vy = 0;
                    light0.vr = 0;
                    light0.internal = true;
                    light0.route.push(new coord(leftPanelW + 5, canvasHeight * 0.6), new coord(leftPanelW * 1.2 + (90 * totalLight), canvasHeight * 0.55));
                    objectList.push(light0);
                    internalLight = light0;
                    totalLight++;
                    newLight = true;
                }
                if (internalLight == null) { // no more light
                    if (pause < 105) {
                        pause++;
                    } else {
                        if (matterLevel == 1) {
                            macroLevel = 1;
                            thermalEnergy = true;
                            console.log("High/little");

                        } else {
                            macroLevel = 2;
                            var sound = new Audio(audioLink + 'flower.mp3');
                            sound.play();
                            console.log("High/High");
                        }
                        //resetMiniTable();
                        //syncTables(false);
                        playing = false;
                        document.getElementById('playPause').disabled = true;
                        document.getElementById('nextTrialP').style.visibility = "inherit";
                        termType = 'n14';
						hintSound.play();
                        if (matterLevel == 1) {
                            window.setTimeout(
                                alertBoxNext, 2000, "The extra <font color=\"#ff9803\">light energy</font> <u><b>is transformed (changed)</b></u> into <font color=\"red\">thermal energy.</font>");
                            console.log("change");
                        } else {
							
                            window.setTimeout(
                                alertBoxComplete,
                                2000, "<img src='datacollection_icon.png'><font color='#006600'><b>Record Your Data</b></font><br><br>You have finished your experiment. <br><br>Look at the <mark><b>ENERGY Graph</mark></b> and the <b><span style='background-color: #66b9bf'>MATTER graph</span></b>.<img src='arrow_right.png'><p style='background-color: #66b9bf'>Was <font color='orange'>light energy</font> transformed? Were <b>carbon dioxide</b> and <b>water</b> rearranged to form glucose and oxygen? </p><img src='datacollection_icon.png'><font color='red'>Record your findings from the graphs to the table below.</font><br><br><img src='recordtable1.png></font>");
                        }
                        console.log("sjkgsdkjfkdsn");
                    }
                } else { // transform light into heat
                    if (internalLight.route.length == 0) {
                        internalLight.path = "lightToHeat.png";
                        internalLight.anim = 10;
                        internalLight.types[0] = 7;
                        internalLight = null;
                        pause = 0;
                        var sound = new Audio(audioLink + 'transformsound.mp3');
                        sound.play();
                    }
                }
            }

            //var stepped = false;
            for (var i = 0; i < objectList.length; i++) { // check for collisions and move O2 away from sim area
                if (objectList[i].collidable && objectList[i].internal) {
                    var obj1 = objectList[i];
                    colLoop1: for (var j = 0; j < objectList.length; j++) {
                        var obj2 = objectList[j];
                        if (obj2 != obj1 && objectList[j].collidable && objectList[i].internal) {
                            if (checkCollision(obj1, obj2)) {
                                break colLoop1;
                            }
                        }
                    }
                } else { // if O2 then move to graphs
                    if (objectList[i].types.length == 2) {
                        /*var distance = dist(leftPanelW*3.8, canvasHeight*0.9-20,objectList[i].x , objectList[i].y);
                        if(distance > 3){
                            var dir = Math.atan2(canvasHeight*0.9-20 - objectList[i].y , leftPanelW*3.8 - objectList[i].x);
                            objectList[i].vx = (2 + (distance/50) )* Math.cos(dir);
                            objectList[i].vy = (2 + (distance/50) )* Math.sin(dir);
                        }else{
                            addedO2++;
                            objectList.splice(i,1);
                            matterAfter += 32*(45/372); // 186
                        }*/
                        if (objectList[i].route.length == 0) {
                            objectList[i].route.push(new coord(leftPanelW * 2.9, canvasHeight * 0.6), new coord(leftPanelW * 2.7, canvasHeight * 0.9 + 10), new coord(leftPanelW * 3, canvasHeight * 0.9 + 10), new coord(leftPanelW * 3.8, canvasHeight * 0.9 - 20));
                        }

                        var distance = dist(leftPanelW * 3.8, canvasHeight * 0.9 - 20, objectList[i].x, objectList[i].y);
                        if (distance <= 3) {
                            addedO2++;
                            objectList.splice(i, 1);
                            matterAfter += 32 * (45 / 372); // 186
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < objectList.length; i++) {
        if (playing) {
            if (objectList[i].types[0] == 3 && stage >= 7 && stage < 11) {
                var distance = dist(leftPanelW * 2.6, centerY - 42, objectList[i].x, objectList[i].y);
                if (distance > 3) {
                    var dir = Math.atan2(centerY - 42 - objectList[i].y, leftPanelW * 2.6 - objectList[i].x);
                    objectList[i].vx = (2 + (distance / 50)) * Math.cos(dir);
                    objectList[i].vy = (2 + (distance / 50)) * Math.sin(dir);
                } else {
                    objectList[i].vx = 0;
                    objectList[i].vy = 0;
                }
            } else if (objectList[i].types[0] == 3 && stage >= 11) {
                var distance = dist(leftPanelW * 2 - 30, centerY - 42, objectList[i].x, objectList[i].y);
                if (distance > 3) {
                    var dir = Math.atan2(centerY - 42 - objectList[i].y, leftPanelW * 2 - 30 - objectList[i].x);
                    objectList[i].vx = (3 + (distance / 50)) * Math.cos(dir);
                    objectList[i].vy = (3 + (distance / 50)) * Math.sin(dir);
                } else {
                    objectList[i].vx = 0;
                    objectList[i].vy = 0;
                }
            }
            var dir = Math.atan2(centerY - objectList[i].y, leftPanelW * 2 - objectList[i].x);
            if (objectList[i].internal) {
                if (delay == 0) {
                    if (dist(leftPanelW * 2, centerY, objectList[i].x, objectList[i].y) >= getInternalRadius(dir + Math.PI) - 38 && objectList[i].collidable) {
                        objectList[i].dir = dir;
                        objectList[i].vx = objectList[i].vel * Math.cos(dir);
                        objectList[i].vy = objectList[i].vel * Math.sin(dir);
                        objectList[i].vr = 0.05;
                    }
                    if (dist(leftPanelW * 2, centerY, objectList[i].x, objectList[i].y) <= getInternalRadius(dir + Math.PI) - objectList[i].r && objectList[i].collidable && !objectList[i].added) {
                        if (objectList[i].r == 26) { // if particle is CO2
                            matterBefore += 44 * (45 / 372);
                        } else {
                            matterBefore += 18 * (45 / 372);
                        }
                        objectList[i].added = true;
                    }
                }
            } else if (objectList[i].collidable && objectList[i].route.length == 0) {
                if (objectList[i].r == 26) { // if particle is CO2
                    if (internalCO2 < 3 && energyLevel - completeCycles > 0) {
                        objectList[i].internal = true;
                        internalCO2++;
                        //matterBefore += 44*(45/372);
                        objectList[i].vel = 1;
                        //objectList[i].vr = 0.05;
                    } else {
                        objectList[i].vx = 0;
                        objectList[i].vy = 0;
                        objectList[i].vr = 0;
                        objectList[i].vel = 0;
                        if (count % vibrateSpeed == 0 && playing) { //&& delay == 0){
                            if ((count / vibrateSpeed) % 2 == 0) {
                                objectList[i].x += vibrateAmt;
                                objectList[i].y += vibrateAmt;
                            } else {
                                objectList[i].x -= vibrateAmt;
                                objectList[i].y -= vibrateAmt;
                            }
                        }
                    }
                } else {
                    if (internalH2O < 3 && energyLevel - completeCycles > 0) {
                        objectList[i].internal = true;
                        internalH2O++;
                        //matterBefore += 18*(45/372);
                        objectList[i].vel = 1;
                        objectList[i].vr = 0;
                    } else {
                        objectList[i].vx = 0;
                        objectList[i].vy = 0;
                        objectList[i].vr = 0;
                        objectList[i].vel = 0;
                        if (count % vibrateSpeed == 0 && playing) { //&& delay == 0){
                            if ((count / vibrateSpeed) % 2 == 0) {
                                objectList[i].x += vibrateAmt;
                                objectList[i].y += vibrateAmt;
                            } else {
                                objectList[i].x -= vibrateAmt;
                                objectList[i].y -= vibrateAmt;
                            }
                        }
                    }
                }
            }
        }
        objectList[i].update();
    }


    /*
    ctx.beginPath();
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillStyle = "#c4e3f4";
    ctx.fillRect(0,canvasHeight*.87,leftPanelW,canvasHeight*0.13);
    ctx.closePath();
    */

    drawFrame();

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update();
    }

    drawGraphs();


    if (active_drag != null) { //if an object is being dragged, render it on top of everything else, I.E the sliders
        active_drag.update();
    }
    // console.log('test: ' + getTrialNum(false) + '_' + currentOpenTab);
    if (document.getElementById('bmMini').value == "" ||
        document.getElementById('amMini').value == "" ||
        document.getElementById('beMini').value == "" ||
        document.getElementById('aeMini').value == "") {
        //document.getElementById('nextTrial').style.visibility = "hidden";
        document.getElementById('nextTrialP').style.visibility = "hidden";
        //document.getElementById('nextTrialPP').style.visibility = "hidden";
    } else {
        //document.getElementById('nextTrial').style.visibility = "inherit";
        document.getElementById('nextTrialP').style.visibility = "inherit";
        //document.getElementById('nextTrialPP').style.visibility = "inherit";
    }
}

var a = leftPanelW;
var b = canvasHeight * 0.20;
var b2 = canvasHeight * 0.28;

function getInternalRadius(angle) {
    var r = 0;
    if (angle <= Math.PI) {
        r = (a * b) / (Math.sqrt(Math.pow((b * Math.cos(angle)), 2) + Math.pow((a * Math.sin(angle)), 2)));
    } else {
        r = (a * b2) / (Math.sqrt(Math.pow((b2 * Math.cos(angle)), 2) + Math.pow((a * Math.sin(angle)), 2)));
    }
    return r;
}

c.mousemove(function (e) { //called whenever the mouse moves
    mouseXp = mouseX;
    mouseYp = mouseY;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (mousePressed && mouseX != mouseXp && mouseY != mouseYp) {
        dragging = true;
    }

})

$(document).mousedown(function () { //event listener for mouse clicks
    mousePressed = true;
}).mouseup(function () {

    if (active_drag instanceof slider) {
        if (active_drag.type == 0) {
            energySlider++;
            switch (active_drag.setting) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
            }
        } else {
            matterSlider++;
            switch (active_drag.setting) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
            }
        }
    }

    mousePressed = false;
    dragging = false;
    active_drag = null;
});

function drawActiveBG() {
    ctx.beginPath();
    ctx.shadowColor = "rgba(0,0,0,0)";
    var bg = new Image();
    bg.src = "plantCellBg.png";
    ctx.drawImage(bg, leftPanelW, 0, leftPanelW * 2, canvasHeight);
    ctx.closePath();

    ctx.beginPath();
    var chloro = new Image();
    chloro.src = "chloroplastBg.png";
    ctx.drawImage(chloro, leftPanelW, -50, leftPanelW * 2, 416);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#076455";
    ctx.fillRect(leftPanelW, canvasHeight - 50, (leftPanelW * 2), 30);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "#16b298";
    ctx.fillRect(leftPanelW + 1, canvasHeight - 48, (leftPanelW * 2) - 2, 26);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.fillRect(leftPanelW, canvasHeight - 20, (leftPanelW * 2), 20);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPanelW + 1, canvasHeight - 19, (leftPanelW * 2) - 2, 18);
    ctx.closePath();


    if (done) {
        ctx.beginPath();
        ctx.fillStyle = "#666";
        ctx.fillRect(leftPanelW + 1, canvasHeight - 19, (stage + (13 * completeCycles)) * (((leftPanelW * 2) - 2) / totalStages), 18);
        ctx.closePath();
    }
}

function drawFrame() {
    ctx.beginPath();
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillStyle = "#c4e3f4";//setting bgcolor original #c4e3f4
    ctx.fillRect(0, 0, leftPanelW, canvasHeight);
    ctx.closePath();

    ctx.beginPath();


    switch (macroLevel) {
        case 0:
            var macro = new Image(); //dead
            macro.src = "macroBase0.png";
            ctx.drawImage(macro, 0, 0);
            break;
        case 1:
            var macro = new Image(); //sprouted
            macro.src = "macroBase1.png";
            ctx.drawImage(macro, 0, 0);
            break;
        case 2:
            var macro = new Image(); //bloomed
            macro.src = "macroBase2.png";
            ctx.drawImage(macro, 0, 0);
            break;
        case 3:
            var macro = new Image(); //base
            macro.src = "macroBase.png";
            ctx.drawImage(macro, 0, 0);
            break;
    }

    //do not save the matterlevel and energy to wise because it will overload the studentData.html file and cause a 400 request error
    switch (matterLevel) {
        case 0:
            if (slidersMoved == false) {
                slidersMoved = true;
            }
            break;
        case 1:
            var people = new Image();
            people.src = "macroLittle.png";
            ctx.drawImage(people, 0, 0);
            if (slidersMoved == false) {
                slidersMoved = true;
            }
            break;
            // case 2:
            //     var people = new Image(); 
            //     people.src = "macroLot.png";
            //     ctx.drawImage(people, 0, 0);
            //     if(slidersMoved == false){
            //         saveStateToWISE('Matter-A-Lot');
            //         slidersMoved = true;
            //     }
            //     break;
    }

    switch (energyLevel) {
        case 0:
            var light = new Image();
            light.src = "macroNone.png";
            ctx.drawImage(light, 0, 0);
            if (slidersMoved == false) {
                slidersMoved = true;
            }
            break;
        case 1:
            var light = new Image();
            light.src = "macroLow.png";
            ctx.drawImage(light, 0, 0);
            if (slidersMoved == false) {
                slidersMoved = true;
            }
            break;
            // case 2:
            //     var light = new Image();
            //     light.src = "macroHigh.png";
            //     ctx.drawImage(light, 0, 0);
            //     if(slidersMoved == false){
            //         saveStateToWISE('Energy-High');
            //         slidersMoved = true;
            //     }
            //     break;
    }

    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // ctx.moveTo(leftPanelW * 0.2, canvasHeight * 0.4);
    // ctx.lineTo(leftPanelW * 0.3, canvasHeight * 0.4);
    // ctx.moveTo(leftPanelW * 0.7, canvasHeight * 0.4);
    // ctx.lineTo(leftPanelW * 0.8, canvasHeight * 0.4);

    //top lines
    ctx.moveTo(leftPanelW * 0.2, canvasHeight * 0.47); //.4
    ctx.lineTo(leftPanelW * 0.3, canvasHeight * 0.47);
    ctx.moveTo(leftPanelW * 0.7, canvasHeight * 0.47);
    ctx.lineTo(leftPanelW * 0.8, canvasHeight * 0.47);

    ctx.moveTo(leftPanelW * 0.2, canvasHeight * 0.57);
    ctx.lineTo(leftPanelW * 0.3, canvasHeight * 0.57);
    ctx.moveTo(leftPanelW * 0.7, canvasHeight * 0.57);
    ctx.lineTo(leftPanelW * 0.8, canvasHeight * 0.57);

    ctx.moveTo(leftPanelW * 0.3, canvasHeight * 0.47); // changed from canvasHeight * 0.4
    ctx.lineTo(leftPanelW * 0.3, canvasHeight * 0.57); //left line up
    ctx.moveTo(leftPanelW * 0.8, canvasHeight * 0.47); // changed from canvasHeight * 0.4
    ctx.lineTo(leftPanelW * 0.8, canvasHeight * 0.57); //right line up

    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 20px Calibri";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";

    ctx.fillText("Settings", leftPanelW * 0.2 + 20, canvasHeight * 0.41 + 4);

    ctx.font = "bold 16px Calibri";
    // ctx.fillText("High", leftPanelW * 0.2 - 40, canvasHeight * 0.4 + 4);
    ctx.fillText("Some", leftPanelW * 0.2 - 40, canvasHeight * 0.47 + 4);
    ctx.fillText("None", leftPanelW * 0.2 - 40, canvasHeight * 0.57 + 4);
    // ctx.fillText("A Lot", leftPanelW * 0.7 - 40, canvasHeight * 0.4 + 4);
    ctx.fillText("Some", leftPanelW * 0.7 - 40, canvasHeight * 0.47 + 4);
    ctx.fillText("None", leftPanelW * 0.7 - 40, canvasHeight * 0.57 + 4);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    //positions of links
    //ctx.fillText("Light", leftPanelW * 0.2 - 30, canvasHeight * 0.75 + 0);
    //ctx.fillText("Energy", leftPanelW * 0.2 - 35, canvasHeight * 0.75 + 16);
    //ctx.fillText("Water(H2O)&", leftPanelW * 0.7 - 60, canvasHeight * 0.75 + 0);
    //ctx.fillText("Carbon Dioxide(CO2)", leftPanelW * 0.7 - 80, canvasHeight * 0.75 + 16);
    ctx.closePath();


    ctx.beginPath();
    var lightWave = new Image();
    lightWave.src = "lightEnergyWave.png";
    ctx.drawImage(lightWave, 5, canvasHeight * 0.71, 70 * 0.8, 35 * 0.8);
    ctx.closePath();

    ctx.beginPath();
    var h2o = new Image();
    h2o.src = "photoSim_H2O.png";
    ctx.drawImage(h2o, 90, canvasHeight * 0.71, h2o.width * 0.7, h2o.height * 0.7);
    ctx.closePath();

    ctx.beginPath();
    var co2 = new Image();
    co2.src = "photoSim_CO2.png";
    ctx.drawImage(co2, 150, canvasHeight * 0.72, co2.width * 0.7, co2.height * 0.7);
    ctx.closePath();

    //fasterBtn();

    if (thermalEnergy) {
        ctx.beginPath();
        ctx.beginPath();
        ctx.font = "bold 28px Calibri";
        ctx.fillStyle = "#e20";
        ctx.textAlign = "left";
        ctx.fillText("Thermal Energy", leftPanelW * 1.6, canvasHeight * 0.7);
        ctx.closePath();
    }

    ctx.beginPath();
    ctx.fillStyle = "#6c6488";//graph area bgcolor original #f8d7c0 #fedcd2 0b3c5d 6c6488 purple
    ctx.fillRect(leftPanelW * 3, 0, leftPanelW, canvasHeight);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    //ctx.fillText("The Amount of Energy used", leftPanelW * 3.15 - 00, canvasHeight * 0.03 + 0);
    //ctx.fillText("in", leftPanelW * 3.30 - 00, canvasHeight * 0.03 + 16);
    //ctx.fillText("The Amount of\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0in the", leftPanelW * 3.10 - 00, canvasHeight * 0.48 + 0);
    //ctx.fillText("           ", leftPanelW * 3.35 - 00, canvasHeight * 0.48 + 16);
    ctx.closePath();

    ctx.beginPath();
    var etable = new Image();
    etable.src = "graphEdit.png";
    ctx.drawImage(etable, (leftPanelW * 3) + 5, canvasHeight * 0.095, 205, 80); //img, x, y, width, height
    ctx.closePath();

    ctx.beginPath();
    var mtable = new Image();
    mtable.src = "graphEdit.png";
    ctx.drawImage(mtable, (leftPanelW * 3) + 3.5, canvasHeight * 0.6, 205, 80); //.53
    ctx.closePath();

    ctx.beginPath();
    var light = new Image();
    light.src = "lightEnergyWave.png";
    ctx.drawImage(light, leftPanelW * 3.25, canvasHeight * 0.38, 70 * 0.8, 35 * 0.8);
    ctx.closePath();

    ctx.beginPath();
    var chem = new Image();
    chem.src = "chemicalEnergy.png";
    ctx.drawImage(chem, leftPanelW * 3.65, canvasHeight * 0.37, chem.width * 0.3, chem.height * 0.3);
    ctx.closePath();


    ctx.beginPath();
    var h2o = new Image();
    h2o.src = "photoSim_H2O.png";
    ctx.drawImage(h2o, leftPanelW * 3.19, canvasHeight * 0.89, h2o.width * 0.6, h2o.height * 0.6);
    ctx.closePath();


    ctx.beginPath();
    var co2 = new Image();
    co2.src = "photoSim_CO2.png";
    ctx.drawImage(co2, leftPanelW * 3.35, canvasHeight * 0.89, co2.width * 0.6, co2.height * 0.6);
    ctx.closePath();

    //if((stage >= 14 || completeCycles > 0) && matterLevel > 0 && energyLevel > 0){
    ctx.beginPath();
    var glucose = new Image();
    glucose.src = "Glucose_glow.png";
    ctx.drawImage(glucose, leftPanelW * 3.58, canvasHeight * 0.87, 55, 55);
    ctx.closePath();
    //}

    //if((stage >= 4 || completeCycles > 0) && matterLevel > 0 && energyLevel > 0){
    ctx.beginPath();
    var o2 = new Image();
    o2.src = "O2.png";
    ctx.drawImage(o2, leftPanelW * 3.84, canvasHeight * 0.89, o2.width * 0.6, o2.height * 0.6);
    ctx.closePath();
    //}


}

function recordSliders() {
    if (document.getElementById('energySettingMini').innerHTML == "None") {
        saveStateToWISE('Energy-None');
        //console.log('Energy-None');
    } else if (document.getElementById('energySettingMini').innerHTML == "Some") {
        saveStateToWISE('Energy-Low');
        //console.log('Energy-Low');
    }

    if (document.getElementById('matterSetting' + getTrialNum(false)).innerHTML == "None") {
        saveStateToWISE('Matter-None');
        //console.log('Matter-None');
    } else if (document.getElementById('matterSetting' + getTrialNum(false)).innerHTML == "Some") {
        saveStateToWISE('Matter-A-Little');
        //console.log('Matter-A-Little');
    }
}

function coord(x, y) {
    this.x = x;
    this.y = y;
}

function slider(x, type) {
    this.x = x;
    this.y = 215; //260
    this.img = new Image();
    this.width = 30;
    this.height = 20;
    this.img.src = "slider.png";
    this.type = type;
    this.setting = 0; // 0-none, 1-low, 2-high

    this.update = function () {
        if (mousePressed && this.hovering() && !dragging && stage == 0) {
            dragging = true;
            active_drag = this;
        }

        if (active_drag == this && stage == 0) {
            var dist2 = Math.abs(mouseY - (canvasHeight * 0.35 - (this.height / 2))); //a lot
            var dist1 = Math.abs(mouseY - (canvasHeight * 0.47 - (this.height / 2))); //low .5
            var dist0 = Math.abs(mouseY - (canvasHeight * 0.57 - (this.height / 2))); //none .6
            var mindist = Math.min(dist2, Math.min(dist1, dist0));
            switch (mindist) {
                case dist0:
                    this.setting = 0;
                    this.y = canvasHeight * 0.57 - (this.height / 2); //.6
                    if (this.type == 0) {
                        energyLevel = 0;
                        document.getElementById('energySetting' + getTrialNum(false)).innerHTML = "<img src='nolight.png'><font color='grey'>None</font>";
                        document.getElementById('energySettingMini').innerHTML = "<img src='nolight.png'><font color='grey'>None</font>";
                    } else {
                        matterLevel = 0;
                        document.getElementById('matterSetting' + getTrialNum(false)).innerHTML = "<img src='nomatter.png'><font color='grey'>None</font>";
                        document.getElementById('matterSettingMini').innerHTML = "<img src='nomatter.png'><font color='grey'>None</font>";
                        //console.log('NONE');
                        objectList = [];
                    }
                    break;
                case dist1:
                    this.setting = 1;
                    this.y = canvasHeight * 0.47 - (this.height / 2); //.5
                    if (this.type == 0) {
                        energyLevel = 1;
                        document.getElementById('energySetting' + getTrialNum(false)).innerHTML = "<img src='somelight.png'>Some";
                        document.getElementById('energySettingMini').innerHTML = "<img src='somelight.png'>Some";
                    } else {
                        matterLevel = 1;
                        document.getElementById('matterSetting' + getTrialNum(false)).innerHTML = "<img src='somematter.png'>Some";
                        document.getElementById('matterSettingMini').innerHTML = "<img src='somematter.png'>Some";
                        //console.log('A-LITTLE');
                        objectList = [];
                        for (var i = 0; i < 6; i++) {
                            var part1 = new particle(leftPanelW * 0.8 - 5, canvasHeight * 0.9 + 10, 26, [2, 1, 1], [0, 16, 16], [0, pi, 0]);
                            part1.wait += 15 * i;
                            part1.route.push(new coord(leftPanelW, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.4, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.6, canvasHeight * 0.8), initialPositions[i]);
                            objectList.push(part1);
                        }
                        for (var i = 0; i < 6; i++) {
                            var part1 = new particle(leftPanelW * 0.5 - 2, canvasHeight * 0.9 + 12, 20, [1, 0, 0], [0, 13, 13], [0, 5 / 6 * pi, 1 / 6 * pi]);
                            part1.wait += 15 * (i + 6);
                            part1.route.push(new coord(leftPanelW, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.4, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.6, canvasHeight * 0.8), initialPositions[i + 12]);
                            objectList.push(part1);
                        }
                        if (delay == 0 && stage == 0) {
                            delay = 290;
                        }
                        totalStages = 14;
                    }
                    break;
                    //removes ability of mouse to reach High / A lot settings
                    // case dist2:
                    //     this.setting = 2;
                    //     this.y = canvasHeight * 0.4 - (this.height / 2);
                    //     if (this.type == 0) {
                    //         energyLevel = 2;
                    //         document.getElementById('energySetting' + trial).innerHTML = "High";
                    //         document.getElementById('energySettingMini').innerHTML = "High";
                    //     } else {
                    //         matterLevel = 2;
                    //         document.getElementById('matterSetting' + trial).innerHTML = "A Lot";
                    //         document.getElementById('matterSettingMini').innerHTML = "A Lot";
                    //         objectList = [];
                    //         for (var i = 0; i < 12; i++) {
                    //             var part1 = new particle(leftPanelW * 0.8 - 5, canvasHeight * 0.9 + 10, 26, [2, 1, 1], [0, 16, 16], [0, pi, 0]);
                    //             part1.wait += 15 * i;
                    //             part1.route.push(new coord(leftPanelW, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.4, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.6, canvasHeight * 0.8), initialPositions[i]);
                    //             objectList.push(part1);
                    //         }
                    //         for (var i = 0; i < 12; i++) {
                    //             var part1 = new particle(leftPanelW * 0.5 - 2, canvasHeight * 0.9 + 12, 20, [1, 0, 0], [0, 13, 13], [0, 5 / 6 * pi, 1 / 6 * pi]);
                    //             part1.wait += 15 * (i + 12);
                    //             part1.route.push(new coord(leftPanelW, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.4, canvasHeight * 0.9 + 10), new coord(leftPanelW * 1.6, canvasHeight * 0.8), initialPositions[i + 12]);
                    //             objectList.push(part1);
                    //         }
                    //         if ((delay == 0 || delay == 290) && stage == 0) {
                    //             delay = 470;
                    //         }
                    //         totalStages = 25;
                    //     }
                    //     break;
            }
        }
        this.draw();

    }

    this.draw = function () {

        if (stage == 0) {
            if (this.hovering() || active_drag == this) {
                ctx.beginPath();
                ctx.shadowColor = "rgba(0, 0, 0, 1)";
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowBlur = 3;
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.closePath();
            }

            ctx.beginPath();
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.closePath();
        } else {

            ctx.beginPath();
            ctx.globalAlpha = 0.6;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
            ctx.closePath();
        }
    }

    this.hovering = function () {
        if (this.x < mouseX && mouseX < this.x + this.width && this.y < mouseY && mouseY < this.y + this.height) {
            return true;
        } else {
            return false;
        }
    }
}

function drawGraphs() {
    //Energy
    var ex = leftPanelW * 3 + 46;
    var ey = canvasHeight * 0.291; //.338

    var my = canvasHeight * 0.794;

    //energyBefore = energyLevel*44.5;
    //matterBefore = matterLevel*45;

    ctx.beginPath();
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.closePath();

    var energyDisp = 0;

    if (energyCurrent != energyAfter) {
        if (energyProgress != 50) {
            energyDisp = energyCurrent + (energyAfter - energyCurrent) * (energyProgress / 50);
            energyProgress++;
        } else {
            energyCurrent = energyAfter;
            energyDisp = energyAfter;
            energyProgress = 0;
        }
    } else {
        energyDisp = energyAfter;
    }

    //light energy and chemical energy graph bar
    if (energyLevel != 0 && energyBefore != 0) {
        ctx.beginPath();
        ctx.fillStyle = "#fff411";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(ex + 10, ey - energyBefore, 60, energyBefore);
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#fff411";
        ctx.globalAlpha = 1;
        ctx.setLineDash([8.02, 10]);
        ctx.lineWidth = 2;
        ctx.moveTo(ex + 10, ey);
        ctx.lineTo(ex + 10, ey - energyBefore);
        ctx.lineTo(ex + 70, ey - energyBefore);
        ctx.lineTo(ex + 70, ey);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#fff411";
        ctx.fillRect(ex + 10, ey - (energyBefore - energyDisp), 60, (energyBefore - energyDisp));
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#59a162";
        ctx.fillRect(ex + 100, ey - energyDisp, 60, energyDisp);
        ctx.closePath();
    }

    if (matterLevel != 0 && matterBefore != 0) {
        ctx.beginPath();
        ctx.fillStyle = "#2f86b7";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(ex + 10, my - matterBefore, 60, matterBefore);
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#2f86b7";
        ctx.globalAlpha = 1;
        ctx.setLineDash([8.02, 10]);
        ctx.lineWidth = 2;
        ctx.moveTo(ex + 10, my);
        ctx.lineTo(ex + 10, my - matterBefore);
        ctx.lineTo(ex + 70, my - matterBefore);
        ctx.lineTo(ex + 70, my);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#2f86b7";
        ctx.fillRect(ex + 10, my - (matterBefore - matterAfter), 60, (matterBefore - matterAfter));
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#2a99d6";
        ctx.fillRect(ex + 100, my - matterAfter, 60, matterAfter);
        ctx.closePath();
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

var atomMasses = [1, 16, 12];

function particle(x, y, r, types, rOff, aOff) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.types = types; // array with 0 being root element
    this.radii = []; // array with 0 being root element radius
    this.rOff = rOff; // array with radial offests
    this.aOff = aOff; // angle of offsets
    this.r = r; // outer bound to check for collisions
    this.mass = atomMasses[types[0]];
    this.vel = 1;
    this.dir = 1 / 4 * pi; // floats from 0 to 2pi 
    this.vx = this.vel * Math.cos(this.dir);
    this.vy = this.vel * Math.sin(this.dir);
    this.rot = 0;
    this.vr = 0.00;
    this.collidable = true;
    this.progress = 0;
    this.internal = false;
    this.disabled = false;
    this.anim = 0;
    this.path = "";
    this.delay = 0;
    this.added = false;
    this.route = [];
    this.wait = 0;

    for (var i = 0; i < types.length; i++) {
        this.radii.push(0);
    }
    for (var i = 0; i < types.length; i++) {
        this.radii[i] = atomRadii[this.types[i]];
    }

    this.update = function () {
        if (playing) {
            if (this.wait > 0) {
                this.wait--;
            } else if (stage == 3 || stage == 9) {

            } else {
                if (this.route.length > 0) {
                    var distance = dist(this.route[0].x, this.route[0].y, this.x, this.y);
                    if (distance > 3) {
                        var dir = Math.atan2(this.route[0].y - this.y, this.route[0].x - this.x);
                        this.vx = 4 * this.vel * Math.cos(dir);
                        this.vy = 4 * this.vel * Math.sin(dir);
                    } else {
                        this.vx = 0;
                        this.vy = 0;
                        this.route.shift();
                    }
                }
                this.x += this.vx;
                this.y += this.vy;
                this.rot += this.vr;
            }
        }
        this.draw();
    }

    this.draw = function () {
        if (this.anim != 0) {
            if (this.delay == 8) {
                this.anim--;
                this.delay = 0;
            } else {
                this.delay++;
            }
            ctx.beginPath();
            var img = new Image();
            img.src = this.path;
            ctx.drawImage(img, 70 * (10 - this.anim), 0, this.width, this.height, this.x, this.y, this.width, this.height);
            ctx.closePath();
        } else {
            if (this.types[0] == 3 && energyStored >= 1) {
                //before combined
                ctx.beginPath();
                ctx.shadowColor = '#31ce5c';
                ctx.shadowBlur = 50;
                ctx.closePath();
            } else if (this.types[0] == 4 && energyStored >= 2) {
                //after combined
                ctx.beginPath();
                ctx.shadowBlur = 50;
                ctx.shadowColor = "#31ce5c";
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.shadowBlur = 0;
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.closePath();
            }

            ctx.beginPath();
            for (var i = 0; i < types.length; i++) {
                if (types[i] > 2) {
                    var img = new Image();
                    img.src = atomImagePath[this.types[i]];
                    ctx.drawImage(img, this.x, this.y, this.width, this.height);
                } else {
                    var img = new Image();
                    img.src = atomImagePath[this.types[i]];
                    ctx.drawImage(img, this.x + this.rOff[i] * Math.cos(this.aOff[i] + this.rot) - this.radii[i], this.y + this.rOff[i] * Math.sin(this.aOff[i] + this.rot) - this.radii[i], this.radii[i] * 2, this.radii[i] * 2);
                }
            }
            ctx.closePath();
        }
    }

    this.collideIndex = function (other) { // will return an array containing the indices of the colliding objects in their respective parents at pos 0 and 1 or null if no collision is found
        if (dist(this.x, this.y, other.x, other.y) <= this.r + other.r) {
            for (var i = 0; i < this.types.length; i++) {
                var x1 = this.x + this.rOff[i] * Math.cos(this.aOff[i] + this.rot);
                var y1 = this.y + this.rOff[i] * Math.sin(this.aOff[i] + this.rot);
                var r1 = this.radii[i];
                for (var j = 0; j < other.types.length; j++) {
                    var x2 = other.x + other.rOff[j] * Math.cos(other.aOff[j] + other.rot);
                    var y2 = other.y + other.rOff[j] * Math.sin(other.aOff[j] + other.rot);
                    var r2 = other.radii[j];
                    if (dist(x1, y1, x2, y2) <= r1 + r2) {
                        return [i, j];
                    }
                }
            }
            return null; // possible collision dodged by rotation
        } else {
            return null; // no collision possible
        }
    }
}

function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

function checkCollision(ball0, ball1) {
    var dx = ball1.x - ball0.x;
    var dy = ball1.y - ball0.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    //collision handling code here
    if (dist < ball0.radii[0] + ball1.radii[0] && (ball0.internal == ball1.internal)) {
        if ((ball0.vel + ball1.vel) > 1.2 && ball0.internal && ball1.internal && (stage == 4 || stage == 10)) {
            if (ball0.types.length == 1 && ball0.types[0] == 1 && ball1.types.length == 1 && ball1.types[0] == 1 && totalO2 < 3) {
                totalO2++;
                objectList.splice(objectList.indexOf(ball0), 1);
                objectList.splice(objectList.indexOf(ball1), 1);
                var newO2 = new particle(ball0.x, ball0.y, 0, [1, 1], [9, 9], [Math.PI, 0]);
                newO2.vr = 0;
                newO2.collidable = false;
                objectList.push(newO2);
                return true;
            }
        }

        if ((ball0.vel + ball1.vel) > 2.0 && ball0.internal && ball1.internal && (stage == 2 || stage == 8)) {
            if (ball0.r == 26 || ball0.r == 20) {
                objectList.splice(objectList.indexOf(ball0), 1);
                for (var i = 0; i < ball0.types.length; i++) {
                    var part = new particle(ball0.x + (ball0.rOff[i] + 5) * Math.cos(ball0.aOff[i] + ball0.rot), ball0.y + (ball0.rOff[i] + 5) * Math.sin(ball0.aOff[i] + ball0.rot), atomRadii[ball0.types[i]], [ball0.types[i]], [0], [0]);
                    part.internal = true;
                    part.added = true;
                    objectList.push(part);
                }
                if (!ball0.added) {
                    if (ball0.r == 26) {
                        matterBefore += 44 * (45 / 372);
                    } else {
                        matterBefore += 18 * (45 / 372);
                    }
                }
                moleculesBroken++;
            }

            if (ball1.r == 26 || ball1.r == 20) {
                objectList.splice(objectList.indexOf(ball1), 1);
                for (var i = 0; i < ball1.types.length; i++) {
                    var part = new particle(ball1.x + (ball1.rOff[i] + 5) * Math.cos(ball1.aOff[i] + ball1.rot), ball1.y + (ball1.rOff[i] + 5) * Math.sin(ball1.aOff[i] + ball1.rot), atomRadii[ball1.types[i]], [ball1.types[i]], [0], [0]);
                    part.internal = true;
                    part.added = true;
                    objectList.push(part);
                }
                if (!ball1.added) {
                    if (ball1.r == 26) {
                        matterBefore += 44 * (45 / 372);
                    } else {
                        matterBefore += 18 * (45 / 372);
                    }
                }
                moleculesBroken++;
            }
            return true;
        } else {
            //calculate angle, sine, and cosine
            var angle = Math.atan2(dy, dx);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);

            //rotate ball0's position
            var pos0 = {
                x: 0,
                y: 0
            }; //point

            //rotate ball1's position
            var pos1 = rotate(dx, dy, sin, cos, true);

            //rotate ball0's velocity
            var vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true);

            //rotate ball1's velocity
            var vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);

            //collision reaction
            var vxTotal = vel0.x - vel1.x;
            vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) /
                (ball0.mass + ball1.mass);
            vel1.x = vxTotal + vel0.x;

            //update position
            pos0.x += vel0.x;
            pos1.x += vel1.x;

            //rotate positions back
            var pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
            var pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

            //adjust positions to actual screen positions
            if (stage != 3 && stage != 9) {
                ball1.x = ball0.x + pos1F.x;
                ball1.y = ball0.y + pos1F.y;
                ball0.x = ball0.x + pos0F.x;
                ball0.y = ball0.y + pos0F.y;
            }

            //rotate velocities back
            var vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
            var vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
            ball0.vx = vel0F.x;
            ball0.vy = vel0F.y;
            ball1.vx = vel1F.x;
            ball1.vy = vel1F.y;

            ball0.vel = Math.sqrt(Math.pow(ball0.vx, 2) + Math.pow(ball0.vy, 2));
            ball1.vel = Math.sqrt(Math.pow(ball1.vx, 2) + Math.pow(ball1.vy, 2));

            ball0.dir = Math.atan(ball0.vy / ball0.vx);
            ball1.dir = Math.atan(ball1.vy / ball1.vx);
        }
    } else {
        var indices = ball0.collideIndex(ball1);
        if (indices != null) {
            var dx = (ball1.x + ball1.rOff[indices[1]] * Math.cos(ball1.aOff[indices[1]] + ball1.rot)) - (ball0.x + ball0.rOff[indices[0]] * Math.cos(ball0.aOff[indices[0]] + ball0.rot));
            var dy = (ball1.y + ball1.rOff[indices[1]] * Math.sin(ball1.aOff[indices[1]] + ball1.rot)) - (ball0.y + ball0.rOff[indices[0]] * Math.sin(ball0.aOff[indices[0]] + ball0.rot));
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball0.radii[indices[0]] + ball1.radii[indices[1]]) {

            }
        }
    }
    return false;
}

var trialAnswers = [];

function addTrial() {

    //syncTables(false);
    document.getElementById('draggable').style.visibility = 'hidden';
    document.getElementById('tableWrapper').style.visibility = 'visible';


    var currentTrial = [];

    currentTrial.push(document.getElementById('bm' + getTrialNum(false) + '_' + currentOpenTab).value);
    currentTrial.push(document.getElementById('am' + getTrialNum(false) + '_' + currentOpenTab).value);
    currentTrial.push(document.getElementById('be' + getTrialNum(false) + '_' + currentOpenTab).value);
    currentTrial.push(document.getElementById('ae' + getTrialNum(false) + '_' + currentOpenTab).value);

    trialAnswers.push(currentTrial);

    document.getElementById('bm' + getTrialNum(false) + '_' + currentOpenTab).disabled = true;
    document.getElementById('am' + getTrialNum(false) + '_' + currentOpenTab).disabled = true;
    document.getElementById('be' + getTrialNum(false) + '_' + currentOpenTab).disabled = true;
    document.getElementById('ae' + getTrialNum(false) + '_' + currentOpenTab).disabled = true;

    //when it shows up
    // console.log('row' + getTrialNum(false) + '_' + currentOpenTab);
    document.getElementById('row' + getTrialNum(false) + '_' + currentOpenTab).style.visibility = "visible";

    getTrialNum(true);

    if (getTrialNum(false) > 0) {
        var fbtn = document.getElementById('fasterBtn');
        fbtn.classList.remove("dis");
        $(fbtn).addClass('controlButton');
        $('#fasterBtn').prop('disabled', false);
    }

    document.getElementById('feedback_' + currentOpenTab).innerHTML += "<tr id='row" + getTrialNum(false) +
        "_" + currentOpenTab + "' class='row" + currentOpenTab + " rowAll' style='visibility: hidden;''><td class='tg-s27t'>Trial " +
        (getTrialNum(false) + 1) + "</td><td class='tg-7u08' id='energySetting" +
        getTrialNum(false) + "'>None</td><td class='tg-7u08 tblYellow'><select class='form-control' id='be" +
        getTrialNum(false) + "_" + currentOpenTab + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkBE" +
        getTrialNum(false) + "' /></td><td class='tg-7u08 tblGreen'><select class='form-control' id='ae" +
        getTrialNum(false) + "_" + currentOpenTab + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkAE" +
        getTrialNum(false) + "' /></td><td class='tg-7u08' id='matterSetting" +
        getTrialNum(false) + "'>None</td><td class='tg-7u08 tblDarkBlue'><select class='form-control' id='bm" +
        getTrialNum(false) + "_" + currentOpenTab + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkBM" +
        getTrialNum(false) + "' /></td><td class='tg-7u08 tblLightBlue'><select class='form-control' id='am" +
        getTrialNum(false) + "_" + currentOpenTab + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkAM" +
        getTrialNum(false) + "'/></td></tr>";

    reset();
    slidersMoved = false;

    //console.log("ADD TRIAL ANSWERS: " + trialAnswers.toString());

    for (var i = 0; i < getTrialNum(false); i++) {
        document.getElementById('bm' + i + '_' + currentOpenTab).value = trialAnswers[i][0];
        document.getElementById('am' + i + '_' + currentOpenTab).value = trialAnswers[i][1];
        document.getElementById('be' + i + '_' + currentOpenTab).value = trialAnswers[i][2];
        document.getElementById('ae' + i + '_' + currentOpenTab).value = trialAnswers[i][3];
    }
    document.getElementById('nextTrialP').style.visibility = 'inherit';

    document.getElementById('bm' + getTrialNum(false) + '_' + currentOpenTab).value = "";
    document.getElementById('am' + getTrialNum(false) + '_' + currentOpenTab).value = "";
    document.getElementById('be' + getTrialNum(false) + '_' + currentOpenTab).value = "";
    document.getElementById('ae' + getTrialNum(false) + '_' + currentOpenTab).value = "";

    document.getElementById('feedback_' + currentOpenTab).scrollTop += 80;

    document.getElementById('feedback_1').style.visibility = 'hidden';
    document.getElementById('feedback_2').style.visibility = 'hidden';

    document.getElementById('feedback_' + currentOpenTab).style.visibility = 'visible';

    // if (document.getElementById("row0").rowIndex == 0) {
    //     sortTable(0);
    // } else {
    //     sortTable(0);
    //     sortTable(0);
    // }
}

function alertBoxTerms(text) {
    alerting = true;
    document.getElementById('alertTextTerms').innerHTML = text;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxTerms').style.visibility = "visible";
}

function alertBoxComplete(text) {
    alerting = true;
    document.getElementById('alertTextComplete').innerHTML =  text;//speaker icon needs to be removed "<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration(); console.log(termType);'/> " +
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxComplete').style.visibility = "visible";
}

function alertBoxCompleteThermal() {
    alerting = true;
	hintSound.play();

    if (!nextNA) {

        document.getElementById('alertTextCompleteThermal').innerHTML =
            /*"<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='termType = \"n12\"; narration(); console.log(termType);'/> */"<img src='datacollection_icon.png'><font color='#006600'><b>Record Your Data</b></font><br><br>Look at the <mark><b>ENERGY Graph</mark></b> and the <b><span style='background-color: #66b9bf'>MATTER graph</span></b>.<img src='arrow_right.png'><p style='background-color:#ebfaeb;'><img src='hint.png'> <font color=\'#ff9803\'>Light energy</font> <u><font color=\'red\'>CANNOT</font></u> be <u><font color='fusha'>transformed into</font></u> <font color=\'green\'>chemical energy</font> <font color=\'red\'>WITHOUT</font> <b><font color='blue'>carbon dioxide and water</font></b>.</b><br/><br/>Instead, <font color=\'#ff9803\'>light energy</font> is <u>transformed into</u> <font color=\'red\'>thermal energy</font>.</p><img src='datacollection_icon.png'><font color='red'>Record your findings from the graphs to the table below.</font><br><br><img src='recordtable1.png></font>";//some energy, no matter
    } else {
        document.getElementById('alertTextCompleteThermal').innerHTML =
            /*"<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='termType = \"n12\"; narration(); console.log(termType);'/> */"<img src='datacollection_icon.png'><font color='#006600'><b>Record Your Data</b></font><br><br>You have finished your experiment. <br><br>Look at the <mark><b>ENERGY Graph</mark></b> and the <b><span style='background-color: #66b9bf'>MATTER graph</span></b>.<img src='arrow_right.png'><p style='background-color:#ffe6ff;'><b>What happened to <font color='blue'><b>carbon dioxide</b> and <b>water</font></b> when there was <font color='red'><u>NO</u></font> <font color='orange'>light energy</font>?</b> </p><img src='datacollection_icon.png'><font color='red'>Record your findings from the graphs to the table below.</font><br><br><img src='recordtable1.png></font>";//none-none or none-some; when energy is none
    }
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxCompleteThermal').style.visibility = "visible";
}

function alertBoxTalked() {
    alerting = true;
    document.getElementById('alertTextTalked').innerHTML = /*<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='termType = \"n3\"; narration(); console.log(termType);'/>*/" What do you think will happen? Discuss your prediction with your partner!";
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxTalked').style.visibility = "visible";
}

function alertBoxNext(text) {
    alerting = true;
    document.getElementById('alertTextNext').innerHTML = /*<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration(); console.log(termType);'/> " + */text;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxNext').style.visibility = "visible";
}

function alertBoxClose(text) {
    alerting = true;
    document.getElementById('alertTextClose').innerHTML = /*<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration(); console.log(termType);'/> " + */text;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxClose').style.visibility = "visible";
}

function confirmBox(text, func) {
    funcHandle = func;
    document.getElementById('confirmText').innerHTML = /*<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration(); console.log(termType);'/> " + */text;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('confirmBox').style.visibility = "visible";
	warningSound.play();
}

function alertBoxTrials() {
    //   alerting = true;
    //   if ( (5 - trial) == 4 ){ termType = 'n5'; }
    //   else if ( (5 - trial) == 3 ){ termType = 'n6'; }
    //   else if ( (5 - trial) == 2 ){ termType = 'n7'; }
    //   else if ( (5 - trial) == 1 ){ termType = 'n8'; }

    //   if (5 - trial > 1) {
    //       document.getElementById('alertTextTrials').innerHTML = 
    //       "<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration();'/>  Great job! You have recorded this trial.<br/><br/>Use the sliders to change the <b>variables</b> (amounts of <font color=\'#ff9800\'>light energy</font> and <b>matter</b>).<br/>Then run a new trial.<br/><br/>You need to complete at least " + (5 - trial) + " more different trials to <font color='red'>successfully answer the <u>reflection questions below</u></font>.";
    // document.getElementById( "reQs" ).classList.remove( "hidden" );
    //       document.getElementById( "reQs" ).classList.add( "shown" );
    //   }else if (5 - trial == 1) {
    //       document.getElementById('alertTextTrials').innerHTML = 
    //       "<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration();'/>  Great job! You have recorded this trial.<br/><br/>Use the sliders to change the <b>variables</b> (amounts of <font color=\'#ff9800\'>light energy</font> and <b>matter</b>).<br/>Then run a new trial.<br/><br/>You need to complete at least " + (5 - trial) + " more different trial to <font color='red'>successfully answer the <u>reflection questions below</u></font>.";

    //   } else if (5 - trial == 0) {
    //       termType = 'n9';
    //       document.getElementById('alertTextTrials').innerHTML = "<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration();'/> Great job! You have completed the minimum number of trials.</br></br> You can continue to explore the simulation OR, if you are ready, scroll down and <b><font color=\'#ff00ff\'>work with your partner to answer</font></b> the questions below.";
    //      //document.getElementById( "reQs" ).classList.remove( "hidden" );
    //       //document.getElementById( "reQs" ).classList.add( "shown" );
    //    } else {
    //       termType = 'n10';
    //       document.getElementById('alertTextTrials').innerHTML = "<input type='image' src='speaker.png' class='speaker' style='width: 25px; height: 25px;' onclick='narration();'/>Your trial has been recorded.</br></br> You may continue to explore the simulation OR, if you are ready, scroll down and <b><font color=\'#ff00ff\'>work with your partner</font></b> to answer the questions below.";
    //   }
    //   document.getElementById('film').style.visibility = "visible";
    //   document.getElementById('alertBoxTrials').style.visibility = "visible";
}

function confirmCall() {
    switch (funcHandle) {
        case -1:
            break;
        case 0:
            reset();
            break;
        case 1:
            console.log('insert break here');
            checkTrials();
            addTrial();
            saveStateToWISE('Record-Trial');
            alertBoxTrials();
            break;
    }
}

var l2unlocked_table = false;

function togglePlayPause() {
    if (playing == false && stage == 0) {
        //alertBoxTalked();
        //console.log("pressed run");
        saveStateToWISE('Run');
        recordSliders();
        if (currentOpenTab == '2') {
            l2unlocked_table = true;
        }
        // currentOpenTab;
    } else if (playing) {
        document.getElementById('playPause').innerHTML = "<b>Run</b>";
        document.getElementById('playPause').style.background = "#7b7";
        //console.log("pressed pause");
        saveStateToWISE("Pause");
        playing = false;

    } else {
        playing = true;
        document.getElementById('playPause').innerHTML = "<b>Pause</b>";
        document.getElementById('playPause').style.background = "#b77";
        //console.log("pressed continue run");
        saveStateToWISE("Continue");
    }
}

var trial1 = 0;
var trial2 = 0;
var trial3 = 0;

function getTrialNum(add) {
    if (currentOpenTab == 1) {
        if (add) {
            trial1++;
        }
        return trial1;
    } else if (currentOpenTab == 2) {
        if (add) {
            trial2++;
        }
        return trial2;
    } else if (currentOpenTab == 3) {
        if (add) {
            trial3++;
        }
        return trial3;
    } else if (currentOpenTab == 4) {
        //error alert 
    }

}

function syncTables(mini) {

    if (mini) {
        document.getElementById('bm' + getTrialNum(false) + '_' + currentOpenTab).value = document.getElementById('bmMini').value;
        document.getElementById('am' + getTrialNum(false) + '_' + currentOpenTab).value = document.getElementById('amMini').value;
        document.getElementById('be' + getTrialNum(false) + '_' + currentOpenTab).value = document.getElementById('beMini').value;
        document.getElementById('ae' + getTrialNum(false) + '_' + currentOpenTab).value = document.getElementById('aeMini').value;
        console.log('if mini: ' + document.getElementById('bmMini').value + document.getElementById('amMini').value + document.getElementById('beMini').value + document.getElementById('aeMini').value);
    }/* else {
        console.log('change mini value to trial value');
        document.getElementById('bmMini').value = document.getElementById('bm' + getTrialNum(false) + '_' + currentOpenTab).value;
        document.getElementById('amMini').value = document.getElementById('am' + getTrialNum(false) + '_' + currentOpenTab).value;
        document.getElementById('beMini').value = document.getElementById('be' + getTrialNum(false) + '_' + currentOpenTab).value;
        document.getElementById('aeMini').value = document.getElementById('ae' + getTrialNum(false) + '_' + currentOpenTab).value;
    }*/
}


function resetMiniTable() {
    document.getElementById('draggable').style.left = "60px";
    document.getElementById('draggable').style.top = "330px";
    document.getElementById('trialMini').innerHTML = "Trial" + (getTrialNum(false) + 1);
    document.getElementById('draggable').style.visibility = "visible";
    if(currentOpenTab == '2' && getTrialNum(false) == 0){
        document.getElementById('bmMini').value = null;
        document.getElementById('amMini').value = null;
        document.getElementById('beMini').value = null;
        document.getElementById('aeMini').value = null;
    }
}

function tabletoArray() {
    var tArray = [];
    for (var i = 0; i < getTrialNum(false); i++) {
        var innerArray = ["", "", "", "", "", "", ""];
        innerArray[0] = "trial" + (i + 1);
        innerArray[1] = document.getElementById('energySetting' + i).innerHTML;
        innerArray[4] = document.getElementById('matterSetting' + i).innerHTML;

        innerArray[2] = document.getElementById('be' + i).value;
        innerArray[3] = document.getElementById('ae' + i).value;
        innerArray[5] = document.getElementById('bm' + i).value;
        innerArray[6] = document.getElementById('am' + i).value;

        tArray[i] = JSON.stringify(innerArray);
    }
    return tArray;
}
//interaction data variables
var slower = 0;
var play_sound = 0;
//sliders
var energy_none = 0;
var energy_low = 0;
var energy_high = 0;
var matter_none = 0;
var matter_a_little = 0;
var matter_a_lot = 0;
//alert buttons
var alert_instruction = 0;
var alert_instruction_close = 0;
var alert_we_talked = 0;
var alert_next = 0;
var alert_enter_data = 0;
var alert_confirm_yes = 0;
var alert_confirm_no = 0;
var alert_trails_left_close = 0;
var term_X = 0;
//click terms
var term_light_energy = 0;
var term_carbon_dioxide = 0;
var term_photosynthesis = 0;
var term_chemical_energy = 0;
var term_matter = 0;
var term_chloroplast = 0;
var term_glucose = 0;
var term_oxygen = 0;
var term_variables = 0;
var alert_reQs_failed_submit = 0;

var save_reQs = "";
var submit_reQs = "";
var reQs = "";
var unplay_sound = 0;
var btn_save_reQs = 0;
var btn_submit_reQs = 0;

var q1_A_Checked = false;
var q1_B_Checked = false;
var q1_C_Checked = false;
var q1_Answer = "";

//played terms
var play_ps_n1 = 0;
var play_ps_n2 = 0;
var play_ps_n3 = 0;
var play_ps_n4 = 0;
var play_ps_n5 = 0;
var play_ps_n6 = 0;
var play_ps_n7 = 0;
var play_ps_n8 = 0;
var play_ps_n9 = 0;
var play_ps_n10 = 0;
var play_ps_n11 = 0;
var play_ps_n12 = 0;
var play_ps_n13 = 0;
var play_ps_n14 = 0;
var play_ps_n15 = 0;
var play_ps_n16 = 0;
var play_ps_n17 = 0;
var play_ps_n19 = 0;
var play_ps_n20 = 0;
var play_ps_n21 = 0;
var play_ps_n23 = 0;
var play_ps_n26 = 0;

var play_crs_n10 = 0;
var play_crs_n11 = 0;
var play_crs_n12 = 0;
var play_crs_n13 = 0;

//CHECK
var alert_submit_hypothesis_yes = 0;
var alert_submit_hypothesis_no = 0;

var hypothesis_1_val = ""; //Hypothesis 1 part 1 --  boxed value
var hypothesis_2_val = ""; //Hypothesis 1 part 2 -- connecting text
var hypothesis_3_val = ""; //Hypothesis 1 part 3 -- boxed value

var hypothesis_1_val_2 = ""; //Hypothesis 2 part 2 --  boxed value
var hypothesis_2_val_2 = ""; //Hypothesis 2 part 1 -- connecting text
var hypothesis_3_val_2 = ""; //Hypothesis 2 part 3 -- boxed value

var submit_level = 0;
var save_level = 0;

var alert_box_experiment = 0;
var run_another_trial = 0;
var ready_to_analyze = 0;

var submit_analysis = 0;

var submitted_analysis_1 = "";
var submitted_analysis_2 = "";
var saved_analysis_1 = "";
var saved_analysis_2 = "";

var saved_reasoning_1 = "";
var saved_reasoning_2 = "";
var submitted_reasoning_1 = "";
var submitted_reasoning_2 = "";

var analysis_load_1 = "";
var analysis_load_2 = "";
var reason_1 = "";
var reason_2 = "";
var support_trials_1 = "";
var support_trials_2 = "";

var analysis_1 = "";
var analysis2_1 = "";
var reasoning_1 = "";
var analysis_2 = "";
var analysis2_2 = "";
var reasoning_2 = "";

var alert_box_correct_data_btn = 0;
var alert_box_submit_level_btn = 0;
var alert_analysis_correct_btn = 0;


function saveStateToWISE(savedVar) {
    if (interactionDataOn) {
        if (wiseAPI != null) {
            var time = new Date();
            var state = {};

            switch (savedVar) { //saveStateToWISE('reflection-questions');
                case 'Record-Trial':
                    record_trial++;
                    break; //recordtrials
                case 'Save-Trial':
                    saves++;
                    break; //savetrails
                case 'Run':
					if(sliders[0].setting == 0){
						state.energySetting = "None";
					}else{
						state.energySetting = "Some";
					}
					
					if(sliders[1].setting == 0){
						state.matterSetting = "None";
					}else{
						state.matterSetting = "Some";
					}
                    runs++;
                    break;
                case 'Pause':
                    pauses++;
                    break;
                case 'Reset':
                    resets++;
                    break;

                    //ADDED
                    //sliders
                case 'Energy-None':
                    energy_none++;
                    break;
                case 'Energy-Low':
                    energy_low++;
                    break;
                case 'Energy-High':
                    energy_high++;
                    break;
                case 'Matter-None':
                    matter_none++;
                    break;
                case 'Matter-A-Little':
                    matter_a_little++;
                    break;
                case 'Matter-A-Lot':
                    matter_a_lot++;
                    break;

                    //EDIT SLIDERS


                    //btns
                case '2xFaster':
                    faster++;
                    break;
                case 'Slower':
                    slower++;
                    break;
                case 'PlaySound':
                    play_sound++;
                    break;
                case 'UnplaySound':
                    unplay_sound++;
                    break;

                    //alert btns
                case 'alert-instruction':
                    alert_instruction++;
                    break;
                case 'alert-instruction-close':
                    alert_instruction_close++;
                    break;
                case 'alert-we-talked':
                    alert_we_talked++;
                    break;
                case 'alert-next':
                    alert_next++;
                    break;
                case 'alert-enter-data':
                    alert_enter_data++;
                    break;
                case 'alert-confirm-yes':
                    alert_confirm_yes++;
                    break;
                case 'alert-confirm-no':
                    alert_confirm_no++;
                    break;
                case 'alert-trails-left-close':
                    alert_trails_left_close++;
                    break;
                case 'term_X':
                    term_X++;
                    break;
                case 'alert-reQs-failed-submit':
                    alert_reQs_failed_submit++;
                    break;

                case 'term-light-energy':
                    term_light_energy++;
                    break;
                case 'term-carbon-dioxide':
                    term_carbon_dioxide++;
                    break;
                case 'term-photosynthesis':
                    term_photosynthesis++;
                    break;
                case 'term-chemical-energy':
                    term_chemical_energy++;
                    break;
                case 'term-matter':
                    term_matter++;
                    break;
                case 'term-chloroplast':
                    term_chloroplast++;
                    break;
                case 'term-glucose':
                    term_glucose++;
                    break;
                case 'term-oxygen':
                    term_oxygen++;
                    break;
                case 'term-variables':
                    term_variables++;
                    break;

                    //save answers

                    //question 1
                case 'q1-A-Checked':
                    q1_Answer = 'A';
                    break;
                case 'q1-B-Checked':
                    q1_Answer = 'B';
                    break;
                case 'q1-C-Checked':
                    q1_Answer = 'C';
                    break;
                    //question 2
                case 'save-reflection-questions':
                    save_reQs = q2Text;
                    break;
                case 'submit-reflection-questions':
                    submit_reQs = q2Text;
                    break;
                case 'reflection-questions':
                    reQs = q2Text;
                    break;

                case 'btn-save-reflection-questions':
                    btn_save_reQs++;
                    break;
                case 'btn-submit-reflection-questions':
                    btn_submit_reQs++;
                    break;

                    //played terms
                case 'play-photoSim_n1_mp3':
                    play_ps_n1++;
                    break; //saveStateToWISE('play-photoSim_n1_mp3');
                //case 'play-photoSim_n2_mp3':
                    //play_ps_n2++;
                    //break;
                case 'play-photoSim_n3_mp3':
                    play_ps_n3++;
                    break;
                //case 'play-photoSim_n4_mp3':
                    //play_ps_n4++;
                    //break;
                case 'play-photoSim_n5_mp3':
                    play_ps_n5++;
                    break;
                case 'play-photoSim_n6_mp3':
                    play_ps_n6++;
                    break;
                case 'play-photoSim_n7_mp3':
                    play_ps_n7++;
                    break;
                case 'play-photoSim_n8_mp3':
                    play_ps_n8++;
                    break;
                case 'play-photoSim_n9_mp3':
                    play_ps_n9++;
                    break;
                case 'play-photoSim_n10_mp3':
                    play_ps_n10++;
                    break;
                //case 'play-photoSim_n11_mp3':
                    //play_ps_n11++;
                    //break;
                case 'play-photoSim_n12_mp3':
                    play_ps_n12++;
                    break;
                //case 'play-photoSim_n13_mp3':
                    //play_ps_n13++;
                    //reak;
                case 'play-photoSim_n14_mp3':
                    play_ps_n14++;
                    break;
                case 'play-photoSim_n15_mp3':
                    play_ps_n15++;
                    break;
                case 'play-photoSim_n16_mp3':
                    play_ps_n16++;
                    break;
                case 'play-photoSim_n17_mp3':
                    play_ps_n17++;
                    break;

                case 'play-photoSim_n19_mp3':
                    play_ps_n19++;
                    break;
                case 'play-photoSim_n20_mp3':
                    play_ps_n20++;
                    break;
                case 'play-photoSim_n21_mp3':
                    play_ps_n21++;
                    break;
                case 'play-photoSim_n23_mp3':
                    play_ps_n23++;
                    break;
                case 'play-photoSim_n26_mp3':
                    play_ps_n26++;
                    break;

                case 'play-CRSim_n10_mp3':
                    play_crs_n10++;
                    break;
                case 'play-CRSim_n11_mp3':
                    play_crs_n11++;
                    break;
                case 'play-CRSim_n12_mp3':
                    play_crs_n12++;
                    break;
                case 'play-CRSim_n13_mp3':
                    play_crs_n13++;
                    break;

                    //hypothesis answers
                case 'alert-submit-hypothesis-yes':
                    alert_submit_hypothesis_yes++;
                    break;
                case 'alert-submit-hypothesis-no':
                    alert_submit_hypothesis_no++;
                    break;
                case 'hypothesis-1-value':
                    hypothesis_1_val = document.getElementById('h1_text_1').innerHTML;
                    break;
                case 'hypothesis-2-value':
                    hypothesis_2_val = document.getElementById('h2_text_1').innerHTML;
                    break;
                case 'hypothesis-3-value':
                    hypothesis_3_val = document.getElementById('h3_text_1').innerHTML;
                    break;

                case 'hypothesis-1-value-2':
                    hypothesis_1_val_2 = document.getElementById('h1_text_2').innerHTML;
                    break;
                case 'hypothesis-2-value-2':
                    hypothesis_2_val_2 = document.getElementById('h2_text_2').innerHTML;
                    break;
                case 'hypothesis-3-value-2':
                    hypothesis_3_val_2 = document.getElementById('h3_text_2').innerHTML;
                    break;

                case 'submit-level':
                    submit_level++;
                    break;
                case 'save-level':
                    save_level++;
                    break;

                case 'alert-box-experiment':
                    alert_box_experiment++;
                    break;

                case 'run-another-trial':
                    run_another_trial++;
                    break;
                case 'ready-to-analyze':
                    ready_to_analyze++;
                    break;

                case 'submitted-analysis-1':
                    submitted_analysis_1 = analysis_1 + ', ' + analysis2_1;
                    break;
                case 'submitted-analysis-2':
                    submitted_analysis_2 = analysis_2 + ', ' + analysis2_2;
                    break;
                case 'saved-analysis-1':
                    saved_analysis_1 = analysis_1 + ', ' + analysis2_1;
                    break;
                case 'saved-analysis-2':
                    saved_analysis_2 = analysis_2 + ', ' + analysis2_2;
                    break;

               // case 'saved-reasoning-1':
                   // saved_reasoning_1 = reasoning_1;
                   // break;
                case 'saved-reasoning-2':
                    saved_reasoning_2 = reasoning_2;
                    break;
               // case 'submitted-reasoning-1':
                    //submitted_reasoning_1 = reasoning_1;
                   // break;
                //case 'submitted-reasoning-2':
                    //submitted_reasoning_2 = reasoning_2;
                    //break;

                case 'submit-analysis':
                    submit_analysis = submit_analysis;
                    break;

                    //add
                case 'reason-1':
                    reason_1 = document.getElementById('reasoningTxt_1').value;
                    break;
                case 'reason-2':
                    reason_2 = document.getElementById('reasoningTxt_2').value;
                    break;
                case 'support-trials-1':
                    support_trials_1 = document.getElementById('supportTrials_1').value;
                    break;
                case 'support-trials-2':
                    support_trials_2 = document.getElementById('supportTrials_2').value;
                    break;

                case 'alert-box-correct-data-btn':
                    alert_box_correct_data_btn++;
                    break;
                case 'alert-box-submit-level-btn':
                    alert_box_submit_level_btn++;
                    break;
                case 'alert-analysis-correct-btn':
                    alert_analysis_correct_btn++;
                    break;
                    //case '': ++; break;
                default:
                    console.log("ERROR: Data not recorded: " + savedVar);
            }
			
			if(document.getElementById("reasoning1").style.visibility != "hidden"){
		//	reasoningUnlocked = true;
			}
			state.reasoningUnlocked = reasoningUnlocked;

            state.action = savedVar;
            state.timestamp = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            state.trial = trial;

            state.table = document.getElementById("tableData").innerHTML;//JSON.stringify(tabletoArray());
			let tempTrialA = [];
			for(var i=0; i<trialAnswers.length; i++){
				tempTrialA[i] = JSON.stringify(trialAnswers[i]);
			}
			state.trialAnswers = JSON.stringify(tempTrialA);

            state.resets = resets;
            state.saves = saves;
            state.record_trial = record_trial;
            state.runs = runs;
            state.pauses = pauses;

            state.faster = faster;
            state.slower = slower;
            state.play_sound = play_sound;
            state.unplay_sound = unplay_sound;

            //added
            state.energy_none = energy_none;
            state.energy_low = energy_low;
            state.energy_high = energy_high;
            state.matter_none = matter_none;
            state.matter_a_little = matter_a_little;
            state.matter_a_lot = matter_a_lot;

            state.alert_instruction = alert_instruction;
            state.alert_instruction_close = alert_instruction_close;
            state.alert_we_talked = alert_we_talked;
            state.alert_next = alert_next;
            state.alert_enter_data = alert_enter_data;
            state.alert_confirm_yes = alert_confirm_yes;
            state.alert_confirm_no = alert_confirm_no;
            state.alert_trails_left_close = alert_trails_left_close;
            state.term_X = term_X;
            state.alert_reQs_failed_submit = alert_reQs_failed_submit;

            state.term_light_energy = term_light_energy;
            state.term_carbon_dioxide = term_carbon_dioxide;
            state.term_photosynthesis = term_photosynthesis;
            state.term_chemical_energy = term_chemical_energy;
            state.term_matter = term_matter;
            state.term_chloroplast = term_chloroplast;
            state.term_glucose = term_glucose;
            state.term_oxygen = term_oxygen;
            state.term_variables = term_variables;

            state.reQs = reQs;
            state.save_reQs = save_reQs;
            state.submit_reQs = submit_reQs;

            state.btn_save_reQs = btn_save_reQs;
            state.btn_submit_reQs = btn_submit_reQs;

            state.q1_Answer = q1_Answer;

            state.play_ps_n1 = play_ps_n1;
            state.play_ps_n2 = play_ps_n2;
            state.play_ps_n3 = play_ps_n3;
            state.play_ps_n4 = play_ps_n4;
            state.play_ps_n5 = play_ps_n5;
            state.play_ps_n6 = play_ps_n6;
            state.play_ps_n7 = play_ps_n7;
            state.play_ps_n8 = play_ps_n8
            state.play_ps_n9 = play_ps_n9;
            state.play_ps_n10 = play_ps_n10;
            state.play_ps_n11 = play_ps_n11;
            state.play_ps_n12 = play_ps_n12;
            state.play_ps_n13 = play_ps_n13;
            state.play_ps_n14 = play_ps_n14;
            state.play_ps_n15 = play_ps_n15;
            state.play_ps_n16 = play_ps_n16;
            state.play_ps_n17 = play_ps_n17;
            state.play_ps_n19 = play_ps_n19;
            state.play_ps_n20 = play_ps_n20;
            state.play_ps_n21 = play_ps_n21;
            state.play_ps_n23 = play_ps_n23;
            state.play_ps_n26 = play_ps_n26;

            state.play_crs_n10 = play_crs_n10;
            state.play_crs_n11 = play_crs_n11;
            state.play_crs_n12 = play_crs_n12;
            state.play_crs_n13 = play_crs_n13;

            //new
            state.alert_submit_hypothesis_yes = alert_submit_hypothesis_yes;
            state.alert_submit_hypothesis_no = alert_submit_hypothesis_no;
            state.hypothesis_1_val = hypothesis_1_val;
            state.hypothesis_2_val = hypothesis_2_val;
            state.hypothesis_3_val = hypothesis_3_val;
            state.hypothesis_1_val_2 = hypothesis_1_val_2;
            state.hypothesis_2_val_2 = hypothesis_2_val_2;
            state.hypothesis_3_val_2 = hypothesis_3_val_2;

            state.alert_box_experiment = alert_box_experiment;
            state.ready_to_analyze = ready_to_analyze;
            state.run_another_trial = run_another_trial;

            state.submitted_analysis_1 = submitted_analysis_1;
            state.submitted_analysis_2 = submitted_analysis_2;
            state.saved_analysis_1 = saved_analysis_1;
            state.saved_analysis_2 = saved_analysis_2;

            state.saved_reasoning_1 = saved_reasoning_1;
            state.saved_reasoning_2 = saved_reasoning_2;
            state.submitted_reasoning_1 = submitted_reasoning_1;
            state.submitted_reasoning_2 = submitted_reasoning_2;

            state.levelReached = evalNum;

            state.reason_1 = reason_1;
           state.reason_2 = reason_2;
            state.support_trials_1 = support_trials_1;
          state.support_trials_2 = support_trials_2;

            state.analysis_1 = analysis_1;
            //console.log("saved state" + analysis_1);
            state.analysis2_1 = analysis2_1;
            state.reasoning_1 = reasoning_1;

            state.analysis_2 = analysis_2;
            state.analysis2_2 = analysis2_2;
            state.reasoning_2 = reasoning_2;
			
			state.analysis1Element = document.getElementById("analysis1").innerHTML;

            state.checkXArray = JSON.stringify(checkXArray);
			
			checkDifferentArray_1
			
			let tempcheckDifferentArray_1 = [];
			for(var i=0; i<checkDifferentArray_1.length; i++){
				tempcheckDifferentArray_1[i] = JSON.stringify(checkDifferentArray_1[i]);
			}
			state.checkDifferentArray_1 = JSON.stringify(tempcheckDifferentArray_1);

            state.alert_box_correct_data_btn = alert_box_correct_data_btn;
            state.alert_box_submit_level_btn = alert_box_submit_level_btn;
            state.alert_analysis_correct_btn = alert_analysis_correct_btn;
            state.pageNum = pageNum;
            state.evalNum = evalNum;
			
			state.trial1 = trial1;
			state.trial2 = trial2;
			state.trial3 = trial3;
			
			state.level = level;
			
			//state.l2unlocked_table 	= l2unlocked_table 	;
			state.l1unlocked_h 		= l1unlocked_h 		;
			//state.l2unlocked_h 		= l2unlocked_h 		;
			state.l1unlocked 		= l1unlocked 		;
			//state.l2unlocked 		= l2unlocked 		;
			//state.l2unlocked_2 		= l2unlocked_2 		;
			state.l1unlocked_3 		= l1unlocked_3 		;
			//state.l2unlocked_3 		= l2unlocked_3 		;

			
			state.curLevel = curLevel;
			state.lives = lives;
			state.score = score;
			
			state.TotalNumAllCorrect1 = TotalNumAllCorrect1;
			state.TotalNumAllCorrect2 = TotalNumAllCorrect2;
			state.CurrentlyCorrect = CurrentlyCorrect;
			
            wiseAPI.save(state);
        }
    }
};

function loadLatestState() {
    if (wiseAPI != null) {
        var latestState = wiseAPI.getLatestState();
        if (latestState != null) {
            paused = true;
            console.log("latest state loaded");

            //trial = latestState.response.trial;
            //console.log('number of trials: ' + latestState.response.trial);

            document.getElementById('film').style.visibility = "hidden";
            document.getElementById('instructions').style.visibility = "hidden";

            resets = latestState.response.resets;
            saves = latestState.response.saves;
            record_trial = latestState.response.record_trial;
            runs = latestState.response.runs;
            pauses = latestState.response.pauses;

            reQs = latestState.response.reQs;
            save_reQs = latestState.response.save_reQs;
            submit_reQs = latestState.response.submit_reQs;

            //ADDED
            //trial = latestState.response.latestState.response.trial;
            faster = latestState.response.faster;
            slower = latestState.response.slower;
            play_sound = latestState.response.play_sound;
            unplay_sound = latestState.response.unplay_sound;

            //added
            energy_none = latestState.response.energy_none;
            energy_low = latestState.response.energy_low;
            energy_high = latestState.response.energy_high;
            matter_none = latestState.response.matter_none;
            matter_a_little = latestState.response.matter_a_little;
            matter_a_lot = latestState.response.matter_a_lot;

            alert_instruction = latestState.response.alert_instruction;
            alert_instruction_close = latestState.response.alert_instruction_close;
            alert_we_talked = latestState.response.alert_we_talked;
            alert_next = latestState.response.alert_next;
            alert_enter_data = latestState.response.alert_enter_data;
            alert_confirm_yes = latestState.response.alert_confirm_yes;
            alert_confirm_no = latestState.response.alert_confirm_no;
            alert_trails_left_close = latestState.response.alert_trails_left_close;
            term_X = latestState.response.term_X;
            alert_reQs_failed_submit = latestState.response.alert_reQs_failed_submit;

            term_light_energy = latestState.response.term_light_energy;
            term_carbon_dioxide = latestState.response.term_carbon_dioxide;
            term_photosynthesis = latestState.response.term_photosynthesis;
            term_chemical_energy = latestState.response.term_chemical_energy;
            term_matter = latestState.response.term_matter;
            term_chloroplast = latestState.response.term_chloroplast;
            term_glucose = latestState.response.term_glucose;
            term_oxygen = latestState.response.term_oxygen;
            term_variables = latestState.response.term_variables;

            reQs = latestState.response.reQs;
            save_reQs = latestState.response.save_reQs;
            submit_reQs = latestState.response.submit_reQs;
            btn_save_reQs = latestState.response.btn_save_reQs;
            btn_submit_reQs = latestState.response.btn_submit_reQs;

            q1_Answer = latestState.response.q1_Answer;

            play_ps_n1 = latestState.response.play_ps_n1;
            play_ps_n2 = latestState.response.play_ps_n2;
            play_ps_n3 = latestState.response.play_ps_n3;
            play_ps_n4 = latestState.response.play_ps_n4;
            play_ps_n5 = latestState.response.play_ps_n5;
            play_ps_n6 = latestState.response.play_ps_n6;
            play_ps_n7 = latestState.response.play_ps_n7;
            play_ps_n8 = latestState.response.play_ps_n8
            play_ps_n9 = latestState.response.play_ps_n9;
            play_ps_n10 = latestState.response.play_ps_n10;
            play_ps_n11 = latestState.response.play_ps_n11;
            play_ps_n12 = latestState.response.play_ps_n12;
            play_ps_n13 = latestState.response.play_ps_n13;
            play_ps_n14 = latestState.response.play_ps_n14;
            play_ps_n15 = latestState.response.play_ps_n15;
            play_ps_n16 = latestState.response.play_ps_n16;
            play_ps_n17 = latestState.response.play_ps_n17;
            play_ps_n19 = latestState.response.play_ps_n19;
            play_ps_n20 = latestState.response.play_ps_n20;
            play_ps_n21 = latestState.response.play_ps_n21;
            play_ps_n23 = latestState.response.play_ps_n23;
            play_ps_n26 = latestState.response.play_ps_n26;

            play_crs_n10 = latestState.response.play_crs_n10;
            play_crs_n11 = latestState.response.play_crs_n11;
            play_crs_n12 = latestState.response.play_crs_n12;
            play_crs_n13 = latestState.response.play_crs_n13;

            //check
            submit_level = latestState.response.submit_level;
            save_level = latestState.response.save_level;

            alert_submit_hypothesis_yes = latestState.response.alert_submit_hypothesis_yes;
            alert_submit_hypothesis_no = latestState.response.alert_submit_hypothesis_no;
            hypothesis_1_val = latestState.response.hypothesis_1_val;
            hypothesis_2_val = latestState.response.hypothesis_2_val;
            hypothesis_3_val = latestState.response.hypothesis_3_val;
            hypothesis_1_val_2 = latestState.response.hypothesis_1_val_2;
            hypothesis_2_val_2 = latestState.response.hypothesis_2_val_2;
            hypothesis_3_val_2 = latestState.response.hypothesis_3_val_2;

            alert_box_experiment = latestState.response.alert_box_experiment;
            ready_to_analyze = latestState.response.ready_to_analyze;
            run_another_trial = latestState.response.run_another_trial;

            submitted_analysis_1 = latestState.response.submitted_analysis_1;
            submitted_analysis_2 = latestState.response.submitted_analysis_2;
            saved_analysis_1 = latestState.response.saved_analysis_1;
            saved_analysis_2 = latestState.response.saved_analysis_2;

           saved_reasoning_1 = latestState.response.saved_reasoning_1;
            saved_reasoning_2 = latestState.response.saved_reasoning_2;
          submitted_reasoning_1 = latestState.response.submitted_reasoning_1;
           submitted_reasoning_2 = latestState.response.submitted_reasoning_2;

            submit_analysis = latestState.response.submit_analysis;

            evalNum = latestState.response.levelReached;

            reason_1 = latestState.response.reason_1;
            reason_2 = latestState.response.reason_2;
            support_trials_1 = latestState.response.support_trials_1;
            support_trials_2 = latestState.response.support_trials_2;

            analysis_1 = latestState.response.analysis_1;
            analysis2_1 = latestState.response.analysis2_1;
            reasoning_1 = latestState.response.reasoning_1;
            analysis_2 = latestState.response.analysis_2;
            analysis2_2 = latestState.response.analysis2_2;
            reasoning_2 = latestState.response.reasoning_2;

            alert_box_correct_data_btn = latestState.response.alert_box_correct_data_btn;
            alert_box_submit_level_btn = latestState.response.alert_box_submit_level_btn;
            alert_analysis_correct_btn = latestState.response.alert_analysis_correct_btn;
            pageNum = latestState.response.pageNum;
            evalNum = latestState.response.evalNum;
			
			trial1 = latestState.response.trial1;
			trial2 = latestState.response.trial2;
			trial3 = latestState.response.trial3;
			
			level = latestState.response.level;
			
			l2unlocked_table 	= latestState.response.l2unlocked_table 	;
			l1unlocked_h 		= latestState.response.l1unlocked_h 		;
			l2unlocked_h 		= latestState.response.l2unlocked_h 		;
			l1unlocked 			= latestState.response.l1unlocked 		;
			l2unlocked 			= latestState.response.l2unlocked 		;
			l2unlocked_2 		= latestState.response.l2unlocked_2 		;
			l1unlocked_3 		= latestState.response.l1unlocked_3 		;
			l2unlocked_3 		= latestState.response.l2unlocked_3 		;

			let tempTrialA = JSON.parse(latestState.response.trialAnswers);
			for(var i=0; i<tempTrialA.length; i++){
				trialAnswers[i] = JSON.parse(tempTrialA[i]);
			}
			
			let tempcheckDifferentArray_1 = JSON.parse(latestState.response.checkDifferentArray_1);
			for(var i=0; i<tempcheckDifferentArray_1.length; i++){
				checkDifferentArray_1[i] = JSON.parse(tempcheckDifferentArray_1[i]);
			}
			
			
			if (checkDifferentArray_1.length > 0) {
				var fbtn = document.getElementById('fasterBtn');
				fbtn.classList.remove("dis");
				$(fbtn).addClass('controlButton');
				$('#fasterBtn').prop('disabled', false);
			}
			
			
            document.getElementById("textbox_q2").innerHTML = latestState.response.reQs;

            if (latestState.response.q1_Answer == 'A') {
                document.getElementById('q1_A').checked = true;
            } else if (latestState.response.q1_Answer == 'B') {
                document.getElementById('q1_B').checked = true;
            } else if ((latestState.response.q1_Answer == 'C')) {
                document.getElementById('q1_C').checked = true;
            }

            document.getElementById("reQs").classList.remove("hidden");
            document.getElementById("reQs").classList.add("shown");

            document.getElementById("tableData").innerHTML = latestState.response.table;
			
			
			
			//document.getElementById("tableWrapper").style.visibility = "visible";
			switch(level){
				case 1: openTab('level1page','btn1'); break;
				//case 2: openTab('level2page','btn2'); break;
			}
			
			curLevel = latestState.response.curLevel;
			lives = latestState.response.lives;
			score = latestState.response.score;
			
			TotalNumAllCorrect1 = latestState.response.TotalNumAllCorrect1;
			TotalNumAllCorrect2 = latestState.response.TotalNumAllCorrect2;
			CurrentlyCorrect = latestState.response.CurrentlyCorrect;
			
			
			reasoningUnlocked = latestState.response.reasoningUnlocked;
		

			
			
			//var tArray = JSON.parse(latestState.response.table);
            //console.log(  "ARRAY TABLE: " + tArray.toString() );
			/*
            for (var i = 0; i < latestState.response.trial; i++) {
                var innerArray = JSON.parse(tArray[i]);

                document.getElementById('energySetting' + i).innerHTML = innerArray[1];
                document.getElementById('matterSetting' + i).innerHTML = innerArray[4];
                document.getElementById('be' + i).value = innerArray[2];
                document.getElementById('ae' + i).value = innerArray[3];
                document.getElementById('bm' + i).value = innerArray[5];
                document.getElementById('am' + i).value = innerArray[6];

                addTrialReload(innerArray);
            }*/

            /*checkXArray = JSON.parse(latestState.response.checkXArray);

            for (var i = 0; i < latestState.response.trial; i++) {
                //BE AE BM AM
                if (checkXArray[i][0] == 'i') {
                    document.getElementById('checkBE' + i).src = "redX.png";
                }
                if (checkXArray[i][1] == 'i') {
                    document.getElementById('checkAE' + i).src = "redX.png";
                }
                if (checkXArray[i][2] == 'i') {
                    document.getElementById('checkBM' + i).src = "redX.png";
                }
                if (checkXArray[i][3] == 'i') {
                    document.getElementById('checkAM' + i).src = "redX.png";
                }
            }*/

            paused = false;
			calculateScore();
            reloadPages();
			
			
			
			document.getElementById('bmMini').value = "";
			document.getElementById('amMini').value = "";
			document.getElementById('beMini').value = "";
			document.getElementById('aeMini').value = "";
			
			for (var i = 0; i < getTrialNum(false); i++) {
				document.getElementById('bm' + i + '_' + currentOpenTab).value = trialAnswers[i][0];
				document.getElementById('am' + i + '_' + currentOpenTab).value = trialAnswers[i][1];
				document.getElementById('be' + i + '_' + currentOpenTab).value = trialAnswers[i][2];
				document.getElementById('ae' + i + '_' + currentOpenTab).value = trialAnswers[i][3];
			}
			
			document.getElementById('nextTrialP').style.visibility = "hidden";
			
			document.getElementById("analysis1").innerHTML = latestState.response.analysis1Element;
        }

    }
};

function getColor(str){
	switch(str){
		case "the reactants are":	return "#9933ff"; break;
		case "chemical energy":		return "#02b119"; break;
		case "chemical energy is":	return "#02b119"; break;
		case "thermal energy":		return "#ff0000"; break;
		case "thermal energy is":	return "#ff0000"; break;
		case "glucose":				return "#688a6f"; break; /*"#006600"*/
		case "glucose is":			return "#688a6f"; break;
		case "water is":			return "#0099ff"; break;
		case "oxygen": 				return "#cccccc"; break;
		case "be stored in":       	return "#4f44f8"; break;
		case "use up":         		return "#84aed7"; break;
		case "create":         		return "#fe26f9"; break;
		default: return "#cccccc"; break;
	}
}

function reloadPages() {
    console.log('pages reloaded ' + alert_submit_hypothesis_yes);
    //LOAD HYPOTHESIS
    if (alert_submit_hypothesis_yes > 0) {
        //LOAD H1
        document.getElementById('hBox_1').style.visibility = "visible";
        document.getElementById('h1_text_1').innerHTML = hypothesis_1_val;
        document.getElementById('h2_text_1').innerHTML = hypothesis_2_val;
        document.getElementById('h3_text_1').innerHTML = hypothesis_3_val;
		document.getElementById('h1_text_1').style.backgroundColor = getColor(hypothesis_1_val);
        document.getElementById('h2_text_1').style.backgroundColor = getColor(hypothesis_2_val);
        document.getElementById('h3_text_1').style.backgroundColor = getColor(hypothesis_3_val);
		if(document.getElementById('h1_text_1').innerHTML == "light energy"){
			//document.getElementById('HC_1').style.visibility = "inherit";
		}
		if(document.getElementById('h3_text_1').innerHTML == "chemical energy"){
			//document.getElementById('HC_3').style.visibility = "inherit";
		}

        //LOAD H2
        if (alert_submit_hypothesis_yes == 2) {
            document.getElementById('hBox_2').style.visibility = "visible";
            document.getElementById('h1_text_2').innerHTML = hypothesis_1_val_2;
            document.getElementById('h2_text_2').innerHTML = hypothesis_2_val_2;
            document.getElementById('h3_text_2').innerHTML = hypothesis_3_val_2;
			document.getElementById('h1_text_2').style.backgroundColor = getColor(hypothesis_1_val_2);
			document.getElementById('h2_text_2').style.backgroundColor = getColor(hypothesis_2_val_2);
			document.getElementById('h3_text_2').style.backgroundColor = getColor(hypothesis_3_val_2);
        } else {
            preHAgain();
        }
    } else {
        document.getElementById('film').style.visibility = "hidden";
        document.getElementById('instructions').style.visibility = "visible";
    }

    //LOAD ANALYSIS
    //alert-box-submit-level-btn
    if (alert_box_correct_data_btn > 0) {
        //LOAD ANALYSIS 1
        console.log('analysis_1 ' + analysis_1)
        document.getElementById('analysis1').style.visibility = 'visible';
        document.getElementById('level1page').style.visibility = 'visible';
        if (analysis_1 != "") {
            document.getElementById('analysis1').innerHTML =
                "<span>When </span><span id='a1txt_1' class='hBox'></span><img width='15' height='15'id='aFT_1' src='check.png'> <span id='a2txt_1'>present, <font color='orange'>light energy</font> can be <u>transformed into</u></span><span id='a3txt_1' class='hBox'></span>.<img width='15' height='15'id='aFT_1' src='check.png'>";
            document.getElementById('a1txt_1').innerHTML = analysis_1;
            document.getElementById('a3txt_1').innerHTML = analysis2_1;
			document.getElementById('a1txt_1').style.backgroundColor = getColor(analysis_1);
            document.getElementById('a3txt_1').style.backgroundColor = getColor(analysis2_1);
            console.log('analysis_1 ' + analysis_1)
        }
		/*
        //LOAD ANALYSIS 2
        console.log('alertBoxSubmitLevel' + alert_box_submit_level_btn);
        if (alert_box_submit_level_btn > 0) {
            document.getElementById('analysis2').style.visibility = 'visible';
            if (analysis_2 != "") {
                document.getElementById('analysis2').innerHTML =
                    "<span id='a1txt_2'></span> <span id='a2txt_2' class='hBox'></span><span id='a3txt_2' class='hBox'></span>";
                document.getElementById('a1txt_2').innerHTML = 'During photosynthesis, chemial energy';
                document.getElementById('a2txt_2').innerHTML = analysis_2;
                document.getElementById('a3txt_2').innerHTML = analysis2_2;
            }
        } else {
            //document.getElementById('submitAnalysis_1').style.visibility = 'visible';
        }*/
    } else {
        //document.getElementById('submitAnalysis_2').style.visibility = 'visible';
    }

    //LOAD REASONING & SUPPORT TRIALS
	/*
    if (reasoningUnlocked) {
        console.log('alert_analysis_correct_btn')
        //LOAD REASONING & SUPPORT 1
        document.getElementById('reasoning1').style.visibility = 'visible';
        document.getElementById('reasoningTxt_1').value = reason_1;
        if (document.getElementById('supportTrials_1').value != null) {
            document.getElementById('supportTrials_1').value = support_trials_1;
        }
        //LOAD REASONING & SUPPORT 2
        if (alert_analysis_correct_btn > 1) {
            //document.getElementById('reasoning2').style.visibility = 'visible';
            document.getElementById('reasoningTxt_2').value = reason_2;
            if (document.getElementById('supportTrials_2').value != null) {
                document.getElementById('supportTrials_2').value = support_trials_2;
            }
        }
    }
	*/
}


function addTrialReload(arrayTable) {
    syncTables(true);
    document.getElementById('draggable').style.visibility = 'hidden';
    document.getElementById('tableWrapper').style.visibility = 'visible';

    var currentTrial = []

    currentTrial.push(arrayTable[5]); //bm
    currentTrial.push(arrayTable[6]); //am
    currentTrial.push(arrayTable[2]); //be
    currentTrial.push(arrayTable[3]); //ae


    trialAnswers.push(currentTrial);

    document.getElementById('bm' + trial).disabled = true;
    document.getElementById('am' + trial).disabled = true;
    document.getElementById('be' + trial).disabled = true;
    document.getElementById('ae' + trial).disabled = true;

    document.getElementById('row' + trial).style.visibility = "visible";

    getTrialNum(true);

    if (trial > 0) {
        var fbtn = document.getElementById('fasterBtn');
        fbtn.classList.remove("dis");
        $(fbtn).addClass('controlButton');
        $('#fasterBtn').prop('disabled', false);
    }

    document.getElementById('feedback_'+'currentOpenTab').innerHTML += "<tr id='row" + trial +
        "' style='visibility: hidden;'><td class='tg-s27t'>Trial " +
        (trial + 1) + "</td><td class='tg-7u08' id='energySetting" +
        trial + "'>None</td><td class='tg-7u08 tblYellow'><select class='form-control' id='be" +
        trial + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkBE" +
        trial + "' /></td><td class='tg-7u08 tblGreen'><select class='form-control' id='ae" +
        trial + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkAE" +
        trial + "' /></td><td class='tg-7u08' id='matterSetting" +
        trial + "'>None</td><td class='tg-7u08 tblDarkBlue'><select class='form-control' id='bm" +
        trial + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkBM" +
        trial + "' /></td><td class='tg-7u08 tblLightBlue'><select class='form-control' id='am" +
        trial + "' onclick='syncTables(false);'><option>None</option><option>Some</option></select><img src='check.png' width='20' height='20' id='checkAM" +
        trial + "'/></td></tr>";
    reset();

    //console.log("CURRENT RELOAD TRIAL ANSWERS: " + trialAnswers.toString());
    for (var i = 0; i < trial; i++) {
        document.getElementById('bm' + i).value = trialAnswers[i][0];
        document.getElementById('am' + i).value = trialAnswers[i][1];
        document.getElementById('be' + i).value = trialAnswers[i][2];
        document.getElementById('ae' + i).value = trialAnswers[i][3];
    }
    document.getElementById('nextTrialP').style.visibility = 'inherit';

    document.getElementById('bm' + trial).value = "";
    document.getElementById('am' + trial).value = "";
    document.getElementById('be' + trial).value = "";
    document.getElementById('ae' + trial).value = "";

    document.getElementById('feedback').scrollTop += 80;

    // if (document.getElementById("row0").rowIndex == 0) {
    //     sortTable(0);
    // } else {
    //     sortTable(0);
    //     sortTable(0);
    // }

}

function setup() {
	
	if(typeof window.parent.wiseAPI === "function"){
		wiseAPI = window.parent.wiseAPI(); // get the WISE API from parent frame
		interactionDataOn = true;
		console.log("wiseAPI function");
	}else{
		interactionDataOn = false;
		wiseAPI = null;
	}
	
	if(interactionDataOn){
        reset();
        loadLatestState();
    } else {
        reset();
    }
}

function toggleFaster() {
    if (fasterPressed == false) {
        fasterPressed = true;
        clearInterval(loop);
        loop = setInterval(mainLoop, 7);
        //console.log("faster pressed");
        document.getElementById("fasterBtn").style.backgroundColor = "#dddddd";
        document.getElementById("fasterBtn").innerHTML = "<b>2x Slower</b>";
        saveStateToWISE("2xFaster");
    } else {
        fasterPressed = false;
        clearInterval(loop);
        loop = setInterval(mainLoop, 15);
        //console.log("slower pressed");
        document.getElementById("fasterBtn").style.backgroundColor = "white";
        document.getElementById("fasterBtn").innerHTML = "<b>2x Faster</b>";
        saveStateToWISE("Slower");
    }
}


function narration() {
    if (narrationPressed == false) {
        stopAudio();
        switch (termType) {
            case "n1":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n2":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            case "n3":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n4":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            case "n5":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n6":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n7":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n8":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n9":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n10":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n11":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
				return;
                break;
            case "n12":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            case "n13":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
				return;
                break;
            case "n14":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            case "n15":
                sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n16":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            case "n17":
                //sound = new Audio(audioLink + 'photoSim_' + termType + '.mp3');
                //saveStateToWISE('play-photoSim_' + termType + '_mp3');
                return;
				break;
            default:
                sound = new Audio(audioLink + 'ohno.mp3');
                console.log("Narration sound file NOT found");
        }
        sound.play();
        saveStateToWISE("PlaySound");

        document.querySelectorAll(".speaker").forEach(function (element) {
            element.src = "speaker_on.png";
        });
        narrationPressed = true;
    } else {
        document.querySelectorAll(".speaker").forEach(function (element) {
            element.src = "speaker.png";
        });
        saveStateToWISE("UnplaySound");
        stopAudio();
    }
}

var audioLink = 'https://ryoo-dept-soe.cloudapps.unc.edu/photo_sim/';

function termsAudio(term) {
    if (termsAudioPressed == false) {
        stopAudio();
        switch (term) {
            case "n19": //variables
                sound = new Audio(audioLink + 'photoSim_' + term + '.mp3');
                saveStateToWISE('play-photoSim_' + term + '_mp3');
                break;
            case "n20": //CO2
                sound = new Audio(audioLink + 'photoSim_' + term + '.mp3');
                saveStateToWISE('play-photoSim_' + termType + '_mp3');
                break;
            case "n21": //Oxygen
                sound = new Audio(audioLink + 'photoSim_' + term + '.mp3');
                saveStateToWISE('play-photoSim_' + term + '_mp3');
                break;
            case "n23": //photosynthesis
                sound = new Audio(audioLink + 'photoSim_' + term + '.mp3');
                saveStateToWISE('play-photoSim_' + term + '_mp3');
                break;
            case "n26": //matter
                sound = new Audio(audioLink + 'photoSim_' + term + '.mp3');
                saveStateToWISE('play-photoSim_' + term + '_mp3');
                break;
            case "CRSim_n10": //glucose
                sound = new Audio(audioLink + term + '.mp3');
                saveStateToWISE(term + '_mp3');
                break;
            case "CRSim_n11": //light energy
                sound = new Audio(audioLink + term + '.mp3');
                saveStateToWISE(term + '_mp3');
                break;
            case "CRSim_n12": //Chemical Energy
                sound = new Audio(audioLink + term + '.mp3');
                saveStateToWISE(term + '_mp3');
                break;
            case "CRSim_n13": //Chloroplast
                sound = new Audio(audioLink + term + '.mp3');
                saveStateToWISE(term + '_mp3');
                break;
            default:
                sound = new Audio(audioLink + 'ohno.mp3');
                console.log("Vocab narration sound file NOT found");
        }
        sound.play();
        saveStateToWISE("PlaySound");
        document.querySelectorAll(".speakerTerms").forEach(function (element) {
            element.src = "speaker_on.png";
        });
        termsAudioPressed = true;
    } else if (termsAudioPressed == true) {
        document.querySelectorAll(".speakerTerms").forEach(function (element) {
            element.src = "speaker.png";
        });
        stopAudio();
        saveStateToWISE("UnplaySound");
    }
}

function stopAudio() {
    narrationPressed = false;
    termsAudioPressed = false;
    sound.pause();

    document.querySelectorAll(".speaker").forEach(function (element) {
        element.src = "speaker.png";
    });
}

function showInfo(type) {

    //pictures
    var pic = '</br><center><img src="' + type + '.png"  style="width:85px;height:85px;margin-top:20px;"></center>';
    var glucosePic = '</br><center><img src="photoSim_glucose.png"  style="width:85px;height:85px;margin-top:20px;"></center>';
    var co2Pic = '</br><center><img src="photoSim_CO2.png"  style="width:67px;height:25px;margin-top:20px;"></center>';
    var oxygenPic = '</br><center><img src="O2.png"  style="width:48px;height:25px;margin-top:20px;"></center>';
    var lePic = '</br><center><img src="lightEnergyWave.png"  style="width:145px;height:73px;margin-top:20px;"></center>';
    var chPic = '</br><center><img src="chloroplast.png"  style="width:130px;height:130px;margin-top:20px;"></center>';
    var matPic = '</br><center><img src="Matter.png"  style="width:235px;height:108px;margin-top:20px;"></center>';
    var photPic = '</br><center><img src="Photosynthesis.png"  style="width:236px;height:300px;margin-top:20px;"></center>';
    var cEPic = '</br><center><img src="chemicalEnergy.png"  style="width:85px;height:85px;margin-top:20px;"></center>';
    var variaPic = '</br><center><img src="Variables.png"  style="width:260px;height:156px;margin-top:20px;"></center>';

    switch (type) {
        case "glucose":
            saveStateToWISE('term-glucose');
            alertBoxTerms("<b>Glucose</b></br></br><input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"CRSim_n10\");'/> <b>Glucose</b> is a sugar molecule made up of 6 carbon, 12 hydrogen, and 6 oxygen atoms (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>)" + glucosePic);
            break;
        case "chloroplast":
            saveStateToWISE('term-chloroplast');
            alertBoxTerms("<b>Chloroplast</b></br></br><input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"CRSim_n13\");'/> The <b>Chloroplast</b> is a special organelle where photosynthesis happens." + chPic);
            break;
        case "CO2":
            saveStateToWISE('term-carbon-dioxide');
            alertBoxTerms("<b>Carbon Dioxide</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"n20\");'/><b>Carbon dioxide</b> is a molecule with 1 carbon and 2 oxygen atoms." + co2Pic);
            break;
        case "oxygen":
            saveStateToWISE('term-oxygen');
            alertBoxTerms("<b>Oxygen</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"n21\");'/> <b>Oxygen</b> molecules have 2 oxygen atoms." + oxygenPic);
            break;
        case "photosynthesis":
            saveStateToWISE('term-photosynthesis');
            document.getElementById('alertBoxTerms').style.height = "460px";
            document.getElementById('alertBoxTermsFrame').style.height = "450px";
            alertBoxTerms("<b>Photosynthesis</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"n23\");'/> <b>Photosynthesis</b> is the process by which plants make their food using carbon dioxide, water, and light energy." + photPic);
            break;
        case "matter":
            saveStateToWISE('term-matter');
            alertBoxTerms("<b>Matter</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"n26\");'/> <b>Matter</b> is everything around you that has mass and takes up space. Matter is made up of atoms." + matPic);
            break;
        case "variables":
            saveStateToWISE('term-variables');
            alertBoxTerms("<b>Variables</b></br></br><input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"n19\");'/> A <b>variable</b> is something that you can change in an experiment." + variaPic);
            break;
        case "lightenergy":
            saveStateToWISE('term-light-energy');
            alertBoxTerms("<b>Light Energy</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"CRSim_n11\");'/> <b>Light energy</b> is a type of energy that comes from the Sun and can travel through space." + lePic);
            break;
        case "chemicalenergy":
            saveStateToWISE('term-chemical-energy');
            alertBoxTerms("<b>Chemical Energy</b></br></br> <input type='image' src='speaker.png' class='speakerTerms' style='width: 25px; height: 25px;' onclick='termsAudio(\"CRSim_n12\");'/> <b>Chemical energy</b> is the type of energy stored in the bonds of chemical compounds, like glucose molecules." + cEPic);
            break;
        default:
            console.log("No term found");
    }

    sound = new Audio(audioLink + type + '.mp3');
    if (type == 'CO2') {
        sound = new Audio(audioLink + 'carbonDioxide.mp3');
    }
    sound.play();
}

//Reflection Questions
//COMMENT BACK: document.getElementById( "reQs" ).classList
var q2Text = "";

function reQsChecked() {
    saveStateToWISE('btn-submit-reflection-questions');
    var q1Answered = false;
    var q2Answered = false;

    var q1FeedBack = "";
    var q2FeedBack = "";

    if (document.getElementById("q1_A").checked == true || document.getElementById("q1_B").checked == true || document.getElementById("q1_C").checked == true) {
        //console.log("Question 1 answered");
        q1Answered = true;
        //saves question 1 answers
        if (document.getElementById("q1_A").checked) {
            q1_A_Checked = true;
            saveStateToWISE("q1-A-Checked");
        } else if (document.getElementById("q1_B").checked) {
            q1_B_Checked = true;
            saveStateToWISE("q1-B-Checked");
        } else {
            q1_C_Checked = true;
            saveStateToWISE("q1-C-Checked");
        }
    } else {
        //console.log("Question 1 NOT answered");
        q1FeedBack = "answer question one";
    }


    q2Text = document.getElementById("textbox_q2").value;
    var textboxCharCount = q2Text.length;
    //console.log( "Question 2 character count: " + textboxCharCount );
    //console.log(q2Text);


    if (textboxCharCount == 0) {
        //console.log("Question 2 not answered");
        q2FeedBack = "answer question two.";
    } else if (textboxCharCount < 15) {
        //console.log("Please provide more details for Question 2");
        q2FeedBack = "provide more details for question two.";
    } else {
        var q2Answered = true;
    }

    var join = " and ";
    if (q1FeedBack == "") {
        join = "";
    }
    if (q2FeedBack == "") {
        join = ".";
    }

    if (!q1Answered || !q2Answered) {
        alertBoxReQs("Make sure to answer to all your questions. </br>" + "Please " + q1FeedBack + join + q2FeedBack);
        saveStateToWISE('alert_reQs_failed_submit');
    } else {
        alertBoxReQs("You have successfully submitted your questionnaire!");
    }
    saveStateToWISE('submit-reflection-questions');
    saveStateToWISE('reflection-questions');
    //saveStateToWISE('save-reflection-questions');
}

function saveReQs() {
    q2Text = document.getElementById("textbox_q2").value;

    if (document.getElementById("q1_A").checked) {
        q1_A_Checked = true;
        saveStateToWISE("q1-A-Checked");
    } else if (document.getElementById("q1_B").checked) {
        q1_B_Checked = true;
        saveStateToWISE("q1-B-Checked");
    } else if (document.getElementById("q1_C").checked) {
        q1_C_Checked = true;
        saveStateToWISE("q1-C-Checked");
    }

    saveStateToWISE('btn-save-reflection-questions');
    saveStateToWISE('save-reflection-questions');
    saveStateToWISE('reflection-questions');
    alertBoxReQs("You have saved your answers!");
}

function alertBoxReQs(text) {
    alerting = true;
    document.getElementById('alertTextReQs').innerHTML = text;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxReQs').style.visibility = "visible";
}

function saveUnsubmitedTrial() {

}

// function alertBoxFormat(width, height, top, middle, leftBtn, rightBtn, leftBtnSaveState, rightBtnSaveState){
//     //width; height; ;top section (prompt); middle section (picture); left button; right button
//     document.getElementById().style.width = this.width;//"500px"
//     document.getElementById().style.height = this.height;//"500px"
//     document.getElementById().innerHTML = this.top;
// }

function alertBoxHypothesis(title, prompt, opt1_1, opt1_2, opt1_3, opt1_4, connectingTxt, opt2_1, opt2_2, opt2_3, opt2_4) {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxHypothesis').style.visibility = "visible";

    document.getElementById('alertBoxHText').innerHTML = title;
    document.getElementById('alertBoxHTextPrompt').innerHTML = prompt;
    document.getElementById('promptTxt').innerHTML = document.getElementById('alertBoxHText').innerHTML;
    if (document.getElementById('promptTxt').innerHTML == "Hypothesis") {
        document.getElementById('htxt').innerHTML = "When";
    }

    document.getElementsByName('hypothesisTxt1')[0].options[1].innerHTML = opt1_1;
    document.getElementsByName('hypothesisTxt1')[0].options[2].innerHTML = opt1_2;     
    document.getElementsByName('hypothesisTxt1')[0].options[3].innerHTML = opt1_3;     
    document.getElementsByName('hypothesisTxt1')[0].options[4].innerHTML = opt1_4; 

	document.getElementsByName('hypothesisTxt1')[0].options[1].value = opt1_1;
    document.getElementsByName('hypothesisTxt1')[0].options[2].value = opt1_2;     
    document.getElementsByName('hypothesisTxt1')[0].options[3].value = opt1_3;     
    document.getElementsByName('hypothesisTxt1')[0].options[4].value = opt1_4; 	
	
	document.getElementsByName('hypothesisTxt1')[0].options[1].style.backgroundColor = getColor(opt1_1);
	document.getElementsByName('hypothesisTxt1')[0].options[2].style.backgroundColor = getColor(opt1_2);
	document.getElementsByName('hypothesisTxt1')[0].options[3].style.backgroundColor = getColor(opt1_3);
	document.getElementsByName('hypothesisTxt1')[0].options[4].style.backgroundColor = getColor(opt1_4);

    document.getElementById('hypothesisTxt2').innerHTML = connectingTxt;

    document.getElementsByName('hypothesisTxt3')[0].options[1].innerHTML = opt2_1;
    document.getElementsByName('hypothesisTxt3')[0].options[2].innerHTML = opt2_2;     
    document.getElementsByName('hypothesisTxt3')[0].options[3].innerHTML = opt2_3;     
    document.getElementsByName('hypothesisTxt3')[0].options[4].innerHTML = opt2_4;  
   
    document.getElementsByName('hypothesisTxt3')[0].options[1].value = opt2_1;
    document.getElementsByName('hypothesisTxt3')[0].options[2].value = opt2_2;     
    document.getElementsByName('hypothesisTxt3')[0].options[3].value = opt2_3;     
    document.getElementsByName('hypothesisTxt3')[0].options[4].value = opt2_4; 
 
	document.getElementsByName('hypothesisTxt3')[0].options[1].style.backgroundColor = getColor(opt2_1);
	document.getElementsByName('hypothesisTxt3')[0].options[2].style.backgroundColor = getColor(opt2_2);
	document.getElementsByName('hypothesisTxt3')[0].options[3].style.backgroundColor = getColor(opt2_3);
	document.getElementsByName('hypothesisTxt3')[0].options[4].style.backgroundColor = getColor(opt2_4);

}

function enableSubmit() {
    document.getElementById('submitHBtn').style.visibility = "visible";
}
//to start the simulation
// if (stage == 0){playing = true; stage = 1;document.getElementById( 'playPause' ).innerHTML = '<b>Pause</b>'; document.getElementById( 'playPause' ).style.background = '#b77';}

function alertBoxHypothesisPart2() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxHypothesisPart2').style.visibility = "visible";

    document.getElementById('promptTxt').innerHTML = document.getElementById('alertBoxHText').innerHTML;
    if (document.getElementById('promptTxt').innerHTML == "Hypothesis 2") {
        document.getElementById('htxt').innerHTML = "During photosynthesis, chemical energy will ";
    }
    document.getElementById('h1txt').innerHTML = document.getElementById("hypothesisTxt1").options[document.getElementById("hypothesisTxt1").selectedIndex].text;
    document.getElementById('h2txt').innerHTML = document.getElementById('hypothesisTxt2').innerHTML;
    document.getElementById('h3txt').innerHTML = document.getElementById("hypothesisTxt3").options[document.getElementById("hypothesisTxt3").selectedIndex].text;
}

var h1_answer = ""; //hypothesis level one answer
var h2_answer = "";
var h3_answer = "";
var l1unlocked_h = false;
//var l2unlocked_h = false;

function recordHypothesisInNotes(page) {
    if (currentOpenTab == '1') {
		l1unlocked_h = true;
        document.getElementById('hBox_1').style.visibility = "visible";
        document.getElementById('h1_text_1').innerHTML = document.getElementById('h1txt').innerHTML;
        document.getElementById('h2_text_1').innerHTML = document.getElementById('h2txt').innerHTML;
        document.getElementById('h3_text_1').innerHTML = document.getElementById('h3txt').innerHTML;
		document.getElementById('h1_text_1').style.backgroundColor = getColor(document.getElementById('h1txt').innerHTML);
        document.getElementById('h2_text_1').style.backgroundColor = getColor(document.getElementById('h2txt').innerHTML);
        document.getElementById('h3_text_1').style.backgroundColor = getColor(document.getElementById('h3txt').innerHTML);
		
		if(document.getElementById('h1_text_1').innerHTML == "the reactants are"){
			//document.getElementById('HC_1').style.visibility = "inherit";
		}
		if(document.getElementById('h3_text_1').innerHTML == "chemical energy"){
			//document.getElementById('HC_3').style.visibility = "inherit";
		}
        alertBoxExperiment();
		readySound.play();

        saveStateToWISE("hypothesis-1-value");
        saveStateToWISE("hypothesis-2-value");
        saveStateToWISE("hypothesis-3-value");
    } else if (currentOpenTab == '2') {
        document.getElementById('hBox_2').style.visibility = "visible";
        document.getElementById('hypothesis2').style.visibility = "visible";
        document.getElementById('h1_text_2').innerHTML = document.getElementById('h1txt').innerHTML;
        document.getElementById('h2_text_2').innerHTML = "During photosynthesis, chemical energy will";
        document.getElementById('h3_text_2').innerHTML = document.getElementById('h3txt').innerHTML;
		document.getElementById('h1_text_2').style.backgroundColor = getColor(document.getElementById('h1txt').innerHTML);
        document.getElementById('h3_text_2').style.backgroundColor = getColor(document.getElementById('h3txt').innerHTML);
        alertBoxExperiment();

        saveStateToWISE("hypothesis-1-value-2");
        saveStateToWISE("hypothesis-2-value-2");
        saveStateToWISE("hypothesis-3-value-2");
        l2unlocked_h = true;
        // openTab('level2page', 'btn2');
    } else {
        console.log("ERROR: page not found, hypothesis not recorded")
    }

}

function alertBoxExperiment() {
    //set up experiment
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxExperiment').style.visibility = "visible";

    // document.getElementById('h1txt_d').innerHTML = document.getElementById('h1txt').innerHTML;
    // document.getElementById('h2txt_d').innerHTML = document.getElementById('h2txt').innerHTML;
    // document.getElementById('h3txt_d').innerHTML = document.getElementById('h3txt').innerHTML;
    saveStateToWISE('alert-box-experiment');

}


//document.getElementById("btn1").style.border = "black 1px solid";

var currentOpenTab = '1';

function openTab(levelX, btn) {
    // var x = document.getElementsByClassName("level");
    // var z = document.getElementsByClassName("tabB");
    // for (var i = 0; i < x.length; i++) {
    //    x[i].style.display = "none";
    //    z[i].style.backgroundColor = "#d3d3d3";   
    // }
    // if(btn == 'btn4'){
    //    document.getElementById(level).style.backgroundColor = "orange"; 
    // }
    if (levelX == "level1page") {
		curLevel = 1;
        currentOpenTab = '1';
        //document.getElementById("btn1").style.border = "black 1px solid";
        //document.getElementById("btn2").style.border = "none";
		//document.getElementById('level1page').style.visibility = 'hidden';
        document.getElementById('analysis1').style.visibility = 'hidden';
        document.getElementById('reasoning1').style.visibility = 'hidden';
        document.getElementById('feedback_1').style.visibility = 'hidden';
        document.getElementById('level2page').style.visibility = 'hidden';
        document.getElementById('analysis2').style.visibility = 'hidden';
        document.getElementById('reasoning2').style.visibility = 'hidden';
        document.getElementById('feedback_1').style.visibility = 'visible';
        document.getElementById('feedback_2').style.visibility = 'hidden';
        document.getElementById('tableWrapper').style.visibility = "visible";
        document.getElementById('hypothesis2').style.visibility = 'hidden';
        document.getElementById('hBox_2').style.visibility = 'hidden';
		document.getElementById('hypothesis1').style.visibility = 'visible';
	

        if (l1unlocked_h == true) {
            document.getElementById('hBox_1').style.visibility = "visible";
            document.getElementById('hBox1_title').style.visibility = 'visible';
            if (l1unlocked == true) {
                document.getElementById('level1page').style.visibility = 'visible';
                document.getElementById('analysis1').style.visibility = 'visible';
              //  if (l1unlocked_3 == true) document.getElementById('reasoning1').style.visibility = 'visible';
            }
        }

        //document.getElementById('reasoningTxt_1').value = reason_1;
       // document.getElementById('supportTrials_1').value = support_trials_1;
    } else if (levelX == "level2page") {
		curLevel = 2;
        currentOpenTab = '2';
        //document.getElementById("btn2").style.border = "black 1px solid";
        //document.getElementById("btn1").style.border = "none";
        //document.getElementById("btn2").style.height = "37px";
        document.getElementById("feedback_2").style.marginTop = ((trial1 + 1) * -28).toString() + 'px';
        //document.getElementById('level1page').style.visibility = 'hidden';
        //document.getElementById('analysis1').style.visibility = 'hidden';
        document.getElementById('reasoning1').style.visibility = 'hidden';
        document.getElementById('feedback_1').style.visibility = 'hidden';
        document.getElementById('hBox_1').style.visibility = "hidden";
        document.getElementById('hBox1_title').style.visibility = 'hidden';

        document.getElementById('hypothesis1').style.visibility = 'hidden';
        document.getElementById('hBox_1').style.visibility = 'hidden';
        document.getElementById('hypothesis2').style.visibility = 'hidden';
        document.getElementById('hBox_2').style.visibility = 'hidden';

        if (l2unlocked_table == true) {
            document.getElementById('feedback_2').style.visibility = 'visible';
        } else {
            //document.getElementById('tableWrapper').style.visibility = 'hidden';
        }

        if (l2unlocked_h == true) {
            document.getElementById('hypothesis2').style.visibility = "visible";
            document.getElementById('hBox_2').style.visibility = 'visible';
            if (l2unlocked_2 == true) {
                document.getElementById('level2page').style.visibility = 'visible';
                document.getElementById('analysis2').style.visibility = 'visible';
                //if (l2unlocked_3 == true) document.getElementById('reasoning2').style.visibility = 'visible';
            }
        } else {
            document.getElementById('hypothesisTxt1').value = 'Choose one';
            document.getElementById('hypothesisTxt3').value = 'Choose one';
            alertBoxHypothesis('Hypothesis 2', 'During photosynthesis, chemical energy will', 'be transformed into', 'be stored in', 'use up', 'create',
                '', 'light energy', 'thermal energy', 'glucose', 'the chloroplast');
        }
    }
    //document.getElementById('btn1').style.backgroundColor = '#a9c6e6';
    var allRows = document.getElementsByClassName("rowAll");
    var openRow = document.getElementsByClassName("row" + currentOpenTab);

    for (var i = 0; i < (allRows.length); i++) {
        allRows[i].style.visibility = 'hidden';
    }

    for (var i = 0; i < (openRow.length - 1); i++) {
        openRow[i].style.visibility = 'visible';
    }

}

function submitLevel() {
    if (evalNum == 1) {
        analysis_1 = document.getElementById('a1txt_' + evalNum).innerHTML;
        analysis2_1 = document.getElementById('a3txt_' + evalNum).innerHTML;
        support_trials_1 = document.getElementById('supportTrials_' + evalNum).innerHTML;
        reasoning_1 = document.getElementById('reasoningTxt_' + evalNum).value;
        saveStateToWISE('submitted-analysis-1');
    } else if (evalNum == 2) {
        analysis_2 = document.getElementById('a2txt_' + evalNum).innerHTML;
        analysis2_2 = document.getElementById('a3txt_' + evalNum).innerHTML;
        support_trials_2 = document.getElementById('supportTrials_' + evalNum).innerHTML;
        reasoning_2 = document.getElementById('reasoningTxt_' + evalNum).value;
        saveStateToWISE('submitted-analysis-2');
    }
    saveStateToWISE('submit-level');
    alertBoxSubmitLevel(true);
}

function saveLevel() {
    if (evalNum == 1) {
        analysis_1 = document.getElementById('a1txt_' + evalNum).innerHTML;
        analysis2_1 = document.getElementById('a3txt_' + evalNum).innerHTML;
        sup_trials_1 = document.getElementById('supportTrials_' + evalNum).innerHTML;
        reasoning_1 = document.getElementById('reasoningTxt_' + evalNum).value;
        saveStateToWISE('saved-analysis-1');

    } else if (evalNum == 2) {
        analysis_2 = document.getElementById('a2txt_' + evalNum).innerHTML;
        analysis2_2 = document.getElementById('a3txt_' + evalNum).innerHTML;
        sup_trials_2 = document.getElementById('supportTrials_' + evalNum).innerHTML;
        reasoning_2 = document.getElementById('reasoningTxt_' + evalNum).value;
        saveStateToWISE('saved-analysis-2');
    }
    saveStateToWISE('save-level');
    alertBoxSaveLevel();
}

function alertBoxSubmitLevel(correct) {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxSubmitLevel').style.visibility = "visible";

    if (document.getElementById('reasoningTxt_1').value.length < 15) {
        document.getElementById('submitTxt').innerHTML = "Please provide more details in your reasoning."
        // console.log("length of reasoning: " + document.getElementById('reasoningTxt_1').value.length);
    } else if (correct && evalNum == 1) {
        document.getElementById('submitTxt').innerHTML = "Congratulations! You have completed your experiments.</br>";
        l2unlocked = true;
        //unlockLevel();
    } else if (correct && evalNum == 2) {
        document.getElementById('submitTxt').innerHTML = "Congratulations! You have submitted your work.";
    } else {
        document.getElementById('submitTxt').innerHTML = "Not quite. Your reasoning has some incorrect ideas. You need to go back and revise your response."
    }
}

function alertBoxSaveLevel() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxSubmitLevel').style.visibility = "visible";
    document.getElementById('submitTxt').innerHTML = "Your work has been saved. Make sure to submit it when you are ready.";
}

var l1unlocked = false;
var l2unlocked = false;

/*function unlockLevel() { //switch from level to level in here
    level++;

    if (level <= 2) {
        document.getElementById("btn2").disabled = false;
        document.getElementById("btn2").innerHTML = "Level 2";
        document.getElementById("btn2").style.backgroundColor = "#c1e4c3";
    }

}*/


var allCorrect;
var TotalNumAllCorrect1 = 0;
var TotalNumAllCorrect2 = 0;
var CurrentlyCorrect = false;

var checkXArray = []; //c x

var checkDifferentArray_1 = []; //n (none), s (some)
var checkLevels_1 = []; //put all incorrect energy and matter combinations
var checkCLevels_1 = []; //put all energy and matter combinations

var checkDifferentArray_2 = [];
var checkLevels_2 = [];
var checkCLevels_2 = [];

function checkTrials() {
    allCorrect = true;
    var checkXInnerArray = [];
    var checkDifferentInnerArray = []; //only pushed if correct, and then check if they are different
    var checkInnerLevels = [];
    var checkInnerCLevels = [];

    //BE
    if (((energyLevel == 0 && matterLevel == 0) && document.getElementById('beMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 0) && document.getElementById('beMini').value == 'None') ||
        ((energyLevel == 0 && matterLevel == 1) && document.getElementById('beMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 1) && document.getElementById('beMini').value == 'Some')) {
        document.getElementById('checkBE' + getTrialNum(false)).src = "check.png";
        //saveStateToWISE('be-correct');
        checkXInnerArray.push('c');

        if (document.getElementById('beMini').value == 'None') {
            checkDifferentInnerArray.push('n');
        } else {
            checkDifferentInnerArray.push('s');
        }
    } else {
        //incorrect box
        document.getElementById('checkBE' + getTrialNum(false)).src = "redX.png";
        //saveStateToWISE('be-incorrect');
        checkXInnerArray.push('i');
        allCorrect = false;
    }

    //AE
    if (((energyLevel == 0 && matterLevel == 0) && document.getElementById('aeMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 0) && document.getElementById('aeMini').value == 'None') ||
        ((energyLevel == 0 && matterLevel == 1) && document.getElementById('aeMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 1) && document.getElementById('aeMini').value == 'Some')) {
        //check box
        document.getElementById('checkAE' + getTrialNum(false)).src = "check.png";
        checkXInnerArray.push('c');
        //saveStateToWISE('ae-correct');

        if (document.getElementById('aeMini').value == 'None') {
            checkDifferentInnerArray.push('n');
        } else {
            checkDifferentInnerArray.push('s');
        }
    } else {
        //incorrect box
        document.getElementById('checkAE' + getTrialNum(false)).src = "redX.png";
        //saveStateToWISE('ae-incorrect');
        checkXInnerArray.push('i');
        allCorrect = false;
    }

    //BM
    if (((energyLevel == 0 && matterLevel == 0) && document.getElementById('bmMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 0) && document.getElementById('bmMini').value == 'None') ||
        ((energyLevel == 0 && matterLevel == 1) && document.getElementById('bmMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 1) && document.getElementById('bmMini').value == 'Some')) {
        //check box
        document.getElementById('checkBM' + getTrialNum(false)).src = "check.png";
        //saveStateToWISE('bm-correct');
        checkXInnerArray.push('c');

        if (document.getElementById('bmMini').value == 'None') {
            checkDifferentInnerArray.push('n');
        } else {
            checkDifferentInnerArray.push('s');
        }
    } else {
        //incorrect box
        document.getElementById('checkBM' + getTrialNum(false)).src = "redX.png";
        //saveStateToWISE('bm-incorrect');
        checkXInnerArray.push('i');
        allCorrect = false;
    }

    //AM
    if (((energyLevel == 0 && matterLevel == 0) && document.getElementById('amMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 0) && document.getElementById('amMini').value == 'None') ||
        ((energyLevel == 0 && matterLevel == 1) && document.getElementById('amMini').value == 'None') ||
        ((energyLevel == 1 && matterLevel == 1) && document.getElementById('amMini').value == 'Some')) {
        //check box
        document.getElementById('checkAM' + getTrialNum(false)).src = "check.png";
        checkXInnerArray.push('c');
        //saveStateToWISE('am-correct');
        if (document.getElementById('amMini').value == 'None') {
            checkDifferentInnerArray.push('n');
        } else {
            checkDifferentInnerArray.push('s');
        }
    } else {
        //incorrect box
        document.getElementById('checkAM' + getTrialNum(false)).src = "redX.png";
        //saveStateToWISE('am-incorrect');
        checkXInnerArray.push('i');
        allCorrect = false;
    }
    checkDifferentInnerArray.push(energyLevel);
    checkDifferentInnerArray.push(matterLevel);
    checkInnerLevels.push(energyLevel);
    checkInnerLevels.push(matterLevel);
    checkInnerCLevels.push(energyLevel);
    checkInnerCLevels.push(matterLevel);
    checkXArray.push(checkXInnerArray);

    if (currentOpenTab == '1') {

        if (allCorrect && uniqueTrial(checkDifferentInnerArray, checkDifferentArray_1)) {
            checkDifferentArray_1.push(checkDifferentInnerArray);
        }

        if (allCorrect) {
            if (uniqueTrial(checkInnerCLevels, checkCLevels_1)) {
                //if unique correct-combo
                checkCLevels_1.push(checkInnerCLevels);
				TotalNumAllCorrect1++;
				CurrentlyCorrect = true;
                if (!uniqueTrial(checkInnerLevels, checkLevels_1)) {
                    //if cancels out incorrect-combo, remove
                    var rmNum = checkLevels_1.indexOf(checkInnerLevels.toString());
                    checkLevels_1.splice(rmNum, 1);
                }
            }
		if (TotalNumAllCorrect1 >= 2) {
			document.getElementById('analysis1').style.visibility = 'visible';
		
			}	
        } else {
            //if incorrect
            if (uniqueTrial(checkInnerLevels, checkLevels_1) && uniqueTrial(checkInnerCLevels, checkCLevels_1)) {
                checkLevels_1.push(checkInnerLevels);
            }
        }
        // console.log('CHECK INNER DIFF: ' + JSON.stringify(checkDifferentInnerArray));
        // console.log('CHECK DIFF: ' + JSON.stringify(checkDifferentArray_1));
        // console.log('CHECK INNER LEVELS: ' + JSON.stringify(checkInnerLevels));
        // console.log('CHECK LEVELS: ' + JSON.stringify(checkLevels_1));
        // console.log('CHECK INNER CLEVELS: ' + JSON.stringify(checkInnerCLevels));
        // console.log('CHECK CLEVELS: ' + JSON.stringify(checkCLevels_1));
    } else if (currentOpenTab == '2') {

        if (allCorrect && uniqueTrial(checkDifferentInnerArray, checkDifferentArray_2)) {
            checkDifferentArray_2.push(checkDifferentInnerArray);
        }

        if (allCorrect) {
            //if correct
            if (uniqueTrial(checkInnerCLevels, checkCLevels_2)) {
                //if unique correct-combo
				TotalNumAllCorrect2++;
                checkCLevels_2.push(checkInnerCLevels);
                if (!uniqueTrial(checkInnerLevels, checkLevels_2)) {
                    //if cancels out incorrect-combo, remove
                    var rmNum = checkLevels_2.indexOf(checkInnerLevels.toString());
                    checkLevels_2.splice(rmNum, 1);
                }
            }
			if (TotalNumAllCorrect2 >= 2) {
			document.getElementById('analysis2').style.visibility = 'visible';
			}
        } else {
            //if incorrect
            if (uniqueTrial(checkInnerLevels, checkLevels_2) && uniqueTrial(checkInnerCLevels, checkCLevels_2)) {
                checkLevels_2.push(checkInnerLevels);
            }
        }
        // console.log('CHECK INNER LEVELS: ' + JSON.stringify(checkInnerLevels));
        // console.log('CHECK LEVELS: ' + JSON.stringify(checkLevels_2));
        // console.log('CHECK INNER CLEVELS: ' + JSON.stringify(checkInnerCLevels));
        // console.log('CHECK CLEVELS: ' + JSON.stringify(checkCLevels_2));
    }


}

function WhichBoxToShow() {
	if (termType != "n11") {
	if (TotalNumAllCorrect1 >=2 && CurrentlyCorrect) {
		alertBoxCorrect();
		CurrentlyCorrect = false;
	} else {
		alertBoxAnalyze();
	}
	}
}


function uniqueTrial(inArr, outArr) {
    for (var i = 0; i < outArr.length; i++) {
        if (outArr[i].toString() == inArr.toString()) {
            return false;
        }
    }
    return true;
}

function alertBoxAnalyze() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxAnalyze').style.visibility = "visible";
    //feedback
    if (allCorrect) {
        document.getElementById('tableFeedback').innerHTML = "<p style='margin-top: 5px; font-size: 20px; font-weight: bold; color: green' ><img src='cr_sim_goodjob.png'>Great Job!</p>You have collected the <font color='green'><b>correct</b></font> data from your experiment!<br><br><img src='experiment.png'><font color='red'><b>Run another experiment</b></font> by changing your <font color='orange'><b>Light Energy</b></font> and <font color='blue'><b>Matter</b></font> settings.</b><br><br>";
		correctSound.play();
    } else {
        document.getElementById('tableFeedback').innerHTML = "<p style='font-size: 20px;'><img src='mod_incorrect.png'> <b><font color='red'>Incorrect</font> <font color='#006600'>Data Collection</font></b></p>Your <font color='blue'><b>TABLE</b></font> has some <font color='red'><b>INCORRECT</b></font> data.<br><br><img src='experiment.png'><b><font color='red'>Run your experiment again.</font><br><br>Remember to use evidence from the <b><mark><i>ENERGY Graph</i></b></font></b> and the <b><i><span style='background-color: #66b9bf'>MATTER Graph</span></i></b> when you record your data table.<br><br>";//incorrect feedback
        //document.getElementById('le_fb').innerHTML = document.getElementById('energySettingMini').innerHTML.toLowerCase();
       //document.getElementById('matter_fb').innerHTML = document.getElementById('matterSetting' + getTrialNum(false)).innerHTML.toLowerCase();
		wrongSound.play();
    }

}

var l2unlocked_2 = false;

function alertBoxCorrect() {
	scoresound = new Audio('scoresound.mp3');
	scoresound.loop = false;
	scoresound.volume = 0.3;
	scoresound.play();
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxCorrect').style.visibility = "visible";
    l1unlocked = true;
    document.getElementById('analysis1').style.visibility = 'visible';

    if (l2unlocked == true) {
        l2unlocked_2 = true;
    }
    openTab('level' + currentOpenTab + 'page', 'btn' + currentOpenTab);
}

function alertBoxIncorrect() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxIncorrect').style.visibility = "visible";
}

function alertBoxIncorrectTrialNum() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxIncorrectTrialNum').style.visibility = "visible";
	failedSound.play();
}


//function to prevent hypothesis triggering when the instruction box is opened
//title, prompt, opt1_1, opt1_2, opt1_3, opt1_4, connectingTxt, opt2_1, opt2_2, opt2_3, opt2_4
var pageNum = 0;

function preHAgain(doAgain) {
    if (currentOpenTab == '1' && doAgain && document.getElementById("hBox_1").style.visibility == "hidden") {
        document.getElementById('hypothesisTxt1').value = 'Choose one';
        document.getElementById('hypothesisTxt3').value = 'Choose one';
        alertBoxHypothesis('Hypothesis', 'When', 'the reactants are', 'chemical energy is', 'water is', 'glucose is',
            'present, <font color=orange>light energy</font> can be <u>transformed into</u>',
            'oxygen', 'chemical energy', 'thermal energy', 'glucose','.');
        //console.log("page# " + pageNum);
		//hypothesis box
        pageNum++;
    } else if (currentOpenTab == '2' && doAgain) {
        document.getElementById('hypothesisTxt1').value = 'Choose one';
        document.getElementById('hypothesisTxt3').value = 'Choose one';
        alertBoxHypothesis('Hypothesis 2', 'During photosynthesis, chemical energy will', 'be transformed into', 'be stored in', 'use up', 'create',
            '', 'light energy', 'thermal energy', 'glucose', 'the chloroplast');
        //console.log("page# " + pageNum);
        pageNum++;
    }
}

function preBoxAnalyze() {
    if (getTrialNum(false) < 2) {
        //not enough trials
        alertBoxIncorrectTrialNum();
    } else {
        //are there two different trials correct trials
        if (currentOpenTab == '1') {
            if (checkDifferentArray_1.length >= 2 && checkLevels_1.length == 0) {
                alertBoxCorrect();
            } else if(checkDifferentArray_1.length <= 2 && checkLevels_1.length > 0){
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "<p><img src='experiment.png'><font color='red'>You Need</font> <font color='green'><u>TWO</u> CORRECT</font> <font color='red'>Experiments!</font></p> You are <font color='red'>NOT</font> ready to analyze your data.</br></br>Your <font color='blue'>data table</font> has <img src='mod_incorrect.png'> <font color='red'>incorrect</font> values.</br></br>You need to repeat the experiment and revise your data table before you can move on to your Analysis.";
            }else if (checkLevels_1.length > 0) {
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "<p><img src='experiment.png'><font color='red'>You Need</font> <font color='green'><u>TWO</u> CORRECT</font> <font color='red'>Experiments!</font></p> You are <font color='red'>NOT</font> ready to analyze your data.</br></br>Your <font color='blue'>data table</font> has <img src='mod_incorrect.png'> <font color='red'>incorrect</font> values.</br></br>You need to repeat the experiment and revise your data table before you can move on to your Analysis";
            } else if (checkDifferentArray_1.length <= 2) {
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "<p><img src='experiment.png'><font color='red'>You Need</font> <font color='green'><u>TWO</u> CORRECT</font> <font color='red'>Experiments!</font></p> You are <font color='red'>NOT</font> ready to analyze your data.</br></br>Your <font color='blue'>data table</font> has <img src='mod_incorrect.png'> <font color='red'>incorrect</font> values.</br></br>You need to repeat the experiment and revise your data table before you can move on to your Analysis";
            }

        } else if (currentOpenTab == '2') {
            if (checkDifferentArray_2.length >= 2 && checkLevels_2.length == 0) {
                alertBoxCorrect();
            } else if(checkDifferentArray_2.length <= 2 && checkLevels_2.length > 0){
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "You are <u>NOT</u> ready to analyze your data!</br></br>You have <font color='red'>incorrect</font> values and you don't have two different correct trials in your table!</br></br>You need to repeat the experiment and fix your data collection before you can move on to your Analysis.";
            }else if (checkLevels_2.length > 0) {
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "You are <u>NOT</u> ready to analyze your data!</br></br>You have some <font color='red'>incorrect</font> values in your table!</br></br>You need to repeat the experiment and fix your data collection before you can move on to your Analysis.";
            } else if (checkDifferentArray_2.length <= 2) {
                alertBoxIncorrect();
                document.getElementById('dataIncorrectText').innerHTML = "You are <u>NOT</u> ready to analyze your data!</br></br>You do not have <font color='green'><u>TWO</u> different correct</font> trials in your table!</br></br>You need to repeat the experiment and fix your data collection before you can move on to your Analysis.";
            }
        }
    }
}
//if there is an incorrect trial that hasn't been fixed can't move on

var evalNum = 1;
var l1unlocked_3 = false;
var l2unlocked_3 = false;


function check(x) {
    elements = document.getElementsByClassName(x);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "blue";
    }
}

function alertBoxAnalysisCorrect() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxAnalysisCorrect').style.visibility = "visible";
}

function alertBoxAnalysisIncorrect() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxAnalysisIncorrect').style.visibility = "visible";
}

function alertBoxAnalysisFeedback() {
    alerting = true;
    document.getElementById('film').style.visibility = "visible";
    document.getElementById('alertBoxAnalysisFeedback').style.visibility = "visible";

}

function calculateScore(correctDDs){
	var tempScore = 0;
	if(curLevel == 1){
		if(correctDDs == 2){
			tempScore += (20*lives);
		}
		tempScore += (20*correctDDs);
		
	}
	score = tempScore;
	
	var livesString = "";
	
	for(var i=0; i<3; i++){
		if(lives - i > 0){
			livesString += "<img src='heart.png' class='life'></img>";
		}else{
			livesString += "<img src='heartUsed.png' class='life'></img>";
		}
	}
	document.getElementById("scoreboard1").innerHTML = "Score: "+score+"/100" + livesString;
	
}

function submitAnalysis() {
    saveStateToWISE("submitted_analysis_1");
    document.getElementById('analyzeMoveOnBtn').style.visibility = 'hidden';
    document.getElementById('analyzeAgainBtn').style.visibility = 'hidden';
	
	var correctDDs = 0;

    if (evalNum == '1') {
        if (document.getElementById('analysisDD1_1').value == 'the reactants are' && document.getElementById('analysisDD2_1').value == 'chemical energy') {
			correctDDs = 2;
            //If analysis is correct
			let tempStr = "";
			if((3-lives) != 1){
				tempStr = " hearts";
			}
            document.getElementById('alertBoxAnalysisFeedbackMainText').innerHTML = " <p style='margin-top: 5px; font-size: 20px; font-weight: bold;'><img src='congrats.png'><br>Congratulations! Your analysis is correct!</p> You earned <mark><b>" + (lives*20) + " extra points</b></mark> for using a total of <b><font color='red'>"+ (3-lives) + "</b><font> <img src='heart.png' class='life'></img>"+tempStr+".<br><br><img src='camera.png'><font color='red'>Take a SCREENSHOT of your work!</font>";
            document.getElementById('analyzeMoveOnBtn').style.visibility = 'visible';
			finishSound.play();
            //l2unlocked = true;

            //Gets values for Anaysis Drop Down Question 1
            analysis_1 = document.getElementById('analysisDD1_1').value;
            analysis2_1 = document.getElementById('analysisDD2_1').value;

            //Changes from drop down to submitted analysis
            document.getElementById('analysis1').innerHTML =
                "<span>When</span><span id='a1txt_1' class='hBox'></span><img width='15' height='15'id='aFT_1' src='check.png'> <span id='a2txt_1'> present, <font color='orange'>light energy</font> can be <u>transformed into</u></span> <span id='a3txt_1' class='hBox'></span><img width='15' height='15'id='aFT_1' src='check.png'>.<div id='scoreboard1' class='scoreboard' style='visibility: inherit;'>Score: 0/100 <img src='heart.png' class='life'></img><img src='heart.png' class='life'></img><img src='heart.png' class='life'></img></div>";
            document.getElementById('a1txt_1').innerHTML = analysis_1;
            document.getElementById('a2txt_1').innerHTML = 'present, <font color=orange>light energy</font> can be <u>transformed into</u>';
            document.getElementById('a3txt_1').innerHTML = analysis2_1;
			document.getElementById('a1txt_1').style.backgroundColor = getColor(analysis_1);
            document.getElementById('a3txt_1').style.backgroundColor = getColor(analysis2_1);
			
			

            l1unlocked_3 = true;
            //openTab('level' + currentOpenTab + 'page', 'btn' + currentOpenTab);
        } else {
			if(lives > 0){
				lives--;
			}
            //If analysis is incorrect
			wrongSound.play();
            document.getElementById('alertBoxAnalysisFeedbackMainText').innerHTML = "<img src='mod_incorrect.png'><b><font color='red'>Incorrect</font> Analysis</font></b><br><br><span id='aBAFMT_Intro'> Nice try, but your analysis is <font color='red'>incorrect</font>. <br><br><img src='edit.png'><b>Use <font color='green'>evidence</font> from your <font color='blue'>data table</font> and revise <font color='red'>both answers</font>.</b><br><br>You lost <font color='blue'>one chance</font>.<br><b>-</b><img src='heartUsed.png' style='width: 20px; margin-top: 10px; display: inline-block;'/>";//:</span> </br></br> During photosynthesis, if the reactants are present, <font color='red' id='aBAFMT_1'>light energy</font><img width='20' height='20'id='aFT_1' src='redX.png'> is transformed into <font color='red' id='aBAFMT_2'>chemical energy</font><img width='20' height='20' id='aFT_2' src='redX.png'>.";
            document.getElementById('analyzeAgainBtn').style.visibility = 'inherit';
            if (document.getElementById('analysisDD1_1').value == 'the reactants are') {	
				//document.getElementById('aBAFMT_1').innerHTML = document.getElementById('analysisDD1_1').value;
				correctDDs = 1;
                //If Analysis 1 Part 1 is correct
                //document.getElementById('aBAFMT_1').style.color = 'green';
                document.getElementById('aBAFMT_Intro').innerHTML = "<img src='goodprogress.png'>You are making a good progress, but your <font color='red'><u>second</u></font> response is incorrect. <p style='background-color: #99ff99;'><b>What happens to <font color='orange'>light energy</font> when <font color='blue'>carbon dioxide and water</font> are present during photosynthesis?</b></p>You lost <font color='blue'>one chance</font>.<br><b>-</b><img src='heartUsed.png' style='width: 20px; margin-top: 10px; display: inline-block;'/>";
				failedSound.play();//change to progress

                //change text section
                //part2 dd
                document.getElementById('analysis1').innerHTML =
                    "<span>When </span><span id='analysisDD1_1' class='hBox'>the reactants are</span><img width='15' height='15'id='aFT_1' src='check.png'> present, <font color='orange'>light energy</font> can be <u>transformed into</u> <select id='analysisDD2_1' onchange='this.style.backgroundColor = getColor(this.value);'><option value='' selected disabled hidden>Choose one</option><option value='oxygen' style='background-color: #cccccc;'>oxygen</option><option value='chemical energy' style='background-color: #02b119;'>chemical energy</option><option value='thermal energy' style='background-color: #ff0000;'>thermal energy</option><option value='glucose' style='background-color: #688a6f;'>glucose</option><option value='' hidden>incorrect</option></select><img width='15' height='15'id='aFT_2' src='redX.png'>.<button class='bBtn' id='submitAnalysis_1' style='margin-left: 620px; margin-top: -100px;' onclick='evalNum = 1; submitAnalysis();'>Submit</button><div id='scoreboard1' class='scoreboard' style='visibility: inherit;'>Score: 0/100 <img src='heart.png' class='life'></img><img src='heart.png' class='life'></img><img src='heart.png' class='life'></img></div>";
                document.getElementById('aFT_1').src = "check.png";
				document.getElementById('analysisDD1_1').value = 'the reactants are';
				document.getElementById('analysisDD1_1').style.backgroundColor = getColor('the reactants are');
				
            } else if (document.getElementById('analysisDD2_1').value == 'chemical energy') {
				//document.getElementById('aBAFMT_2').innerHTML = document.getElementById('analysisDD2_1').value;
				correctDDs = 1;
                //If Analysis 1 Part 2 is correct
                //document.getElementById('aBAFMT_2').style.color = 'green';
                document.getElementById('aBAFMT_Intro').innerHTML = "<img src='goodprogress.png'> You are making a good progress, but your <font color='red'><b>first</b></font> response is incorrect.<p style='background-color:#ffffe6;'><font color='green'><b>When can photosynthesis happen?</b></font></p>Use <font color='green'>evidence</font> from your <font color='blue'>data table</font> and revise your <font color='red'>first</font> response.<br><br>You lost <font color='blue'>one chance</font>.<br><b>-</b><img src='heartUsed.png' style='width: 20px; margin-top: 10px; display: inline-block;'/";

                document.getElementById('analysis1').innerHTML =
                    "<span>When </span> <select id='analysisDD1_1' onchange='this.style.backgroundColor = getColor(this.value);'><option value='' selected disabled hidden>Choose one</option><option value='the reactants are' style='background-color: #9933ff;'>the reactants are</option><option value='chemical energy' style='background-color: #02b119;'>chemical energy</option><option value='oxygen' style='background-color: #cccccc;'>oxygen</option><option value='glucose' style='background-color: #688a6f;'>glucose</option><option value='' hidden>incorrect</option></select><img width='15' height='15'id='aFT_1' src='redX.png'> present, <font color='orange'>light energy</font> can be <u>transformed into</u> <span id='analysisDD2_1' class='hBox'>chemical energy</span><img width='15' height='15'id='aFT_2' src='check.png'>.<div id='scoreboard1' class='scoreboard' style='visibility: inherit;'>Score: 0/100 <img src='heart.png' class='life'></img><img src='heart.png' class='life'></img><img src='heart.png' class='life'></img></div><button class='bBtn' id='submitAnalysis_1' style='margin-left: 620px; margin-top: -100px;' onclick='evalNum = 1; submitAnalysis();'>Submit</button>";
                
                document.getElementById('aFT_2').src = "check.png";
				document.getElementById('analysisDD2_1').value = 'chemical energy';
				document.getElementById('analysisDD2_1').style.backgroundColor = getColor('chemical energy');
            }
        }
    }

	calculateScore(correctDDs);
	saveStateToWISE("submit-analysis");
    alertBoxAnalysisFeedback();
}


function revealReasoning() {
    if (currentOpenTab == '1') {
        //document.getElementById('reasoning1').style.visibility = 'visible';
    } else {
        //document.getElementById('reasoning2').style.visibility = 'visible';
    }
}

function calculatePoints(){
    if(currentOpenTab == '1'){

    }
}