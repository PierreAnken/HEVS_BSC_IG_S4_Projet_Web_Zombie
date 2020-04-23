class Time{

    constructor(theGame){
        this.game = theGame;
        this.day = 1;
        this.hours = 8;
        this.minutes = 0;
        this.timer = null;
        this.isStarted = false;
        this.startDayHour = 8;
        this.endDayHour = 20;
        this.timeIncrement = 1;

    }

    reset(){
        this.day = 1;
        this.hours = 8;
        this.minutes = 0;
    }

    start(){
        if(!this.isStarted){
            this.timer = setInterval(Time.updateTime, 1000/6,this);
            this.isStarted = true;
        }
    }

    stop(){
        clearTimeout(this.timer);
        this.isStarted = false;
    }

    minutsDiff(timeControl) {

        const minutesTime = 60 * this.hours + this.minutes;
        const minutesTimeControle = 60 * timeControl[0] + timeControl[1];

        return minutesTimeControle - minutesTime;
    }

    static updateTime(time){
        //each 1/6 second we add 1 minuts => 12h in game  = 2 minuts in life
        time.minutes += time.timeIncrement;

        if(time.minutes > 59){
            time.minutes = time.minutes-60;
            time.hours++;
        }

        if(time.hours === time.endDayHour) {
            time.stop();


            time.game.generateZombieDmg();

            time.game.checkEndDay();
        }
    }

    nextDay(){

        this.game.currentScore += 100;
        this.minutes = 0;
        this.hours = this.startDayHour;
        this.day++;
        this.start();
        this.game.currentView = "inside";
        this.game.generateZombie();
    }


    getTextTimeLeft(){

        //hours left
        const hours = this.hours;

        let hoursLeft = this.endDayHour-hours;
        let minutsLeft = 60-this.minutes;

        if(minutsLeft === 60)
            minutsLeft = 0;

        if(minutsLeft > 0)
            hoursLeft--;

        let hourText = hoursLeft;
        if(hoursLeft<10)
            hourText = "0"+ hoursLeft;

        let minutsText = minutsLeft;
        if(minutsLeft<10)
            minutsText = "0"+ minutsLeft;

        return hourText+"h "+minutsText+"m";
    }

}

