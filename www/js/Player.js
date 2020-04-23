class Player{

    constructor(theGame, nickname, avatar,bagSize){
        this.nickname = nickname;
        this.avatar = "avatars/"+avatar;
        this.bagSize = bagSize;
    }

    static initPlayer(theGame){
        const players = [];

        for (let i = 0; i < sessionStorage.getItem("playerCount"); i++) {
            let avatar = "avatar" + (i+1) + ".png";
            if(sessionStorage.getItem("avatarsImg") != null)
                avatar = JSON.parse((sessionStorage.getItem("avatarsImg")))[i];
            const nickname = JSON.parse((sessionStorage.getItem("nickNames")))[i];

            let bagSize = 5;
            if(nickname === "TestZ"){
                console.log("Mode débug activé");
                bagSize = 500;
                theGame.time.timeIncrement = 2;
            }

           players.push(new Player(theGame, nickname,avatar, bagSize));
        }

        return players;
    }
}