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
