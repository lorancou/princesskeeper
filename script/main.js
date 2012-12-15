var gamejs = require('gamejs');
var box2d = require('Box2dWeb-2.1.a.3.min');
var object = require('object');

var data = [
    
    "./data/block01.png",
    "./data/block02.png",
];

gamejs.preload(data);
gamejs.ready(main);

function main() {

    var display = gamejs.display.setMode([1024, 768]);
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render('TODO: a game')
    );

    gamejs.time.fpsCallback(update, this, 60);
    
    var myBlock = new object.block();
    console.log(myBlock.coucou);
}

function update(msDuration) {
    
    //console.log("update");
    
    return;
}
