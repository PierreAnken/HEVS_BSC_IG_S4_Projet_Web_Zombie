class Sound {

    constructor(name, src, loop) {
        this.name = name;
        this.sound = document.createElement("audio");
        this.sound.src = "sound/" + src;


        if (loop === true)
            this.sound.loop = true;

        this.sound.setAttribute("preload", "none");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
            this.sound.currentTime = "0";
        }
    }

    static init() {
        const sounds = [];
        sounds.push(new Sound("nature", "nature.mp3", true));
        sounds.push(new Sound("chantier", "chantier.mp3", true));
        sounds.push(new Sound("river", "river.mp3", true));
        sounds.push(new Sound("wind", "wind.mp3", true));
        sounds.push(new Sound("oldtime1", "oldtime1.mp3", true));
        sounds.push(new Sound("oldtime2", "oldtime2.mp3", true));
        sounds.push(new Sound("oldtime3", "oldtime3.mp3", true));
        sounds.push(new Sound("desert", "desert.mp3", true));
        sounds.push(new Sound("victory", "victory.mp3", false));
        sounds.push(new Sound("defeat", "defeat.mp3", false));
        return sounds;
    }
}