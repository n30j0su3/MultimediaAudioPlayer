class AudioPlayer {

    constructor(params) {

        //this.songs = [];
        this.queue = [];
        this.player = new Audio();
        let src = "songs/1.mp3";

        this._gui = {
            progressBar: { value: null, DOMElement: null },
            artistName: { value: null, DOMElement: null },
            songName: { value: null, DOMElement: null },
            currentTime: { value: null, DOMElement: null },
            totalTime: { value: null, DOMElement: null },
            albumCover: { value: null, DOMElement: null }
        };

        if (params.hasOwnProperty("gui")) {
            var { progressBar, artistName, songName, currentTime, totalTime, albumCover } = params.gui;
            this._initGUI(progressBar, artistName, songName, currentTime, totalTime, albumCover);
        }

        this._buttons = {
            queue: null,
            volume: null,
            back: null,
            playPause: null,
            next: null,
            add: null
        }
        
        this._loadSong(src);
        
        if (params.hasOwnProperty("buttons")) {
            var { queue, volume, back, playPause, next, add } = params.buttons;
            this._initButtons(queue, volume, back, playPause, next, add);
        }

    }

    _loadSong(src) {
        this.player.src = src;
        this.player.onloadedmetadata = () => {
            this.gui = {
                totalTime: { value: this.player.duration, DOMElement: this.gui.totalTime.DOMElement },
                currentTime: { value: 0, DOMElement: this.gui.currentTime.DOMElement }
            }
        }
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
                if(Object.keys(actions).length > 0){
                    this._addClickEvent(toAssign[key], actions[key]);
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
        this._assignValues(this._buttons,btns,actions);
    }

    get buttons() {
        return this._buttons;
    }

    set gui(elments) {
        this._assignValues(this._gui, elments);
        if(this._gui.totalTime.DOMElement instanceof HTMLElement){
            this._gui.totalTime.DOMElement.innerHTML = this._gui.totalTime.value;
        }
    }

    get gui() {
        return this._gui;
    }
}