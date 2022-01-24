// Parameters
const fontSize = 12;
const spdMult = 0.5;
const fadeSpd = 0.03;
const headColor = '#FFFFFF';
const tailColor = '#00FF00';

var SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight;

canvas_m = document.createElement('canvas');
ctx = canvas_m.getContext('2d');

pos = []; spd = []; time = []; chars = [];

function init() {
ctx.font = fontSize + 'pt Consolas';
for (let i = 0; i < canvas_m.width / fontSize; i++) {
pos[i] = Math.random() * (canvas_m.height / fontSize);
spd[i] = (Math.random() + 0.2) * spdMult;
time[i] = 0; 
chars[i] = ' ';
}
}

function render() {
//console.log('enter render');
animFrame = requestAnimationFrame(render);

    ctx.fontSize = fontSize;
    ctx.fillStyle = tailColor;
    for (let i = 0; i < chars.length; ++i) { // Tails
        ctx.fillText(chars[i], i * fontSize + 1, pos[i] * fontSize); 
    }
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpd})`;
    ctx.fillRect(0, 0, canvas_m.width, canvas_m.height); // Fading

    ctx.fillStyle = headColor;
    for (let x = 0; x < pos.length; ++x){ // Chars
        if (time[x] > 1) {
            let charCode = (Math.random() < 0.9) ? Math.random() * 93 + 33
            : Math.random() * 15 + 12688;
            chars[x] = String.fromCharCode(charCode);
            ctx.fillText(chars[x], x * fontSize + 1, pos[x] * fontSize + fontSize);
            pos[x]++;
            if (pos[x] * fontSize > canvas_m.height) pos[x] = 0;
            time[x] = 0;
        }
        time[x] += spd[x];
    }

    ctx.fillStyle = "#0f0";
    ctx.fillText("Click to escape...", SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
}


messageString = "Wake up, LL... Follow the write rabbit to escape...";
//messageArray = messageString.split(''),
//messageLength = messageArray.length,
pointer = 0,
typeTick = 0,
typeTickMax = 7,
typeResetTick = 0,
typeResetMax = 140;

var updateTypeTick = function(messageLength){
    if(pointer < messageLength){
        if(typeTick < typeTickMax){
            typeTick++;
        } else {
            typeTick = 0;
            pointer++;
        }
    } else {
        if(typeResetTick < typeResetMax){
            typeResetTick++;
        } else {
            typeResetTick = 0;
            typeTick = 0;
            pointer = 0;
        }
    }
}

var renderMessage = function(messageString){
var messageArray = messageString.split('');
var text = messageArray.slice(0, pointer);
ctx.shadowBlur = 10;
ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
var x = 200,
y = 200;

if( Math.random() < 0.05 ) {
    ctx.fillStyle = 'hsla(120, 30%, 50%, ' + ( 0.25 + Math.random() * 0.5 ) + ')';
}
if( Math.random() < 0.05 ) {
    x += -3 + Math.random() * 6;
}
if( Math.random() < 0.05 ) {
    y += -3 + Math.random() * 6;
}
if( Math.random() < 0.1 ) {
    ctx.shadowBlur = Math.random() * 15;
}
if( Math.random() < 0.99 ) {
    ctx.fillText( text.join( '' ), Math.round( x ), Math.round( y ) );
}
    ctx.shadowBlur = 0;
}

var renderLines = function(){
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    for(var i = 0; i < canvas_m.height/2; i += 1){ 
        ctx.moveTo(0, (i*2) + .5);
        ctx.lineTo(canvas_m.width, (i*2) + .5); 
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
}


function wakeup() {

    ctx.font = 'normal 20px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowColor = '#3f3';

    requestAnimationFrame( wakeup );
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect( 0, 0, canvas_m.width, canvas_m.height );
    ctx.globalCompositeOperation = 'lighter';

    var messageArray = messageString.split('');
    updateTypeTick(messageArray.length);
    renderMessage(messageString, 0);
    renderLines();
}

//window.onload = function() {
function runMatrix() {
    document.body.appendChild(canvas_m);
    canvas_m.width = SCREEN_WIDTH;
    canvas_m.height = SCREEN_HEIGHT;

    window.onresize = () => {
    canvas_m.width = window.innerWidth;
    canvas_m.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas_m.width, canvas_m.height);
    init();
    };
    window.addEventListener('click', () => {
        cancelAnimationFrame(animFrame);
        ctx.clearRect(0, 0, canvas_m.width, canvas_m.height);
        wakeup();
    });

    init();
    render();
};
