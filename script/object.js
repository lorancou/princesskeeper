var gamejs = require('gamejs');

exports.block = function(position, index) {
    
    exports.block.superConstructor.apply(this, arguments);

    /*this.originalImage = gamejs.transform.scale(
                                this.originalImage,
                                [dims[0] * (0.5 + Math.random()), dims[1] *  (0.5 + Math.random())]
                        );*/

                        // this.rotation = 50 + parseInt(120*Math.random());
    this.image = gamejs.image.load("../data/block0" + index + ".png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
    this.index = index;
                        
    return this;
};

gamejs.utils.objects.extend(exports.block, gamejs.sprite.Sprite);
