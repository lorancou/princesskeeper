var gamejs = require('gamejs');
var box2d = require('./Box2dWeb-2.1.a.3');

//------------------------------------------------------------------------------
// the floor
exports.floor = function(position, b2World) {
    
    exports.floor.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load("../data/floor.png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
    
    // setup physics
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_staticBody;
    var center = this.rect.center;
    bodyDef.position.x = this.rect.center[0];
    bodyDef.position.y = this.rect.center[1];
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(this.rect.width/2, this.rect.height/2);
    b2World.CreateBody(bodyDef).CreateFixture(fixDef);
                        
    return this;
};
gamejs.utils.objects.extend(exports.floor, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// a tower block
exports.block = function(position, index, b2World) {
    
    exports.block.superConstructor.apply(this, arguments);

    this.image = gamejs.image.load("../data/block0" + index + ".png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
    this.index = index;
                        
    return this;
};
gamejs.utils.objects.extend(exports.block, gamejs.sprite.Sprite);
