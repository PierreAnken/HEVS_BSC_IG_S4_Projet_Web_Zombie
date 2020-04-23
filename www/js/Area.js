class Area{

    constructor(name, tripSrc, srcHover, eventPos, elemPos, namefr, tripTimeMin, materialsFactor, areaInfo, sound) {
        this.name = name;
        this.srcHover = "mouseReact/"+srcHover;
        this.elemPos = elemPos;
        this.eventPos = eventPos;
        this.namefr = namefr;
        this.tripTimeMin = tripTimeMin;
        this.materialsFactor = materialsFactor; //food - oil - wood - scrap
        this.tripSrc = tripSrc;
        this.areaInfo = areaInfo;
        this.visited = false;
        this.sound = sound;
    }

    static initAreas(){

        const areas = [];

        areas.push(new Area("forest", "forestTrip.jpg", "forestHover.png",
            [0, 237, 430, 600], [0, 0], "Forêt de la Sarine", 35, [27, 0, 73, 0], null, "nature"));

        areas.push(new Area("recyclingPlant", "recyclingPlantTrip.jpg", "recyclingPlantHover.png",
            [514, 800, 0, 152], [0, 0], "Décharge d'Estructural", 45, [0, 16, 23, 61], null, "chantier"));

        areas.push(new Area("town", "townTrip.jpg", "townHover.png",
            [0, 224, 0, 175], [0, 0], "Wangen sur l'Aar", 60, [56, 16, 13, 15], null, "river"));

        areas.push(new Area("airport", "airportTrip.jpg", "airportHoverA.png",
            [567, 800, 410, 600], [0, 0], "Aérodrome de Sion", 50, null,
            [
            "Une fois la clôture découpée j'ai pu accéder à l'avion.",
            "En remplissant le réservoir de pétrole et en réparant l’aile",
            "il ferait un parfait moyen d’échapper aux zombies …",
            " ",
            "Ressources nécessaires: ferraille 60, pétrole 30"
            ], "wind"
        ));

        return areas;
    }

    generateLoots(bagSize) {

        let lootToGive = bagSize;
        const lootGiven = [0, 0, 0, 0]; //food - oil - wood - scrap
        do {
            //on tire au hasard une ressource sur les 4
            const materialSlot = Math.floor((Math.random() * 4));

            //si il est possible de la donner
            if (this.materialsFactor[materialSlot] > 0) {

                //on regarde si le jet de butin est suffisant
                const dice = Math.floor((Math.random() * 100));
                if (dice <= this.materialsFactor[materialSlot]) {
                    lootGiven[materialSlot] = lootGiven[materialSlot] + 1;
                    lootToGive--;
                }
            }

        } while (lootToGive > 0);

        return lootGiven;
    }
}


