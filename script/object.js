var gamejs = require('gamejs');

//------------------------------------------------------------------------------
// a tower block
exports.block = function(position, index) {
    
    exports.block.superConstructor.apply(this, arguments);

    this.image = gamejs.image.load("../data/block0" + index + ".png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
    this.index = index;
                        
    return this;
};
gamejs.utils.objects.extend(exports.block, gamejs.sprite.Sprite);
