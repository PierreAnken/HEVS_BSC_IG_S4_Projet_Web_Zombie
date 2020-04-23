class Game {

    constructor() {

        this.divGameScreen = document.getElementById("gameScreen");
        this.gameWidth = 800;
        this.gameHeight = 600;
        this.soundOn = false;

        this.time = new Time(this);
        this.players = Player.initPlayer(this);
        this.currentPlayer = this.players[0];
        this.currentGame = 1;
        this.nbrGames = 1;
        this.playersGames = [];
        this.scores = [];

        this.drawer = new Drawer(this);
        this.sounds = Sound.init();
        this.mouse = new Mouse(this);
        this.areas = Area.initAreas();
        this.layers = Layer.initLayers(this);


    }

    playSound(name) {

        if (name === "oldtime") {
            name += Math.floor(Math.random() * 3 + 1);
        }

        const game = this;

        this.sounds.forEach(function (aSound) {
            if (aSound.name === name) {
                if (game.soundOn) {
                    aSound.play();
                }
            }
            else {
                aSound.stop();
            }
        });
    }

    endGame(){

        this.playSound("");

        if(this.players.length === 1) {
            this.saveSoloScore();
        }
        else{
            this.scores.push( this.currentScore);
            if(this.currentGame < this.nbrGames){
                this.nextGame();
            }
            else{
                if(this.players.length === 2){
                    this.currentView = "pool2";
                }
                else{
                    this.currentView = "pool4";
                }
            }
        }
    }

    nextGame(){

        this.currentGame++;

        if(this.currentGame <= this.players.length){
            this.currentPlayer = this.players[this.currentGame-1];
        }
        else{
            switch(this.currentGame){
                case 5:
                    if(this.scores[1]>this.scores[0]){
                        this.currentPlayer = this.players[1];
                    }
                    else{
                        this.currentPlayer = this.players[0];
                    }
                    break;
                case 6:
                    if(this.scores[3]>this.scores[2]){
                        this.currentPlayer = this.players[3];
                    }
                    else{
                        this.currentPlayer = this.players[2];
                    }
                    break;

                default:
                    console.log("Error in next player selection");
                    break;
            }
        }

        this.init();
    }

    init(){

        this.currentTrip = null;
        this.gameOverReason = null;
        this.currentScore = 0;

        if(this.players.length === 1){
            this.currentView = "inside";
            this.time.start();
            this.nbrGames = 1;
            this.playSound("oldtime2");
        }
        else if(this.players.length === 2){
            this.currentView = "pool2";
            this.nbrGames = 2;
        }
        else{
            this.currentView = "pool4";
            this.nbrGames = 6;
        }

        this.playersGames.push(this.currentPlayer);

        this.time.reset();
        this.techs = Tech.initTech(this);

        this.materials = Material.initMaterial();

        this.structures = Structure.initStructures(this);
        this.uiElements = UiElement.initUiElements(this);

        this.airportFenceCut = false;

        this.zombieNextNight = Math.floor(Math.random() * (150) + 100);
        this.zombieReduction = 0;
        this.minZombie = 50;
        this.zombieDmg = 3;
        this.nightDmg = 0;
    }

    saveSoloScore(){

        if (this.players[0].nickname === "TestZ") {
            $("body").load("ajax/Score.php");
        }
        else {
            $.post( "ajax/saveScore.php", { sNickname: this.currentPlayer.nickname,
                sScore: this.currentScore,sGeo:sessionStorage.getItem("userCountry")}).always(function() {
                $("body").load("ajax/Score.php");
            });
        }

    }


    checkEndDay() {

        if (Tb.getObjectInArrayFromName(this.structures, "bunker").status === "destroyed")
            this.gameOver(["Votre bunker a été détruit pendant la nuit et", "les zombies se sont régalés de vos cervelles."]);
        else if (this.time.day === 7)
            this.gameOver(["Vous n'avez pas réussi à quitter le continent à temps", "l'épidemie a atteint votre bunker..."]);
        else if ((this.time.game.currentView !== "inside" && this.time.game.currentView !== "workshop") && !Tb.getObjectInArrayFromName(this.techs, "lantern").researched) {
            this.gameOver("Rester dehors la nuit est une erreur... mortelle");
        }
        else{
            this.currentScore += Math.floor(this.zombieDmg/100);
            this.currentView = "dayResume";
        }
    }

    generateZombieDmg() {

        let reduction = 0;

        if (Tb.getObjectInArrayFromName(this.techs, "fence").researched)
            reduction += 50;
        if (Tb.getObjectInArrayFromName(this.techs, "ditch").researched)
            reduction += 30;

        this.zombieReduction = Math.floor(this.zombieNextNight * reduction / 100);
        this.nightDmg = this.zombieDmg * (this.zombieNextNight - this.zombieReduction);

        //inflict damage to structures
        Tb.getObjectInArrayFromName(this.structures, "bunker").inflictDamage(this.nightDmg);
    }

    generateZombie() {
        //plus le temps avance plus le nombre de zombie max est important
        this.zombieNextNight = Math.floor(Math.random() * (600 + this.time.day*50) + this.time.day*this.minZombie);
    };

    refreshUiElement(){
        for(let i = 0; i< this.uiElements.length ; i++)
            if (this.uiElements[i].isOnThisView() || this.uiElements[i].forceRefresh)
                this.uiElements[i].refresh();
    }

    refrehLayers(){
        this.layers.forEach(function (aLayer) {
            aLayer.centerLayerOnScreen();

            if (aLayer.needRefresh) {
                Drawer.clearLayer(aLayer);
                aLayer.needRefresh = false;
            }
            aLayer.drawLayer();
        });
    }

    gameOver(reason){
        this.time.stop();

        this.playSound("defeat");
        this.gameOverReason = reason;
        Tb.getObjectInArrayFromName(this.uiElements, "gameOverReason").textInfo[0] = reason;
        this.currentView = "gameOver";
    }
}



