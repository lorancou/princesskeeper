var gamejs = require('gamejs');

//------------------------------------------------------------------------------
// the floor
exports.floor = function(position) {
    
    exports.floor.superConstructor.apply(this, arguments);

    this.image = gamejs.image.load("../data/floor.png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
                        
    return this;
};
gamejs.utils.objects.extend(exports.floor, gamejs.sprite.Sprite);

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
