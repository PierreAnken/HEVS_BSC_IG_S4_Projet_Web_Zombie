class Tech{

    constructor(theGame, name, iconSrc,iconSrcHover,iconActivated, materialCost, tooltipText, onTechTreePos, researched){
        this.game = theGame;
        this.name = name;
        this.materialCost = materialCost;   //food - oil - wood - scrap
        this.onTechTreePos = onTechTreePos; // [x,y]

        if(tooltipText != null)
            this.tooltipText = tooltipText;
        else
            this.tooltipText = [];
        this.iconSrc = "techs/"+iconSrc;
        this.iconSrcHover = "techs/"+iconSrcHover;
        this.iconActivated = "techs/"+iconActivated;
        this.researched = researched;
    }

    static initTech(theGame){
        const techs = [];

        techs.push(new Tech(theGame, "watchTower", "watchTowerTech.png", "watchTowerTechHover.png", "watchTowerTechActivated.png", [0, 0, 15, 10],
            ["Tour de garde", "Indique le nombre de", "zombie de la nuit suivante"], [58, 250], false));

        techs.push(new Tech(theGame, "ditch", "ditchTech.png", "ditchTechHover.png", "ditchTechActivated.png", [15, 0, 10, 10],
            ["Tranchées", "-30% de zombies"], [138, 250], false));

        techs.push(new Tech(theGame, "fence", "fenceTech.png", "fenceTechHover.png", "fenceTechActivated.png", [20, 0, 60, 20],
            ["Barrière", "-50% de zombies"], [218, 250], false));


        techs.push(new Tech(theGame, "backpack", "backpackTech.png", "backpackTechHover.png", "backpackTechActivated.png", [20, 0, 0, 0],
            ["Sac à dos", "+5 ressources en", "exploration"], [58, 375], false));

        techs.push(new Tech(theGame, "lantern", "lantern.jpg", "lanternHover.jpg", "lanternActivated.jpg", [0, 2, 5, 2],
            ["Lanterne", "Vous permet de rentrer de nuit au bunker"], [138, 375], false));


        techs.push(new Tech(theGame, "repair", "repairTech.png", "repairTechHover.png", "repairTechActivated.png", [10, 0, 10, 10],
            ["Réparations", "-1000 dégats au bunker"], [58, 123], true));

        techs.push(new Tech(theGame, "pliers", "pliers.png", "pliersHover.png", "pliersActivated.png", [0, 0, 0, 10],
            ["Tenaille", "Parfait pour couper des fils de fer"], [138, 123], false));


        return techs;
    }

     activate() {

         if (this.name === "repair") {

             const bunker = Tb.getObjectInArrayFromName(this.game.structures, "bunker");

             bunker.hp += 1000;
             if (bunker.hp > 5000)
                 bunker.hp = 5000;

             if (bunker.hp === 5000)
                 this.researched = true;
         }
         else {
            this.game.currentScore += 500;
            this.researched = true;
        }

        for (let j = 0; j < 4; j++)
                this.game.materials[j].stock -= this.materialCost[j]
     }

     canAfford(){
         let canAfford = true;

         for (let j = 0; j < 4; j++)
            if(this.materialCost[j]>this.game.materials[j].stock)
                 canAfford = false;


         return canAfford;
     }

}