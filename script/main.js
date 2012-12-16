var gamejs = require('gamejs');
var box2d = require('./Box2dWeb-2.1.a.3');
var object = require('object');
var global = require('global');

//------------------------------------------------------------------------------
// preload everything, call main when done
var data = [
    
    "../data/block00.png",
    "../data/block01.png",
    "../data/block02.png",
    "../data/block03.png",
    "../data/knight00.png",
    "../data/knight01.png",
    "../data/princess.png",
    "../data/princess.png",
    "../data/floor.png",
];
gamejs.preload(data);
gamejs.ready(main);

//------------------------------------------------------------------------------
// game state
var STATE_BUILDING = 0;
var STATE_DEFENDING = 1;
var gState = STATE_BUILDING;

//------------------------------------------------------------------------------
// gameplay elements
var NUM_BLOCK_KINDS = 4;
var gBlockStore = null;
var gBlockSet = null;
var gBlockPickup = null;
var gFloor = null;
var gKnightSet = null;
var gLevelIndex = 0;

//------------------------------------------------------------------------------
// Box2D stuff
var b2World = null;
var b2Draw = false;

//------------------------------------------------------------------------------
// entry point
function main() {

    init();
    gamejs.time.fpsCallback(update, this, 24);
}

//------------------------------------------------------------------------------
// create everything
function init() {

    // set display size
    gamejs.display.setMode([1024, 768]);
    
    // create Box2D world
    b2World = new box2d.b2World(
       new box2d.b2Vec2(0, 10),  // gravity
       true                      // allow sleep
    );

    // create block store
    gBlockStore = new gamejs.sprite.Group();
	gBlockStore.add(new object.block([32, 32], "princess"));
    for (var i=0; i<NUM_BLOCK_KINDS; i++) {
        gBlockStore.add(new object.block([128 + i*64, 32], i));
    }
    
    // create empty block & knight sets
    gBlockSet = new gamejs.sprite.Group();
	gKnightSet = new gamejs.sprite.Group();
    
    // create floor
    gFloor = new object.floor([0, 640], b2World);

    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("gjs-canvas").getContext("2d"));
    debugDraw.SetDrawScale(global.BOX2D_SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    b2World.SetDebugDraw(debugDraw);
}
    
//------------------------------------------------------------------------------
// gather input then draw
function update(dt) {
    
	var events = gamejs.event.get();
    debugInput(events);
    
	// update game state
	switch (gState)
	{
		case STATE_BUILDING: updateBuilding(events, dt); break;
		case STATE_DEFENDING: updateDefending(events, dt); break;
	}
    
    // update physics
    b2World.Step(
        1 / 24,  //frame-rate
        10,      //velocity iterations
        10       //position iterations
    );
    b2World.ClearForces();

    // update gameplay elements
    gBlockSet.forEach(function(block) {
        block.update(dt);
    });
    gKnightSet.forEach(function(knight) {
        knight.update(dt);
    });

    draw();    
}

//------------------------------------------------------------------------------
// debug keys
function debugInput(events) {
    
    events.forEach(function(event) {
        if (event.type === gamejs.event.KEY_DOWN) {
            if (event.key === gamejs.event.K_b) {
                b2Draw = true;
            };
        } else if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_b) {
                b2Draw = false;
            };
        }
    });
}

//------------------------------------------------------------------------------
// building state
function updateBuilding(events, dt) {
	
    events.forEach(function(event) {
        if (event.type === gamejs.event.MOUSE_DOWN) {
            gBlockStore.forEach(function(block) {
                if (block.rect.collidePoint(event.pos)) {
					if (block.index == "princess") {
						gBlockStore.remove(block);
						gBlockPickup = block;
					}
					else
					{
						gBlockPickup = new object.block(block.rect.topleft, block.index);
					}
                }
            });
        } else if (event.type === gamejs.event.MOUSE_UP) {
            if (gBlockPickup) {
                gBlockPickup.turnOnPhysics(b2World);
                gBlockSet.add(gBlockPickup);
				if (gBlockPickup.index == "princess") {
					gState = STATE_DEFENDING;
					console.log("defending");
					gKnightSet.add(new object.knight([200, 200], 0, b2World));
				}
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
// defending state
function updateDefending(events, dt) {
	
}

//------------------------------------------------------------------------------
// blit
function draw() {
    
    gamejs.display.getSurface().fill('white');
    
    var mainSurface = gamejs.display.getSurface();
    gBlockStore.draw(mainSurface);
    gBlockSet.draw(mainSurface);
    gKnightSet.draw(mainSurface);
    if (gBlockPickup) {
        gBlockPickup.draw(mainSurface);
    }
    gFloor.draw(mainSurface);

    if (b2Draw) {
        b2World.DrawDebugData();
    }
}