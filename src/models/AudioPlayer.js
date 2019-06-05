class AudioPlayer {

    constructor(params) {
        //The constructor initialit the class AudioPlayer with params
        //By default it creates two arrays: songs and queue, also creates an object of type Audio
        //and the local variable "src" starts with the song "1.mp3"
        this.songs = [];
        this.queue = [];
        this.player = new Audio();
        let src = "songs/1.mp3";

        //Initialit the gui by default -- Prevents the undefined
        this._gui = {
            progressBar: { value: null, DOMElement: null },
            artistName: { value: null, DOMElement: null },
            songName: { value: null, DOMElement: null },
            currentTime: { value: null, DOMElement: null },
            totalTime: { value: null, DOMElement: null },
            albumCover: { value: null, DOMElement: null }
        };

        //Check if params has gui to do the magic
        if (params.hasOwnProperty("gui")) {
            //Validate if the "params" has "gui" and creates an object with the values
            var { progressBar, artistName, songName, currentTime, totalTime, albumCover } = params.gui;
            //sends the object to the private function "_initGUI"
            this._initGUI(progressBar, artistName, songName, currentTime, totalTime, albumCover);
        }

        //Initialit the buttons by default -- Prevents the undefined
        this._buttons = {
            queue: null,
            volume: null,
            back: null,
            playPause: null,
            next: null,
            add: null
        }

        //Loads the song in the player
        this._loadSong(src);

        //Check if params has buttons to do the magic
        if (params.hasOwnProperty("buttons")) {
            var { queue, volume, back, playPause, next, add } = params.buttons;
            this._initButtons(queue, volume, back, playPause, next, add);
        }

    }

    _loadSong(src) {
        this.player.src = src;
        //console.log(_formatTime(src.totalTime));
        this.player.onloadedmetadata = () => {
            this.gui = {
                totalTime: { value: this.player.duration, DOMElement: this.gui.totalTime.DOMElement },
                currentTime: { value: this.player.currentTime, DOMElement: this.gui.currentTime.DOMElement }
            }
        }
        this.player.ontimeupdate = () => {
            //console.log(this.player.currentTime);
            this.gui = {
                currentTime: { value: this.player.currentTime, DOMElement: this.gui.currentTime.DOMElement }
            }
            var [totalTime, currentTime] = [this.gui.totalTime.value, this.gui.currentTime.value];
            var progress = (currentTime / totalTime) * 100;
            let pBar = this.gui.progressBar.DOMElement.querySelector("div");
            pBar.style.width = `${progress}%`;
        }
    }
    _formatTime(seconds) {
        //var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = Math.round(seconds - (hours * 3600) - (minutes * 60));
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return /*hours + ':' + */minutes + ':' + seconds;
    }
    _initGUI(...params) {
        this.gui = {
            progressBar: params[0] || { value: null, DOMElement: null },
            artistName: params[1] || { value: null, DOMElement: null },
            songName: params[2] || { value: null, DOMElement: null },
            currentTime: params[3] || { value: null, DOMElement: null },
            totalTime: params[4] || { value: null, DOMElement: null },
            albumCover: params[5] || { value: null, DOMElement: null }
        };
    }

    _initButtons(...params) {
        this.buttons = {
            queue: params[0] || null,
            volume: params[1] || null,
            back: params[2] || null,
            playPause: params[3] || null,
            next: params[4] || null,
            add: params[5] || null
        };
    }

    _addClickEvent(element, callback) {
        //console.log(element);
        if (element instanceof HTMLElement) {
            element.onclick = callback;
        } else {
            if (element.hasOwnProperty("DOMElement")) {
                element = element.DOMElement;
                if (element instanceof HTMLElement) {
                    element.onclick = callback;
                }
            }
        }
    }

    _toggleIcon(el, aClass, bClass) {
        let i = el.querySelector("i");
        if (i.classList.contains(aClass)) {
            var [a, b] = [aClass, bClass];
        } else {
            var [b, a] = [aClass, bClass];
        }
        i.classList.remove(a);
        i.classList.add(b);
    }

    _assignValues(toAssign, elements, actions = []) {
        const keys = Object.keys(elements);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (elements[key] != null) {
                toAssign[key] = elements[key];
                if (Object.keys(actions).length > 0) {
                    if (actions.hasOwnProperty(key)) {
                        console.log(key);
                        this._addClickEvent(toAssign[key], actions[key]);
                    }
                }
            }
        }
    }

    set buttons(btns) {
        let actions = {
            playPause: () => {
                if (this.player.paused) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
                this._toggleIcon(this.buttons.playPause, "fa-play", "fa-pause");
            },
            queue: () => false,
            volume: () => {
                this.player.volume = (this.player.volume != 0) ? 0 : 1
                this._toggleIcon(this.buttons.volume, "fa-volume-up", "fa-volume-mute");

            },
            back: () => false,
            next: () => false,
            add: () => false,

        }
        this._assignValues(this._buttons, btns, actions);
    }

    get buttons() {
        return this._buttons;
    }

    set gui(elments) {
        let actions = {
            progressBar: (e) => {
                let x = e.offsetX;
                let w = this.gui.progressBar.DOMElement.offsetWidth;
                let newCurrentTime = this.gui.totalTime.value * (x/w);
                this.player.currentTime = newCurrentTime;
                this.gui = {
                    currentTime: {value: newCurrentTime, DOMElement: this.gui.currentTime.DOMElement}
                }
            }
        }
        this._assignValues(this._gui, elments, actions);
        this._updateBasigGUIElement(this.gui.totalTime);
        this._updateBasigGUIElement(this.gui.currentTime);
    }

    _updateBasigGUIElement(el) {
        if (el.DOMElement instanceof HTMLElement) {
            //format time function
            el.DOMElement.innerHTML = this._formatTime(el.value);
        }
    }

    get gui() {
        return this._gui;
    }
}