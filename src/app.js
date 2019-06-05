let ap = null;

function start(){
    //Initialit an object named ap who is type AudioPlayer with the properties "gui" & "buttons"
    ap = new AudioPlayer({
        //ap sends to the constructor the properties gui & buttons
        //To initialit gui sends 3 objects with the initial value and the DOM element
        gui:{
            totalTime: {value: "0:00", DOMElement: document.querySelector(".totalTime")},
            currentTime: {value: "0:00", DOMElement: document.querySelector(".currentTime")},
            progressBar: {value: "0:00", DOMElement: document.querySelector(".progressBar")},
        },
        //To initialit buttons sends 2 objects with the DOM element
        buttons:{
            playPause: document.querySelector(".play"),
            volume: document.querySelector(".volume")
        }
    });
}