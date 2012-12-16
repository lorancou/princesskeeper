var gamejs = require('gamejs');

//------------------------------------------------------------------------------
// title
exports.title = function() {
    
    exports.title.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load("../data/title.png");
    this.rect = new gamejs.Rect([256, 0]);

    return this;
};
gamejs.utils.objects.extend(exports.title, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// vertical bar
exports.vbar = function(x) {
    
    exports.vbar.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load("../data/vbar.png");
    this.rect = new gamejs.Rect([x, 270]);

    return this;
};
gamejs.utils.objects.extend(exports.vbar, gamejs.sprite.Sprite);
