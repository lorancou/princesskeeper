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
];
gamejs.preload(data);
gamejs.ready(main);

//------------------------------------------------------------------------------
// gameplay elements
var NUM_BLOCK_KINDS = 4;
var gBlockStore = new gamejs.sprite.Group();
var gBlockSet = new gamejs.sprite.Group();
var gBlockPickup = null;

//------------------------------------------------------------------------------
// Box2D stuff
var b2World;
var world;

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
    
    // create Box2D world
    //b2World = new box2d.b2World(new box2d.b2Vec2(0, 0), false);
    
    
     var   b2Vec2 = box2d.b2Vec2
        ,	b2BodyDef = box2d.b2BodyDef
        ,	b2Body = box2d.b2Body
        ,	b2FixtureDef = box2d.b2FixtureDef
        ,	b2Fixture = box2d.b2Fixture
        ,	b2World = box2d.b2World
        ,	b2MassData = box2d.b2MassData
        ,	b2PolygonShape = box2d.b2PolygonShape
        ,	b2CircleShape = box2d.b2CircleShape
        ,	b2DebugDraw = box2d.b2DebugDraw
        ;
     
     world = new b2World(
           new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
     );
     
     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef = new b2BodyDef;
     
     //create ground
     bodyDef.type = b2Body.b2_staticBody;
     bodyDef.position.x = 9;
     bodyDef.position.y = 13;
     fixDef.shape = new b2PolygonShape;
     fixDef.shape.SetAsBox(10, 0.5);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     
     //create some objects
     bodyDef.type = b2Body.b2_dynamicBody;
     for(var i = 0; i < 10; ++i) {
        if(Math.random() > 0.5) {
           fixDef.shape = new b2PolygonShape;
           fixDef.shape.SetAsBox(
                 Math.random() + 0.1 //half width
              ,  Math.random() + 0.1 //half height
           );
        } else {
           fixDef.shape = new b2CircleShape(
              Math.random() + 0.1 //radius
           );
        }
        bodyDef.position.x = Math.random() * 10;
        bodyDef.position.y = Math.random() * 10;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
     }
     
     //setup debug draw
     var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("gjs-canvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
     
     window.setInterval(update, 1000 / 60);
    
}
    
//------------------------------------------------------------------------------
// gather input then draw
function update(msDuration) {
    
    input();
    
    draw();
         world.Step(
               1 / 60   //frame-rate
            ,  10       //velocity iterations
            ,  10       //position iterations
         );
         world.DrawDebugData();
         world.ClearForces();
    
    
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
}