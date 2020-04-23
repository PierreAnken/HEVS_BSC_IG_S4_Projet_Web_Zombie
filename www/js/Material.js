class Material {

    constructor (id, name, stock, src) {
        this.id = id;
        this.src = "materials/"+src;
        this.name = name;
        this.stock = stock;
    }

    static initMaterial(){

        const materials = [];

        materials.push(new Material("food","Nourriture", 5, "food.png"));
        materials.push(new Material("oil","Pétrole", 0, "oil.png"));
        materials.push(new Material("wood","Bois", 0, "wood.png"));
        materials.push(new Material("scrap","Ferraille", 0, "iron.png"));

        return materials;
    }


    static getMaterialById (theGame, materialId){

        let material = null;
        if(materialId !== undefined && materialId !== "") {
            theGame.materials.forEach(function (materialSeek) {
                if (materialSeek.id === materialId) {
                    material = materialSeek;
                }
            });
        }
        return material;
    }

}