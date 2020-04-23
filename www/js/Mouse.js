
class Mouse {

    constructor(theGame){
        this.game = theGame;
    }

    onMouseMove(x,y){
        this.x = Math.ceil(x);
        this.y = Math.ceil(y);
        //document.getElementById("debug").innerHTML = "Mouse position: "+this.x+" "+this.y;
    }

    onMouseClick(){

        for (let i = 0; i < this.game.uiElements.length; i++) {
            const uiElement = this.game.uiElements[i];
            if (this.isHover(uiElement) && uiElement.isOnThisView()) {
                uiElement.onClick();
                break; //to avoid other layer element to respond
            }
        }
    }


    isHover(uiElement){

        if(uiElement.eventPos != null && uiElement.isOnThisView())
            if(this.x >= uiElement.eventPos[0] && this.x <= uiElement.eventPos[1] && this.y >= uiElement.eventPos[2] && this.y <= uiElement.eventPos[3])
                return true;

        return false;
    }

    static setPointer(style){
        if(style == null)
            style = "default";

        if( document.getElementById("uiLayer") != null)
            document.getElementById("uiLayer").style.cursor = style;
    }
}

Mouse.x = '';
Mouse.y = '';

