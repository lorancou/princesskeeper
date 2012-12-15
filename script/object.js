var gamejs = require('gamejs');

exports.block = function(rect, index) {
    
    this.coucou = "coucou2";

    exports.block.superConstructor.apply(this, arguments);

    this.originalImage = gamejs.image.load("../data/block0" + index + ".png");
    var dims = this.originalImage.getSize();

    /*this.originalImage = gamejs.transform.scale(
                                this.originalImage,
                                [dims[0] * (0.5 + Math.random()), dims[1] *  (0.5 + Math.random())]
                        );*/

                        // this.rotation = 50 + parseInt(120*Math.random());
    this.image = this.originalImage;
    this.rect = new gamejs.Rect(rect);
                        
    return this;
};

gamejs.utils.objects.extend(exports.block, gamejs.sprite.Sprite);
