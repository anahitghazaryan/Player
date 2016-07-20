
var tracks = [
    {
        song: 'sounds/Princess Chelsea - The Cigarette Duet.mp3',
        image: 'sounds/images/the-cigarette-duet.png',
        author: 'Princess Chelsea',
        name: 'The Cigarette Duet'
    },
    {
        song: 'sounds/AZEALIA BANKS - 212 FT. LAZY JAY.mp3',
        image: 'sounds/images/azealia.jpg',
        author: 'AZEALIA BANKS',
        name: '212'
    },
    {
        song: 'sounds/Depeche Mode - Little 15.mp3',
        image: 'sounds/images/little15.jpg',
        author: 'Depeche Mode',
        name: 'Little 15'
    },
    {
        song: 'sounds/Pink Floyd- The Trial.mp3',
        image: 'sounds/images/the-trial.jpg',
        author: 'Pink Floyd',
        name: 'The Trial'
    },
    {
        song: 'sounds/Ibeyi - River.mp3',
        image: 'sounds/images/river.jpg',
        author: 'Ibeyi',
        name: 'River'
    }
];








/**
 * Player Timer
 * @param sec
 * @constructor
 */
var s = {
    currentTime: 0,
    currentSong: 0,
    currentVol: 1,
    stopped: false,
    currentAct: null,
    audio: ''
};

function secToMin(Fsec) {
    var minutes = Math.floor(Fsec / 60),
        seconds = Fsec - minutes * 60;
    if(seconds < 10){seconds = '0' + seconds;}
    if(minutes < 10){minutes = '0' + minutes;}
    return minutes + ':' + seconds;
}


function Timer(sec, fullSec) {
    var curT = null;
    function checker(sec) {
        if(curT == null)
            curT = sec - 1;
        else if(curT == 0) {
            clearInterval(Timer.interval);
            if(!s.stopped) {
                var next = new Player();
                next.setAction('next');
            }
        }
        else
            curT = curT - 1;
        s.currentTime = curT;
        return curT;
    }
    function start() {
        var secs = fullSec - checker(sec);
        document.getElementById("curr").innerHTML  = secToMin(secs);
        document.getElementById("prP").dataset.pp = parseFloat(document.getElementById("prP").dataset.pp) + 370/fullSec;
        document.getElementById("prP").style.width = document.getElementById("prP").dataset.pp + 'px';
        document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp - 6 + 'px';

    }start();
    Timer.interval = setInterval(function () {
        start();
    }, 1000);
}
/**
 * Player Tracker
 * @param act
 * @constructor
 */
function Tracker(act, acts) {
    function play() {
        s.currentAct = 'play';
        s.audio = new Audio(tracks[s.currentSong].song);
        clearInterval(Timer.interval);
        s.audio.addEventListener('loadedmetadata', function() {
            tracks[s.currentSong].time = Math.round(s.audio.duration);
            if(s.currentTime > 0){
                new Timer(s.currentTime, tracks[s.currentSong].time);
                s.audio.currentTime = tracks[s.currentSong].time - s.currentTime;
            }else{
                new Timer(tracks[s.currentSong].time, tracks[s.currentSong].time);
            }
            s.stopped = false;
            s.audio.volume = s.currentVol;
            s.audio.play();
        });
    }
    function next() {
        document.getElementById("prP").dataset.pp = document.getElementById("prP").style.width = 0;
        document.getElementById("play").dataset.status = 1;
        s.currentSong = s.currentSong + 1;
        s.audio.currentTime = s.currentTime = 0;
        s.audio.pause();
        if(s.currentSong >= tracks.length){
            s.currentSong = 0;
            console.log('playlist completed');
        }
        play();
    }
    function prev() {
        document.getElementById("prP").dataset.pp = document.getElementById("prP").style.width = 0;
        document.getElementById("play").dataset.status = 1;
        s.currentSong = s.currentSong - 1;
        s.audio.currentTime = s.currentTime = 0;
        s.audio.pause();
        if(s.currentSong < 0){
            s.currentSong = tracks.length - 1;
        }
        play();
    }
    function pause() {
        s.currentAct = 'pause';
        s.audio.pause();
        s.audio.currentTime = 0;
        clearInterval(Timer.interval);

    }
    function stop() {
        s.currentAct = 'stop';
        clearInterval(Timer.interval);
        s.audio.currentTime = s.currentTime = s.currentSong = 0;
        s.audio.pause();
        s.stopped = true;
    }
    Tracker[act] = function () {
        play();
    };
    Tracker.next = function () {
        next();
    };
    Tracker.stop = function () {
        stop();
    };
    Tracker.pause = function () {
        pause();
    };
    Tracker.prev = function () {
        prev();
    };
    if(acts.length) {
        acts.forEach(function (value) {
            if (act == value) {
                if(act != s.currentAct) {
                    (Tracker[act])();
                }else{
                    console.warn('Action ' + act + ' cannot be repeated');
                }
            }
        })
    }

    if(s.audio != ''){
        s.audio.addEventListener('playing', function() {
            document.getElementById("image").style.backgroundImage = "url('" + tracks[s.currentSong].image + "')";
            document.getElementById("author").innerHTML  = tracks[s.currentSong].author;
            document.getElementById("name").innerHTML  = tracks[s.currentSong].name;
            document.getElementById("full").innerHTML  = secToMin(tracks[s.currentSong].time);
        });
    }
}
/**
 * Player
 * @constructor
 */
function Player(){

    var action = null;
    var actionTypes = ['play', 'pause', 'stop', 'next', 'prev'];

    this.setAction = function (setter) {
        var err = typeof setter == 'string' && setter != '' ? true : (function(){throw new Error("Actions can be only string")})();
        var found = actionTypes.indexOf(setter);
        if(found >= 0){
            action = setter;
            if(s.audio == '' && action != 'play'){
                // console.warn("");
            }else{
                new Tracker(action, actionTypes);
            }
        }else{
            throw new Error(setter + ' action can nat be found');
        }
        return err;
    };

}


/**
 * Events after page loading
 */
window.onload = function () {
    var playB = document.getElementById("play"),
        nextB = document.getElementById("next"),
        prevB = document.getElementById("prev"),
        stopB = document.getElementById("stop"),
        imgS = document.getElementById("image"),
        curS = document.getElementById("curr"),
        fLs = document.getElementById("full"),
        pRp = document.getElementById("prPS"),
        aUt = document.getElementById("author"),
        nAm = document.getElementById("name"),



        cS = document.getElementById('prF'),
        cSR = document.getElementById('prP'),
        tms = document.getElementById('tms'),
        sd = document.getElementById('sd'),
        sK = document.getElementById('sk'),
        stL = false,


        clicking = document.getElementById("volCl"),
        circ = document.getElementById("volClD"),
        blT = document.getElementById("volPCD"),
        fV = document.getElementById("vol"),
        oP = document.getElementById("volP"),
        div = document.getElementById('volClD'),
        time = 0,
        time0 = 0;



    var x = new Player();
    playB.onclick = function(){
        var stat = playB.dataset.status;
        if(parseInt(stat) == 0) {
            playB.dataset.status = 1;
            x.setAction('play');
        }else{
            playB.dataset.status = 0;
            x.setAction('pause');
        }
    };
    nextB.onclick = function(){x.setAction('next')};
    prevB.onclick = function(){x.setAction('prev')};
    stopB.onclick = function(){
        if(s.currentTime != 0) {
            x.setAction('stop');
            imgS.style.backgroundImage = "url('" + tracks[0].image + "')";
            curS.innerHTML = '00:00';
            fLs.innerHTML = secToMin(tracks[0].time);
            pRp.style.width = cSR.style.width = cSR.dataset.pp = playB.dataset.status = 0;
            aUt.innerHTML = tracks[0].author;
            nAm.innerHTML = tracks[0].name;
        }
    };
    cS.onclick = function(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(s.currentTime != 0  && !s.stopped) {
            cSR.dataset.pp = lef;
            cSR.style.width = lef + 'px';
            playB.dataset.status = 1;
            s.currentTime = s.audio.currentTime = Math.round(lef / (370 / tracks[s.currentSong].time));
            clearInterval(Timer.interval);
            new Timer(tracks[s.currentSong].time - s.currentTime, tracks[s.currentSong].time);
        }
    };
    cS.onmousemove = function(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(s.currentTime != 0 && !s.stopped) {
            pRp.style.width = lef + 'px';
            var pop = secToMin(Math.round(lef / (370 / tracks[s.currentSong].time) + 1)),
                node = document.createElement("span"),
                textnode = document.createTextNode(pop),
                popT = document.getElementById("popT");

            node.id = 'popT';
            node.style.left = lef + 'px';
            if(popT)
                popT.parentNode.removeChild(popT);
            node.appendChild(textnode);
            document.getElementById("_r").appendChild(node);
        }
    };
    cS.onmouseout = function () {
        if(s.currentTime != 0 && !s.stopped) {
            pRp.style.width = 0;
            popT.parentNode.removeChild(popT);
        }
    };


    /**
     * Volume events
     * @param e
     */
    clicking.onclick = function(e){
        if(s.currentTime != 0  && !s.stopped) {
            var vol = (100/30 * (30 - e.offsetY))/100;
            var ht = 30 - e.offsetY;
            if(ht >= 0 && ht <= 30 && vol >= 0 && vol <= 1) {
                circ.style.top = e.offsetY;
                blT.style.height = ht;
                s.currentVol = s.audio.volume = vol;
                fV.dataset.speak = 1;
            }
        }
    };
    fV.onmouseover = function () {
        clearTimeout(time);
        time0 = setTimeout(function () {
            oP.style.display = 'block';
            // oP.style.display.color = '#000000';
        },  300)
    };
    fV.onmouseout = function () {
        clearTimeout(time0);
        time = setTimeout(function () {
            oP.style.display = 'none';
        }, 5000)
    };
    fV.onclick = function (e) {
        var sp = parseInt(fV.dataset.speak);
        if(e.target == fV && s.currentTime != 0  && !s.stopped) {
            if (sp == 1) {
                fV.dataset.speak = 0;
                s.audio.volume = 0;
                div.style.top = 30 + 'px';
                blT.style.height = 0;
            } else {
                fV.dataset.speak = 1;
                if(s.currentVol == 0){
                    s.currentVol = 1;
                }
                s.audio.volume = s.currentVol;
                div.style.top = 30 - s.currentVol*30 + 'px';
                blT.style.height = s.currentVol*30;
            }
        }
    };



    clicking.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    function mouseUp()
    {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e){
        window.addEventListener('mousemove', divMove, true);
    }

    function divMove(e){
        if(e.offsetY <= 27 && e.offsetY >= 0 && s.currentTime != 0  && !s.stopped ) {
            if(e.target == clicking) {
                fV.dataset.speak = 1;
                var vol = (100/30 * (30 - e.offsetY))/100;
                if(vol == 0.1){
                    vol = 0;
                    fV.dataset.speak = 0;
                }
                div.style.top = e.offsetY + 'px';
                blT.style.height = 30 - e.offsetY;
                s.currentVol = s.audio.volume = vol;
            }
        }
    }
    document.onclick = function (e) {
        if(e.target != fV && e.target != clicking){
            oP.style.display = 'none';
        }
    };


    /**
     * Slider move
     */
    sK.addEventListener('mousedown', mouseDown2, false);
    window.addEventListener('mouseup', mouseUp2, false);

    function mouseUp2(){
        stL = false;
    }

    function mouseDown2(e){
        if(e.target == cSR || e.target == cS){
            stL = true;
        }
        window.addEventListener('mousemove', divMove2, true);
    }

    function divMove2(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(lef <= 370 && lef >= 0 && s.currentTime != 0  && !s.stopped ) {
            if(stL) {
                // console.log(sK.offsetLeft);
                cSR.dataset.pp = lef;
                cSR.style.width = lef  + 'px';
                playB.dataset.status = 1;
                s.currentTime = s.audio.currentTime = Math.round((lef) / (370 / tracks[s.currentSong].time));
                clearInterval(Timer.interval);
                new Timer(tracks[s.currentSong].time - s.currentTime, tracks[s.currentSong].time);
            }
        }
    }
};