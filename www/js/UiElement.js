class UiElement {

    constructor (theGame, type, name, parentLayer, eventPos, elemPos, src, srcHover, activeView, popupText, pointerStyle, linkedObject, textInfo, forceRefresh) {

        this.type = type;
        this.name = name;
        this.parentLayer = parentLayer;
        this.eventPos = eventPos;
        this.elemPos = elemPos;
        this.activeView = activeView;
        this.src = src;
        this.srcHover = srcHover;
        this.textInfo = textInfo; // [text, font, color, fullSize]
        this.popupText = popupText;
        this.pointerStyle = pointerStyle;
        this.linkedObject = linkedObject;
        this.forceRefresh = forceRefresh;
        this.game = theGame;
    }

    onClick(){};

    refresh(){};

    isOnThisView(){
        let isOnView = false;

        if(Array.isArray(this.activeView)){
            for(let i = 0; i<this.activeView.length; i++) {
                if (this.activeView[i] === this.game.currentView) {
                    isOnView = true;
                }
            }
        }
        else{
            if(this.activeView === this.game.currentView)
                isOnView = true;
        }


        return isOnView;
    }

    static initUiElements (theGame){
        const uiElements = [];
        const uiLayer = Tb.getObjectInArrayFromName(theGame.layers, "uiLayer");

        //porte du bunker pour sortir
        const leaveBunker = new UiElement(theGame,"button", "door", uiLayer, [132, 317, 184, 467], [0, 0], null, "mouseReact/doorHover.png", "inside", ["Explorer les alentours", "tant qu'il fait jour..."], "zoom-in", null, null, false);
        leaveBunker.onClick = function () {
            theGame.currentView = "outside";

            theGame.playSound("desert");
        };
        uiElements.push(leaveBunker);

        //back
        const back = new UiElement(theGame,"button","back",uiLayer,[323,477,490,540],[323,490],"mouseReact/back.jpg","mouseReact/backHover.jpg", "workshop",null,"pointer",null,null,false);
        back.onClick = function(){
            theGame.currentView = "inside";
            if(!theGame.time.isStarted)
                theGame.time.start()
        };
        uiElements.push(back);

        //bureau de recherche
        const desk = new UiElement(theGame,"button", "desk", uiLayer, [400, 622, 378, 532], [0, 0], null, "mouseReact/deskHover.png", "inside", ["Atelier"], "pointer", null, null, false);
        desk.onClick = function(){
            theGame.currentView = "workshop";
        };
        uiElements.push(desk);


        const hoursText = new UiElement(theGame,"text", "hours", uiLayer, [505, 720, 25, 50], [505, 45], null, null, ["inside","workshop"],
            ["Le jour se lève à 8h et", "la nuit tombe à 20h"], null, null, [null, "25px Arial", null, false], false);
        hoursText.refresh = function (){
            let hours = theGame.time.hours;
            if (hours < 10) {
                hours = "0" + hours;
            }
            let minutes = theGame.time.minutes;
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            this.textInfo[0] = "Jour " + theGame.time.day + " sur 7  " + hours + "h" + minutes;
        };

        uiElements.push(hoursText);

        //sound on off
        const soundOnOff = new UiElement(theGame, "image", "soundOnOff", uiLayer, [741, 793, 11, 61], [745, 16], null, null, ["inside", "workshop"], null, null, null, null, false);
        soundOnOff.refresh = function () {

            if (theGame.soundOn) {
                this.popupText = ["Couper le son"];
                this.src = "mouseReact/soundOn.png";
                this.srcHover = "mouseReact/soundOff.png";
            }
            else {
                this.popupText = ["Activer le son"];
                this.src = "mouseReact/soundOff.png";
                this.srcHover = "mouseReact/soundOn.png";
            }

        };
        soundOnOff.onClick = function () {

            theGame.soundOn = !theGame.soundOn;
            if (theGame.soundOn) {
                theGame.playSound("oldtime");
            }
            else {
                theGame.playSound("");
            }

        };

        uiElements.push(soundOnOff);

        //avatar en jeu
        const avatar = new UiElement(theGame, "image", "avatar", uiLayer, [12, 53, 11, 61], [17, 11], null, null, ["inside","workshop"], null, null, null, null, false);
        avatar.refresh = function (){
            const player = theGame.currentPlayer;
            this.src = player.avatar;
            this.popupText = ["C'est vous, "+player.nickname];
        };
        uiElements.push(avatar);


        //nom de début de partie
        uiElements.push(new UiElement(theGame, "text", "readyUpText", uiLayer, null, [null, 326, 400], null, null,
            "readyUp", null, null, null, ["Au tour de " + theGame.currentPlayer.nickname, "65px Arial", "white", false], false));

        // button prêt à jouer
        const gameStart = new UiElement(theGame,"button","gameStart",uiLayer,[333,487,490,540],[333,490],"mouseReact/ready.jpg","mouseReact/readyHover.jpg", "readyUp",null,"pointer",null,null,false);
        gameStart.onClick = function(){
            theGame.currentView = "inside";
            theGame.playSound("oldtime");
            theGame.time.start()
        };
        uiElements.push(gameStart);

        //numero de partie
        const gameNbr = new UiElement(theGame,"text", "gameNbr", uiLayer, null, [477, 118], null, null,
            "readyUp", null, null, null, [null, "65px Arial", "white", null], false);
        gameNbr.refresh = function () {
            this.textInfo[0] = theGame.currentGame;
        };
        uiElements.push(gameNbr);

        //ressources
        for (let i = 0; i < theGame.materials.length; i++) {

            const material = theGame.materials[i];

            const materialStock = new UiElement(theGame,"text", material.id, uiLayer, null, [120 + (i * 100), 45], null, null,
                ["inside","workshop"], null,null,theGame.materials[i],[material.stock, null,null,null],false);
            materialStock.refresh = function (){
                this.textInfo[0] = this.linkedObject.stock;
            };

            uiElements.push(materialStock);

            const materialElement = new UiElement(theGame,"image", material.id, uiLayer, [80 + (i * 100), 140 + (i * 100), 22, 52], [80 + (i * 100), 22],
                material.src,null, ["inside","workshop"], [material.name],null,null,null,false);
            uiElements.push(materialElement);

        }


        //zones
        for (let i = 0; i < theGame.areas.length; i++) {

            const area = theGame.areas[i];

            const areaElement = new UiElement(theGame,"button",area.name,uiLayer,area.eventPos,area.elemPos,null,area.srcHover,
                "outside", null,"zoom-in",theGame.areas[i],null,false);
            areaElement.onClick = function(){
                theGame.currentTrip = new Trip(theGame, theGame.areas[i]);
                theGame.areas[i].visited = true;
                theGame.currentView = "tripWait";
            };
            areaElement.refresh = function(){
                const area = this.linkedObject;
                let toolTip = [area.namefr, "Exploration: " + area.tripTimeMin + " min", "Ressources : "];

                if(area.visited){

                    if(area.materialsFactor !== null){
                        for(let j = 0; j<area.materialsFactor.length; j++)
                            if(area.materialsFactor[j] > 0){
                                toolTip.push(" - "+theGame.materials[j].name + " "+area.materialsFactor[j]+"%");
                            }
                    }
                    else{
                        toolTip.push(" - Aucune");
                        if(area.name === "airport"){


                            if(theGame.airportFenceCut){
                                this.srcHover = "mouseReact/airportHoverB.png";
                                toolTip.push(" Réparations de l'avion:");
                                toolTip.push(" - Ferraille 60");
                                toolTip.push(" - Pétrole 30");
                            }
                            else{
                                toolTip.push(" Une clôture bloque l'accès");
                            }
                        }
                    }
                }
                else if(!area.visited)
                    toolTip.push(" - ????");

                this.popupText = toolTip;
            };
            uiElements.push(areaElement);

        }

        //bouton jour suivant
        const nextDay = new UiElement(theGame,"button","nextDay",uiLayer,[250, 550, 520, 580], [250, 520],
            "mouseReact/nextDay.jpg","mouseReact/nextDayHover.jpg", "dayResume", null, "pointer",null,null,false);
        nextDay.onClick = function(){
            theGame.time.nextDay();
        };
        uiElements.push(nextDay);


        //overlay de résultat d'un voyage
        uiElements.push(new UiElement(theGame,"image", "tripResult", uiLayer, null, [0, 0], "overlays/tripResult.png",
            null, "tripResult", null, null, null, null,false));

        //text loots voyage
        const tripResultLoot = new UiElement(theGame,"text", "tripResultLoots", uiLayer, null, [84, 260], null, null,
            "tripResult",  null, null, null, [null, "20px Arial","white",null],false);
        tripResultLoot.refresh = function () {
            let textLoot = "";
            let countLoot = 0;

            if(theGame.currentTrip.loots.length > 0){
                for(let i = 0; i< theGame.currentTrip.loots.length; i++){
                    countLoot += theGame.currentTrip.loots[i];
                    if(theGame.currentTrip.loots[i]>0)
                        textLoot += theGame.materials[i].name+": "+theGame.currentTrip.loots[i]+"      ";
                }
            }
            if(countLoot === 0)
                textLoot = "Aucune";
            this.textInfo[0] = textLoot;
        };
        uiElements.push(tripResultLoot);

        //text resultat voyage information
        const tripResultText = new UiElement(theGame,"text", "tripResultText", uiLayer, null, [84, 350], null, null,
            "tripResult",  null, null, null, [null, "20px Arial","white",null],false);

        tripResultText.refresh = function () {
            if(theGame.currentTrip != null){
                this.textInfo[0] = theGame.currentTrip.area.areaInfo;

                if(theGame.currentTrip.area.name === "airport" && !Tb.getObjectInArrayFromName(theGame.techs,"pliers").researched){

                    this.textInfo[0] = [
                        "Un petit avion se trouve sur la piste principale mais l’accès est",
                        "bloqué par une clôture métallique infranchissable.",
                        "Si seulement j'avais un outil pour la découper..."
                    ]
                }
            }

            if(this.textInfo[0] == null)
                this.textInfo[0] = "Aucune";
        };

        uiElements.push(tripResultText);

        //bouton retour après exploration
        const backBase = new UiElement(theGame,"button", "backBase", uiLayer, null, [250, 535],
            "mouseReact/backBase.jpg", "mouseReact/backBaseHover.jpg", "tripResult", null, "pointer", null, null,false);
        backBase.onClick = function () {
            theGame.time.start();
            theGame.currentView = "inside";
            theGame.playSound("oldtime");
        };
        backBase.refresh = function(){
            if(theGame.currentTrip.area.name === "airport" && Tb.getObjectInArrayFromName(theGame.techs,"pliers").researched){
                this.game.airportFenceCut = true;
                this.elemPos[0] = 140;
                this.eventPos = [140, 440, 535, 597];
            }
            else{
                this.elemPos[0] = 250;
                this.eventPos = [250, 550, 535, 597];
            }

        };
        uiElements.push(backBase);

        //bouton de réparation de l'avion
        const repairPlane = new UiElement(theGame,"button", "repairPlane", uiLayer, [508, 654, 535, 615], [508, 535],
            "mouseReact/repairPlane.jpg", null,null, null, "pointer", null, null,true);

        repairPlane.onClick = function () {
            if(theGame.materials[1].stock >= 30 && theGame.materials[3].stock >= 60){
                theGame.time.stop();
                theGame.currentScore += 3000-theGame.time.day*100;
                theGame.currentView = "victory";
                theGame.playSound("victory");
            }
        };

        repairPlane.refresh = function() {

            if (theGame.currentTrip !== null) {

                if (theGame.currentTrip.area.name === "airport" && Tb.getObjectInArrayFromName(theGame.techs,"pliers").researched)
                    this.activeView = "tripResult";
                else
                    this.activeView = "";
            }

            if(theGame.materials[1].stock >= 30 && theGame.materials[3].stock >= 60){
                this.pointerStyle = "pointer";
                this.srcHover = "mouseReact/repairPlaneHover.jpg";
                this.popupText = null;
            }
            else{
                this.pointerStyle = "not-allowed";
                this.srcHover = "mouseReact/repairPlane.jpg";
                this.popupText = ["Ressources insuffisantes"];
            }
        };

        uiElements.push(repairPlane);

        //score final
        const finalScore = new UiElement(theGame,"text", "finalScore", uiLayer, null, [120, 475], null, null,
            ["victory","gameOver"], null, null, null, [null, "30px Arial", "white", true], true);
        finalScore.refresh = function () {
            this.textInfo[0] = "Score final: "+ theGame.currentScore+" points";

            if(theGame.currentView === "victory")
                this.elemPos[1] = 450;
            else
                this.elemPos[1] = 475;
        };
        uiElements.push(finalScore);

        //bouton  après partie
        const scoreNext = new UiElement(theGame,"button","scoreNext",uiLayer,[333,487,490,550],[333,490],
            null,null, ["victory","gameOver"], null, "pointer",null,null,true);

        scoreNext.onClick = function(){
            theGame.endGame();
        };
        scoreNext.refresh = function(){
            if(theGame.currentGame < theGame.nbrGames){
                this.src = "mouseReact/next.jpg";
                this.srcHover = "mouseReact/nextHover.jpg";
            }
            else{
                this.src = "mouseReact/scores.jpg";
                this.srcHover = "mouseReact/scoresHover.jpg";
            }

            if(theGame.currentView === "victory"){
                this.elemPos[1] = 490;
                this.eventPos = [333,487,490,550];
            }
            else{
                this.elemPos[1] = 530;
                this.eventPos = [333,487,530,590];
            }
        };

        uiElements.push(scoreNext);

        //game over reason
        uiElements.push(new UiElement(theGame,"text", "gameOverReason", uiLayer, null, [20, 400], null, null,
            "gameOver",  null, null, null, [null, "30px Arial","red",true],false));

        //temps restant du voyage en cours
        uiElements.push(new UiElement(theGame,"image", "tripWait", uiLayer, null, [0, 0],
            "overlays/tripWait.png", null, "tripWait", null, null, null, null,false));

        const tripWaitTimer = new UiElement(theGame,"text", "tripTime", uiLayer, null, [120, 170], null, null,
            "tripWait", null, null, null, [null, "bold 60px Arial","white",true],false);
        tripWaitTimer.refresh = function () {
            const minutesLeft = theGame.time.minutsDiff(theGame.currentTrip.timeEnd);
            if (minutesLeft < 1) {
                if(theGame.currentTrip.area.materialsFactor != null)
                    theGame.currentTrip.generateLoots();

                theGame.currentView = "tripResult";
                theGame.time.stop();
            }
            else {
                const minutes = minutesLeft % 60;
                const hours = Math.floor(minutesLeft / 60);

                if (hours === 0)
                    this.textInfo[0] = "Exploration: " + minutes + " min";
                else
                    this.textInfo[0] = "Exploration: " + hours + "h " + minutes + "m";
            }
        };
        uiElements.push(tripWaitTimer);

        //atelier
        for (let i = 0; i < theGame.techs.length; i++) {

            const tech = theGame.techs[i];

            const techButton = new UiElement(theGame,"button",tech.name, uiLayer, [tech.onTechTreePos[0], tech.onTechTreePos[0]+50, tech.onTechTreePos[1], tech.onTechTreePos[1]+50],
                tech.onTechTreePos, tech.iconSrc, tech.iconSrcHover, "workshop", null, "pointer", null, null,false);

            techButton.refresh = function(){

                //Tooltip
                const toolTip = tech.tooltipText.slice(0);

                if(tech.name === "repair"){
                    toolTip.push("");
                    toolTip.push("Résistance: "+Tb.getObjectInArrayFromName(theGame.structures,"bunker").hp+"/5000");
                }
                if(tech.researched){
                    this.src = tech.iconActivated;
                    this.srcHover = tech.iconActivated;
                    this.pointerStyle = "default";
                }
                else{
                    this.src = tech.iconSrc;
                    this.srcHover = tech.iconSrcHover;

                    toolTip.push("");
                    toolTip.push("Coût :");

                    for (let j = 0; j < 4; j++)
                        if (tech.materialCost[j] > 0)
                            toolTip.push(" - " + theGame.materials[j].name + " " + tech.materialCost[j]);

                    if(tech.canAfford())
                        this.pointerStyle = "pointer";
                    else
                        this.pointerStyle = "not-allowed";
                }

                this.popupText = toolTip;
            };

            techButton.onClick = function(){

                if(!tech.researched && tech.canAfford())
                    tech.activate();
            };

            uiElements.push(techButton);
        }

        //strucutres
        for (let i = 0; i < theGame.structures.length; i++) {
            const struct = theGame.structures[i];

            const structElem = new UiElement(theGame,"image", "tripResult", uiLayer, struct.onViewInteract, [0, 0], struct.onViewSrc, struct.onViewSrcHover, "", struct.toolTip
                , null, null, null,true);

            structElem.refresh = function(){
                if(struct.techOk()) {
                    this.activeView = struct.activeView;
                }

                if (struct.name === "watchTower") {
                    this.popupText = [theGame.zombieNextNight + " zombies en approche"]
                }
            };
            uiElements.push(structElem);
        }

        //bunker extérieur pour entrer
        const bunkerOutside = new UiElement(theGame,"button", "bunkerOutside", uiLayer, [375, 450, 260, 321], [0, 0], null,
            "mouseReact/bunkerOutsideHover.png", "outside", ["Se mettre à l'abri"], "pointer", null, null, false);
        bunkerOutside.onClick = function () {
            theGame.currentView = "inside";
            theGame.playSound("oldtime");
        };
        bunkerOutside.refresh = function(){
            this.popupText =["Se mettre à l'abri","Résistance "+Tb.getObjectInArrayFromName(theGame.structures,"bunker").hp+"/5000"];
        };

        uiElements.push(bunkerOutside);

        //résumé de la journée
        const dayResumeDay = new UiElement(theGame,"text", "dayResumeDay", uiLayer, null, [645, 115], null, null,
            "dayResume", null, null, null, [null, "60px Arial", "red", null], false);
        dayResumeDay.refresh = function () {
            this.textInfo[0] = theGame.time.day;
        };
        uiElements.push(dayResumeDay);

        const dayResumeDmg = new UiElement(theGame, "text", "dayResumeDmg", uiLayer, null, [null, 393, 217], null, null,
            "dayResume", null, null, null, [null, "30px Arial", "red", null], false);
        dayResumeDmg.refresh = function () {
            this.textInfo[0] = theGame.nightDmg;
        };
        uiElements.push(dayResumeDmg);

        const dayResumeNbrZombie = new UiElement(theGame, "text", "dayResumeNbrZombie", uiLayer, null, [null, 204, 247], null, null,
            "dayResume", null, null, null, [null, "30px Arial", "red", null], false);
        dayResumeNbrZombie.refresh = function () {
            this.textInfo[0] = theGame.zombieNextNight;
        };
        uiElements.push(dayResumeNbrZombie);

        const dayResumeDefenseZombie = new UiElement(theGame,"text", "dayResumeDefenseZombie", uiLayer, null, [503, 280], null, null,
            "dayResume", null, null, null, [null, "30px Arial", "red", null], false);
        dayResumeDefenseZombie.refresh = function () {
            this.textInfo[0] = theGame.zombieReduction;
        };
        uiElements.push(dayResumeDefenseZombie);

        //affichage joueurs sur arbre de tournoi
        let centerPosNames = [[178,205],[623,205]
                                 , [398, 378]];
        let format = "30px Arial";

        if(theGame.players.length === 4){
            centerPosNames = [[99,171],[299,171],[500,171],[700,171],
                                      [199, 308], [600, 308],
                                            [399, 436]];
            format = "20px Arial";
        }

        for (let i = 0; i <= theGame.nbrGames; i++) {


            const poolName = new UiElement(theGame,"text", "poolName"+(i+1), uiLayer, null, [null,centerPosNames[i][1],centerPosNames[i][0]], null, null,
                ["pool2","pool4"], null, null, null, [null, format, null, null], true);

            poolName.refresh = function(){

                const idGame = this.name.substring(this.name.length-1);

                if (idGame == theGame.scores.length + 1) {
                    this.textInfo[2] = "red";
                }
                else{
                    this.textInfo[2] = "white";
                }

                let playerName = "";
                if(idGame <= theGame.players.length){
                    playerName = theGame.players[idGame-1].nickname;
                }
                else {

                    if(theGame.scores.length>0) {
                        compare:{
                            switch (idGame) {
                                case "3":
                                case "5":
                                    if (theGame.scores.length < 2) {
                                        break compare;
                                    }

                                    if (theGame.scores[1] > theGame.scores[0]) {
                                        playerName = theGame.players[1].nickname;
                                    }
                                    else {
                                        playerName = theGame.players[0].nickname;
                                    }

                                    break;
                                case "6":
                                    if (theGame.scores.length >= 4) {

                                        if (theGame.scores[3] > theGame.scores[2]) {
                                            playerName = theGame.players[3].nickname;
                                        }
                                        else {
                                            playerName = theGame.players[2].nickname;
                                        }
                                    }
                                    break;
                                case "7":
                                    if (theGame.scores.length >= 6) {
                                        if (theGame.scores[5] > theGame.scores[4]) {
                                            if (theGame.scores[3] > theGame.scores[2]) {
                                                playerName = theGame.players[3].nickname;
                                            }
                                            else {
                                                playerName = theGame.players[2].nickname;
                                            }
                                        }
                                        else {
                                            if (theGame.scores[1] > theGame.scores[0]) {
                                                playerName = theGame.players[1].nickname;
                                            }
                                            else {
                                                playerName = theGame.players[0].nickname;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    console.log("Error in refresh poolname" + " idGame:" + idGame + " scoreL:" + theGame.scores.length);
                                    break;
                            }
                        }
                    }
                }
                this.textInfo[0] = playerName;
            };

            uiElements.push(poolName);
        }

        //bouton joueur suivant
        const nextPlayer = new UiElement(theGame,"button", "nextPlayer", uiLayer, [250, 550, 520, 580], [250, 520], null,
           null, ["pool2","pool4"], null, "pointer", null, null, true);

        nextPlayer.onClick = function () {
            if(theGame.scores.length < theGame.nbrGames) {
                theGame.currentView = "readyUp";
            }
            else{
                $("body").load("ajax/Home.html");
            }
        };

        nextPlayer.refresh = function(){
            if(theGame.scores.length < theGame.nbrGames) {
                this.src = "mouseReact/nextPlayer.png";
                this.srcHover = "mouseReact/nextPlayerHover.png";
            }
            else{
                this.src = "mouseReact/tournamentEnd.png";
                this.srcHover = "mouseReact/tournamentEndHover.png";
            }
        };
        uiElements.push(nextPlayer);

        const dayCycle = new UiElement(theGame,"image", "dayCycle", uiLayer, null, [0, 0], null, null, ["outside","tripWait","tripResult"], null
            , null, null, null,true);

        dayCycle.refresh = function(){
            switch(theGame.time.hours){
                case 8:
                case 9:
                    this.src = "overlays/night25.png";
                    break;
                case 10:
                case 11:
                    this.src = "overlays/night10.png";
                    break;
                case 12:
                case 13:
                case 14:
                    this.src = null;
                    break;
                case 15:
                    this.src = "overlays/night10.png";
                    break;
                case 16:
                    this.src = "overlays/night25.png";
                    break;
                case 17:
                    this.src = "overlays/night40.png";
                    break;
                case 18:
                    this.src = "overlays/night50.png";
                    break;
                case 19:
                    this.src = "overlays/night65.png";
                    break;

                default:
                    break;
            }
        };
        uiElements.push(dayCycle);

        return uiElements;
    }
}