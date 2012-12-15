var gamejs = require('gamejs');
var box2d = require('Box2dWeb-2.1.a.3.min');
var object = require('object');

var data = [
    
    "../data/block01.png",
    "../data/block02.png",
];

gamejs.preload(data);
gamejs.ready(main);

var gBlocks = new gamejs.sprite.Group();
    
function main() {

    gamejs.display.setMode([1024, 768]);

    gBlocks = new gamejs.sprite.Group();
    for (var j=0;j<4;j++) {
        for (var i=0; i<4; i++) {
            gBlocks.add(new object.block([32 + i*64, 32 + j * 64]));
        }
    }
    
    gamejs.time.fpsCallback(update, this, 60);
}

function update(msDuration) {
    
    var mainSurface = gamejs.display.getSurface();
    
    gBlocks.draw(mainSurface);
    
    //console.log("update");
    
    return;
}