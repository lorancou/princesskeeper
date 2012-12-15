var gamejs = require('gamejs');
var box2d = require('./Box2dWeb-2.1.a.3');
var object = require('object');

//------------------------------------------------------------------------------
// preload everything, call main when done
var data = [
    
    "../data/block00.png",
    "../data/block01.png",
    "../data/block02.png",
    "../data/block03.png",
    "../data/floor.png",
];
gamejs.preload(data);
gamejs.ready(main);

//------------------------------------------------------------------------------
// gameplay elements
var NUM_BLOCK_KINDS = 4;
var gBlockStore = null;
var gBlockSet = null;
var gBlockPickup = null;
var gFloor = null;

//------------------------------------------------------------------------------
// Box2D stuff
var b2World;

//------------------------------------------------------------------------------
// entry point
function main() {

    init();
    gamejs.time.fpsCallback(update, this, 60);
}

//------------------------------------------------------------------------------
// create everything
function init() {

    // set display size
    gamejs.display.setMode([1024, 768]);
    
    // create block store
    gBlockStore = new gamejs.sprite.Group();
    for (var i=0; i<NUM_BLOCK_KINDS; i++) {
        gBlockStore.add(new object.block([32 + i*64, 32], i));
    }
    
    // create empty block set
    gBlockSet = new gamejs.sprite.Group();
    
    // create floor
    gFloor = new object.floor([0, 640]);

    // create Box2D world
    b2World = new box2d.b2World(
       new box2d.b2Vec2(0, 10), // gravity
       true                     // allow sleep
    );

    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    var bodyDef = new box2d.b2BodyDef;

    //create ground
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = 9;
    bodyDef.position.y = 13;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(10, 0.5);
    b2World.CreateBody(bodyDef).CreateFixture(fixDef);

    //create some objects
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    for(var i = 0; i < 10; ++i) {
        if(Math.random() > 0.5) {
           fixDef.shape = new box2d.b2PolygonShape;
           fixDef.shape.SetAsBox(
                 Math.random() + 0.1 //half width
              ,  Math.random() + 0.1 //half height
           );
        } else {
           fixDef.shape = new box2d.b2CircleShape(
              Math.random() + 0.1 //radius
           );
        }
        bodyDef.position.x = Math.random() * 10;
        bodyDef.position.y = Math.random() * 10;
        b2World.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("gjs-canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    b2World.SetDebugDraw(debugDraw);
}
    
//------------------------------------------------------------------------------
// gather input then draw
function update(msDuration) {
    
    input();
    
    draw();
         b2World.Step(
               1 / 60   //frame-rate
            ,  10       //velocity iterations
            ,  10       //position iterations
         );
         //b2World.DrawDebugData();
         b2World.ClearForces();
    
    
}

//------------------------------------------------------------------------------
// handle key / mouse events
function input() {
    
    gamejs.event.get().forEach(function(event) {
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_UP) {
                console.log("up pressed");
            };
        } else if (event.type === gamejs.event.MOUSE_DOWN) {
            gBlockStore.forEach(function(block) {
                if (block.rect.collidePoint(event.pos)) {
                    gBlockPickup = new object.block(block.rect.topleft, block.index);
                }
            });
        } else if (event.type === gamejs.event.MOUSE_UP) {
            if (gBlockPickup) {
                gBlockSet.add(gBlockPickup);
                gBlockPickup = null;
            }
        } else if (event.type === gamejs.event.MOUSE_MOTION) {
            if (gBlockPickup) {
                gBlockPickup.rect.topleft = event.pos;
            }
        }
    });
}

//------------------------------------------------------------------------------
// blit
function draw() {
    
    gamejs.display.getSurface().fill('white');
    
    var mainSurface = gamejs.display.getSurface();
    gBlockStore.draw(mainSurface);
    gBlockSet.draw(mainSurface);
    if (gBlockPickup) {
        gBlockPickup.draw(mainSurface);
    }
    gFloor.draw(mainSurface);    
}