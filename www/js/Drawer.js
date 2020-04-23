class Drawer  {

    constructor(theGame){
        this.game = theGame;
    }

    static drawImageInLayer(layer, imageSrc, posElem) {

        if (imageSrc != null) {
            const image = new Image();
            image.src = "./img/game/" + imageSrc;

            if (posElem == null)
                posElem = [0,0];

            layer.canvas.getContext("2d").drawImage(image,posElem[0],posElem[1]);
        }
    }

    static drawTextInLayer (layer, posElem, textInfo){

        // [text, font, color, fullSize]// [text, font, color, fullSize]
        const ctx = layer.canvas.getContext('2d');

        if (textInfo[1] == null)
            ctx.font = "25px Arial";
        else
            ctx.font = textInfo[1];

        if(textInfo[2] == null)
            ctx.fillStyle = 'black';
        else
           ctx.fillStyle = textInfo[2];

        if(textInfo[0] != null){

            //if we received the center
            let posX = 0;
            if(posElem[0] == null){
                let center = posElem[2];
                const textLength = Math.round(ctx.measureText(textInfo[0]).width);
                posX = center-(textLength/2);
            }
            else {
                posX = posElem[0];
            }

            if (Array.isArray(textInfo[0])) {
                for(let i = 0; i<textInfo[0].length; i++){

                    if (textInfo[3])
                        posX = (800 - Math.round(ctx.measureText(textInfo[0][i]).width)) / 2;

                    ctx.fillText(textInfo[0][i], posX, posElem[1]+(30*i));
                }
            }
            else {
                if (textInfo[3])
                    posX = (800-Math.round(ctx.measureText(textInfo[0]).width))/2;

                ctx.fillText(textInfo[0], posX, posElem[1]);
            }
        }

    }

    displayPopupInLayer (layer, texts){

        if (Array.isArray(texts)) {

            let popupWidth = 0;
            const popupHeight = texts.length*20;
            const ctx = layer.canvas.getContext('2d');

            ctx.font = "14px Arial";
            texts.forEach(function (text) {
                popupWidth = Math.max(popupWidth, Math.round(ctx.measureText(text).width)+10)
            });

            let popupX = this.game.mouse.x-popupWidth/2;
            let popupY = this.game.mouse.y-popupHeight-20;

            if(popupX+popupWidth>this.game.gameWidth-2)
                popupX = this.game.gameWidth-popupWidth-2;

            if(popupX<2)
                popupX = 2;

            if(popupY < 2)
                popupY = this.game.mouse.y+20;

            ctx.fillStyle = "white";
            ctx.fillRect(popupX-2, popupY-2, popupWidth+4, popupHeight+4);
            ctx.fillStyle = "black";
            ctx.fillRect(popupX, popupY, popupWidth, popupHeight);


            ctx.fillStyle = 'white';
            for (let line = 0; line < texts.length; line++) {
                ctx.fillText(texts[line], popupX+5, popupY+15+line*20);
            }
        }

    }

    static clearLayer (aLayer){
        aLayer.canvas.getContext('2d').clearRect(0, 0, aLayer.width, aLayer.height);
    }
}