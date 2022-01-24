canvas = document.createElement('canvas');

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded () {
  canvasApp(); //包含整个Canvas应用程序
}
function canvasSupport (e) {
  
	  return !!e.getContext;

}
function canvasApp () {
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

  if (!canvasSupport(canvas)) {
	  return; 
	}
  
  var ctx = canvas.getContext('2d');
  var w = canvas.width = window.innerWidth;
	var h = canvas.height = window.innerHeight;
	var yPositions = Array(300).join(0).split('');
  
  function runMatrix() {
	  if (typeof Game_Interval != 'undefined') clearInterval(Game_interval);
		Game_Interval = setInterval(drawMatrixScreen, 33);
	}

  function drawMatrixScreen () {
    ctx.fillStyle = 'rgba(0,0,0,.05)';
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = '#0f0';
		ctx.font = '10px Georgia';
		yPositions.map(function(y, index){
		  text = String.fromCharCode(1e2 + Math.random() * 33);
			x = (index * 10) + 10;
			ctx.fillText(text, x, y);
			if (y > 100 + Math.random() * 1e4) {
			  yPositions[index] = 0;
			} else {
			  yPositions[index] = y + 10;
			}
		})
  }
  
  runMatrix();
 
}