var gamejs = require('gamejs');
var global = require('global');

//------------------------------------------------------------------------------
// title
exports.title = function() {
    
    exports.title.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load(global.DATA_PATH + "title.png");
    this.rect = new gamejs.Rect([256, 0]);

    return this;
};
gamejs.utils.objects.extend(exports.title, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// vertical bar
exports.vbar = function(x) {
    
    exports.vbar.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load(global.DATA_PATH + "vbar.png");
    this.rect = new gamejs.Rect([x, 270]);

    return this;
};
gamejs.utils.objects.extend(exports.vbar, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// message
exports.msg = function(name, position) {
    
    exports.msg.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load(global.DATA_PATH + "msg_" + name + ".png");
    this.rect = new gamejs.Rect(position);
	
	this.name = name;

    return this;
};
gamejs.utils.objects.extend(exports.msg, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// timer
exports.timer = function() {
    
    exports.timer.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load(global.DATA_PATH + "timer.png");
    this.rect = new gamejs.Rect([960, 40]);
	
    return this;
};
gamejs.utils.objects.extend(exports.timer, gamejs.sprite.Sprite);
