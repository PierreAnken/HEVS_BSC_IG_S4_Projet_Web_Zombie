class Structure{

    constructor(theGame, name, hp, status,onViewSrc,onViewSrcHover, onViewPos, onViewInteract, activeView, toolTip,techNeeded){

        this.game = theGame;
        this.name = name;
        this.hp = hp;
        this.status = status; //destroyed - built - unbuilt
        this.onViewSrc = "structures/"+onViewSrc;
        this.onViewSrcHover = "structures/"+onViewSrcHover;
        this.onViewPos = onViewPos; // [x,y]
        this.onViewInteract = onViewInteract; // [x,x',y,y']
        this.activeView = activeView;
        this.techNeeded = techNeeded;
        this.toolTip = toolTip;
    }

    inflictDamage(dmg){
        this.hp -= dmg;

        if (this.hp <= 0) {
            this.status = "destroyed";
        }

        if(this.name === "bunker"){
           Tb.getObjectInArrayFromName(this.game.techs, "repair").researched = false;
        }
    }

    techOk(){
        if (this.techNeeded != null)
            if (this.techNeeded.length > 0) {
                for (let i = 0; i < this.techNeeded.length; i++) {
                    const tech = Tb.getObjectInArrayFromName(this.game.techs, this.techNeeded[i]);
                    if (!tech.researched)
                        return false;
                }
            }
        return true;
    }
    destroy(){
        this.inflictDamage(this.hp);
    }


    static initStructures(theGame){
        const structures = [];

        structures.push(new Structure(theGame, "bunker", 5000, "built", null, null, [0, 0], null, null, null, null));
        structures.push(new Structure(theGame, "ditch", 5000, "unbuilt", "ditch.png",null,[0,0],null,"outside",null, ["ditch"]));
        structures.push(new Structure(theGame, "fence", 5000, "unbuilt", "fence.png", null, [0, 0], null, "outside", null, ["fence"]));
        structures.push(new Structure(theGame, "watchTower", 5000, "unbuilt", "watchTower.png", null, [0, 0], [462, 490, 187, 237], "outside", null, ["watchTower"]));

        return structures;
    }

}