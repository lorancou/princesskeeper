var gamejs = require('gamejs');
var box2d = require('Box2dWeb-2.1.a.3.min');
	
// gamejs.preload([]);

gamejs.ready(function() {

    var display = gamejs.display.setMode([600, 400]);
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render('Hello World')
    );

    /**
    function tick(msDuration) {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 60);
    **/
});
