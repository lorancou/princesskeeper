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

var NUM_BLOCK_KINDS = 4;
var gBlockStore = new gamejs.sprite.Group();
    
function main() {

    gamejs.display.setMode([1024, 768]);

    gBlockStore = new gamejs.sprite.Group();
    for (var i=0; i<NUM_BLOCK_KINDS; i++) {
        gBlockStore.add(new object.block([32 + i*64, 32], i));
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
            gBlockStore.forEach(function(block) {
                if (block.rect.collidePoint(event.pos))
                {
                    console.log(block.index);
                }
            });
        }
    });
}

function draw() {
    
    var mainSurface = gamejs.display.getSurface();
    gBlockStore.draw(mainSurface);
}