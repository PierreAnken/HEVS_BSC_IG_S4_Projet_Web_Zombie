class Layer {

    constructor(theGame, name, width, height, zIndex, backgroundColor) {

        this.game = theGame;
        this.needRefresh = true;
        this.canvas = window.document.createElement("canvas");

        this.canvas.id = name;
        this.name = name;

        if (backgroundColor !== undefined)
            this.canvas.style.background = backgroundColor;

        this.zIndex = zIndex;
        this.canvas.style.zIndex = this.zIndex;

        this.width = Math.round(width);
        this.canvas.width = this.width;

        this.height = Math.round(height);
        this.canvas.height = this.height;

        this.canvas.style.position = "absolute";

        theGame.divGameScreen.appendChild(this.canvas);

        this.context2D = this.canvas.getContext('2d');

    }

    centerLayerOnScreen() {
        const canvas = document.getElementById(this.name);
        if(canvas !== null) {
            canvas.style.left = ((window.innerWidth - this.game.gameWidth) / 2) + "px";
            canvas.style.top = ((window.innerHeight - this.game.gameHeight) / 2) + "px";
        }
    }

    static initLayers(theGame){
        const layers = [];

        //monde
        const groundLayer = new Layer(theGame, "groundLayer", theGame.gameWidth, theGame.gameHeight, null, 1);
        groundLayer.drawLayer = function () {

            let groundImg = null;

            switch (theGame.currentView) {
                case "inside":
                    groundImg = "bunkerInside.jpg";
                    break;

                case "outside":
                    if(this.game.airportFenceCut) {
                        groundImg = "outsideB.jpg";
                    }
                    else {
                        groundImg = "outsideA.jpg";
                    }

                    break;

                case "dayResume" :
                    groundImg = "dayResume.png";
                    break;

                case "gameResume":
                    groundImg = "gameResume.jpg";
                    break;

                case "gameOver" :
                    groundImg = "gameOver.jpg";
                    break;

                case "tripWait" :
                case "tripResult" :
                    groundImg = theGame.currentTrip.area.tripSrc;
                    break;

                case "workshop" :
                    groundImg = "workshop.png";
                    break;

                case "pool2" :
                    groundImg = "pool2.png";
                    break;

                case "pool4" :
                    groundImg = "pool4.png";
                    break;

                case "readyUp" :
                    groundImg = "readyUp.png";
                    break;

                case "victory" :
                    groundImg = "victory.jpg";
                    break;
                default:
                    break;
            }


            Drawer.clearLayer(groundLayer);
            Drawer.drawImageInLayer(groundLayer, "/views/" + groundImg);

        };
        layers.push(groundLayer);

        //interface utilisateur
        const uiLayer = new Layer(theGame, "uiLayer", theGame.gameWidth, theGame.gameHeight, null, 5);
        uiLayer.drawLayer = function () {
            let pointerStyle = null;
            let popupElement = null;

            theGame.uiElements.forEach(function (uiElement){


                if(uiElement.isOnThisView(theGame)) {

                    const hover = theGame.mouse.isHover(uiElement);

                    if (hover)
                        pointerStyle = uiElement.pointerStyle;

                    let srcToDraw = null;
                    let textToDraw = null;

                    switch(uiElement.type){
                        case "button":
                            if (hover && uiElement.srcHover != null)
                                srcToDraw = uiElement.srcHover;
                            else
                                srcToDraw = uiElement.src;
                            break;
                        case "text":

                            textToDraw = uiElement.textInfo[0];
                            break;
                        case "image":
                            srcToDraw = uiElement.src;
                            break;
                        default:
                            break;
                    }

                    if(srcToDraw != null){
                        Drawer.drawImageInLayer(uiElement.parentLayer, srcToDraw, uiElement.elemPos);}

                    if(textToDraw != null){

                        Drawer.drawTextInLayer(uiElement.parentLayer, uiElement.elemPos, uiElement.textInfo);
                    }

                    if(uiElement.popupText != null && hover)
                        popupElement = uiElement;
                }
            });

            if(popupElement != null)
                theGame.drawer.displayPopupInLayer(popupElement.parentLayer, popupElement.popupText,popupElement.posX,popupElement.posY,popupElement.width);


            Mouse.setPointer(pointerStyle);
            uiLayer.needRefresh = true;
        };
       layers.push(uiLayer);

        return layers;
    }
}