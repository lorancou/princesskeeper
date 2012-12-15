var gamejs = require('gamejs');
var box2d = require('Box2dWeb-2.1.a.3.min');
var object = require('object');

var data = [
    
    "../data/block00.png",
    "../data/block01.png",
    "../data/block02.png",
    "../data/block03.png",
];

gamejs.preload(data);
gamejs.ready(main);

var gBlocks = new gamejs.sprite.Group();
    
function main() {

    gamejs.display.setMode([1024, 768]);

    gBlocks = new gamejs.sprite.Group();
    for (var i=0; i<4; i++) {
        gBlocks.add(new object.block([32 + i*64, 32], i));
    }
    
    gamejs.time.fpsCallback(update, this, 60);
}

function update(msDuration) {
    
    input();
    draw();
    
    //console.log("update");
    
    return;
}

function input() {
    
    // handle key / mouse events
    gamejs.event.get().forEach(function(event) {
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_UP) {
                console.log("up pressed");
            };
        } else if (event.type === gamejs.event.MOUSE_MOTION) {
            // if mouse is over display surface
            /*if (displayRect.collidePoint(event.pos)) {
            // add sparkle at mouse position
            sparkles.push({
            left: event.pos[0],
            top: event.pos[1],
            alpha: Math.random(),
            deltaX: 30 - Math.random() * 60,
            deltaY: 80 + Math.random() * 40,
            });
            }*/
        }
    });
}

function draw() {
    
    var mainSurface = gamejs.display.getSurface();
    gBlocks.draw(mainSurface);
}