var gamejs = require('gamejs');
var box2d = require('./Box2dWeb-2.1.a.3');

var BOX2D_SCALE = 30.0;

//------------------------------------------------------------------------------
// the floor
exports.floor = function(position, b2World) {
    
    exports.floor.superConstructor.apply(this, arguments);

    // setup sprite
    this.image = gamejs.image.load("../data/floor.png");
    this.rect = new gamejs.Rect(position);
    
    // setup physics
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_staticBody;
    var center = this.rect.center;
    bodyDef.position.x = (position[0] + this.image.getSize()[0] * 0.5) / BOX2D_SCALE;
    bodyDef.position.y = (position[1] + this.image.getSize()[1] * 0.5) / BOX2D_SCALE;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(this.image.getSize()[0] * 0.5 / BOX2D_SCALE, this.image.getSize()[1] * 0.5 / BOX2D_SCALE);
    b2World.CreateBody(bodyDef).CreateFixture(fixDef);
                        
    return this;
};
gamejs.utils.objects.extend(exports.floor, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// a tower block
exports.block = function(position, index) {
    
    exports.block.superConstructor.apply(this, arguments);

    // setup sprite
    this.originalImage = gamejs.image.load("../data/block0" + index + ".png");
    this.image = this.originalImage;
    this.rect = new gamejs.Rect(position, this.image.getSize());

    this.index = index;
                        
    return this;
};
gamejs.utils.objects.extend(exports.block, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// to physicalize tower blocks
exports.block.prototype.turnOnPhysics = function(b2World) {
    
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    var center = this.rect.center;
    bodyDef.position.x = this.rect.center[0] / BOX2D_SCALE;
    bodyDef.position.y = this.rect.center[1] / BOX2D_SCALE;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(this.rect.width * 0.5 / BOX2D_SCALE, this.rect.height * 0.5 / BOX2D_SCALE);
    
    this.b2Body = b2World.CreateBody(bodyDef);
    this.b2Body.CreateFixture(fixDef);
}

//------------------------------------------------------------------------------
// update tower blocks
exports.block.prototype.update = function(dt) {
    
    //debugger;
    if (this.b2Body) {
        this.image = gamejs.transform.rotate(this.originalImage, gamejs.utils.math.degrees(this.b2Body.GetAngle()));
		this.rect.width = 0.0; this.rect.height = 0.0; // forces gamejs to use the rotated image size
		this.rect.x = (this.b2Body.GetPosition().x * BOX2D_SCALE) - this.image.getSize()[0] * 0.5;
        this.rect.y = (this.b2Body.GetPosition().y * BOX2D_SCALE) - this.image.getSize()[1] * 0.5;
    }
}
