class Trip{

    constructor(theGame, area) {

        this.game = theGame;
        this.area = area;
        this.loots = [];    //food - oil - wood - scrap

        const time = theGame.time;
        let minutesEnd = time.minutes + area.tripTimeMin;

        let hoursEnd = time.hours;

        if (minutesEnd > 59) {
            minutesEnd -= 60;
            hoursEnd++;
        }

        theGame.playSound(area.sound);
        theGame.minZombie +=2;
        this.timeEnd = [hoursEnd, minutesEnd];

    }

    generateLoots() {

        let lootCount = this.game.currentPlayer.bagSize;

        if(Tb.getObjectInArrayFromName(this.game.techs,"backpack").researched)
            lootCount+=5;

        this.loots = this.area.generateLoots(lootCount);
        this.giveLoot(this.loots);
        this.game.currentScore += Math.floor(this.area.tripTimeMin/2);
    }

    giveLoot(loots) {
        for (let i = 0; i < loots.length; i++) {

            if (loots[i] > 0)
                this.game.materials[i].stock = this.game.materials[i].stock + loots[i];
        }
    }
}