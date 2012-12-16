var gamejs = require('gamejs');
var box2d = require('./Box2dWeb-2.1.a.3');
var global = require('global');

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
    bodyDef.position.x = (position[0] + this.image.getSize()[0] * 0.5) / global.BOX2D_SCALE;
    bodyDef.position.y = (position[1] + this.image.getSize()[1] * 0.5) / global.BOX2D_SCALE;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(this.image.getSize()[0] * 0.5 / global.BOX2D_SCALE, this.image.getSize()[1] * 0.5 / global.BOX2D_SCALE);
    
	this.b2Body = b2World.CreateBody(bodyDef);
	this.b2Body.CreateFixture(fixDef);
	
	// store ref for contact callback
	this.b2Body.SetUserData(this);
	this.kind = "floor";
                        
    return this;
};
gamejs.utils.objects.extend(exports.floor, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// a tower block
exports.block = function(position, index) {
    
    exports.block.superConstructor.apply(this, arguments);

    // setup sprite
	if (index == "princess") {
		this.originalImage = gamejs.image.load("../data/princess.png");
	} else {
		this.originalImage = gamejs.image.load("../data/block0" + index + ".png");
	}
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
    bodyDef.position.x = this.rect.center[0] / global.BOX2D_SCALE;
    bodyDef.position.y = this.rect.center[1] / global.BOX2D_SCALE;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(this.rect.width * 0.5 / global.BOX2D_SCALE, this.rect.height * 0.5 / global.BOX2D_SCALE);
    
    this.b2Body = b2World.CreateBody(bodyDef);
    this.b2Body.CreateFixture(fixDef);
	
	// store ref for contact callback
	this.b2Body.SetUserData(this);
	if (this.index == "princess") {
		this.kind = "princess";
	} else {
		this.kind = "block";
	}			
}

//------------------------------------------------------------------------------
// update tower blocks
exports.block.prototype.update = function(dt) {
    
	// no need to grab position from body if not physicalized yet
    if (!this.b2Body) {
		return;
    }
	
	this.image = gamejs.transform.rotate(this.originalImage, gamejs.utils.math.degrees(this.b2Body.GetAngle()));
	this.rect.width = 0.0; this.rect.height = 0.0; // forces gamejs to use the rotated image size
	this.rect.x = (this.b2Body.GetPosition().x * global.BOX2D_SCALE) - this.image.getSize()[0] * 0.5;
	this.rect.y = (this.b2Body.GetPosition().y * global.BOX2D_SCALE) - this.image.getSize()[1] * 0.5;	
}

//------------------------------------------------------------------------------
// a knight
exports.knight = function(position, index, b2World, isLeft) {
    
    exports.knight.superConstructor.apply(this, arguments);

    // setup sprite
	this.originalImage = gamejs.image.load("../data/knight0" + index + ".png");
    this.image = this.originalImage;
    this.rect = new gamejs.Rect(position, this.image.getSize());

    this.index = index;
	
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    bodyDef.position.x = this.rect.center[0] / global.BOX2D_SCALE;
    bodyDef.position.y = this.rect.center[1] / global.BOX2D_SCALE;
    fixDef.shape = new box2d.b2CircleShape(0.6);
    
    this.b2Body = b2World.CreateBody(bodyDef);
    this.b2Body.CreateFixture(fixDef);
	
	// store ref for contact callback
	this.b2Body.SetUserData(this);
	this.kind = "knight";
	this.hit = false;
	
	// initial impulse
	this.b2Body.ApplyImpulse(new box2d.b2Vec2(isLeft ? 10.0 : -10.0, 0.0), bodyDef.position);
	
    return this;
};
gamejs.utils.objects.extend(exports.knight, gamejs.sprite.Sprite);

//------------------------------------------------------------------------------
// update knights
exports.knight.prototype.update = function(dt) {
    
	//this.image = gamejs.transform.rotate(this.originalImage, gamejs.utils.math.degrees(this.b2Body.GetAngle()));
	//this.rect.width = 0.0; this.rect.height = 0.0; // forces gamejs to use the rotated image size
	this.rect.x = (this.b2Body.GetPosition().x * global.BOX2D_SCALE) - this.image.getSize()[0] * 0.5;
	this.rect.y = (this.b2Body.GetPosition().y * global.BOX2D_SCALE) - this.image.getSize()[1] * 0.5;
}

//------------------------------------------------------------------------------
// knight death
exports.knight.prototype.die = function(b2World) {
    
	this.b2Body.SetUserData(null);
	b2World.DestroyBody(this.b2Body);		
}
