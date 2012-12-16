var gamejs = require('gamejs');
var global = require('global');
var box2d = require('./Box2dWeb-2.1.a.3');
var object = require('object');
var level = require('level');
var ui = require('ui');

//------------------------------------------------------------------------------
// preload everything, call main when done
var data = [
	global.DATA_PATH + "block00_1.png",
	global.DATA_PATH + "block00_2.png",
	global.DATA_PATH + "block00_3.png",
	global.DATA_PATH + "block01_1.png",
	global.DATA_PATH + "block01_2.png",
	global.DATA_PATH + "block01_3.png",
	global.DATA_PATH + "block02_1.png",
	global.DATA_PATH + "block02_2.png",
	global.DATA_PATH + "block02_3.png",
	global.DATA_PATH + "block03_1.png",
	global.DATA_PATH + "block03_2.png",
	global.DATA_PATH + "block03_3.png",
	global.DATA_PATH + "msg_crown.png",
	global.DATA_PATH + "msg_drop.png",
	global.DATA_PATH + "msg_end.png",
	global.DATA_PATH + "msg_fail.png",
	global.DATA_PATH + "msg_pick.png",
	global.DATA_PATH + "msg_princess.png",
	global.DATA_PATH + "msg_win.png",
	global.DATA_PATH + "knight00_0.png",
	global.DATA_PATH + "knight00_1.png",
	global.DATA_PATH + "knight00_2.png",
	global.DATA_PATH + "knight01_0.png",
	global.DATA_PATH + "knight01_1.png",
	global.DATA_PATH + "knight01_2.png",
	global.DATA_PATH + "princess.png",
	global.DATA_PATH + "princess.png",
	global.DATA_PATH + "floor.png",
	global.DATA_PATH + "title.png",
	global.DATA_PATH + "vbar.png",
];
gamejs.preload(data);
gamejs.ready(main);

//------------------------------------------------------------------------------
// game state
var STATE_BUILDING = 0;
var STATE_DEFENDING = 1;
var STATE_LOST = 2;
var STATE_WIN = 3;
var gState = STATE_BUILDING;
var gStateTimer = 0.0;
var gDefendingNextSpawn = 0.0;
var gDefendingNextLeft = true;

//------------------------------------------------------------------------------
// gameplay elements
var NUM_BLOCK_KINDS = 4;
var gBlockStore = null;
var gBlockStoreInventory = null;
var gBlockStoreYOffsets = null;
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
// UI stuff
var gFont = null;
var gTitle = null;
var gVBarLeft = null;
var gVBarRight = null;
var gMsg = null;

//------------------------------------------------------------------------------
// entry point
function main() {

    init(gLevelIndex);
    gamejs.time.fpsCallback(update, this, 24);
}

//------------------------------------------------------------------------------
// create everything
function init(levelIndex) {

    // set display size
    gamejs.display.setMode([1024, 768]);
    
    // create Box2D world
    b2World = new box2d.b2World(
       new box2d.b2Vec2(0, 10),  // gravity
       true                      // allow sleep
    );

    // add our contact listener
    // http://stackoverflow.com/questions/10878750/box2dweb-collision-contact-point
    var b2Listener = box2d.Box2D.Dynamics.b2ContactListener;
	var listener = new b2Listener;
    listener.BeginContact = function(contact) {
        //console.log(contact.GetFixtureA().GetBody().GetUserData());
    }
    listener.EndContact = function(contact) {
        // console.log(contact.GetFixtureA().GetBody().GetUserData());
    }
    listener.PostSolve = function(contact, impulse) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
        if ((objectA.kind == "knight" && objectB.kind == "princess") || (objectA.kind == "princess" && objectB.kind == "knight")) {
			if (gState == STATE_DEFENDING) {
				gState = STATE_LOST;
				gMsg = new ui.msg("fail", [300, 200]);		
			}
		} else if (objectA.kind == "knight" && objectB.kind == "block") {
			objectA.hit = true;
			objectB.hit();
		} else if (objectA.kind == "block" && objectB.kind == "knight") {
			objectA.hit();
			objectB.hit = true;
		}
    }
    listener.PreSolve = function(contact, oldManifold) {
        // PreSolve
    }
    b2World.SetContactListener(listener);
	
    // setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("gjs-canvas").getContext("2d"));
    debugDraw.SetDrawScale(global.BOX2D_SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    b2World.SetDebugDraw(debugDraw);

    // create block store
	gBlockStoreInventory = level.constants[levelIndex].blocks.slice(0); // NB: array deep copy http://stackoverflow.com/a/7486130/1005455
    gBlockStore = new gamejs.sprite.Group();
	gBlockStoreYOffsets = new Array();
	if (gLevelIndex >= 1) {
		gBlockStore.add(new object.block([20, 166], "princess"));
	}
	var currentY = 250;
    for (var i=0; i<NUM_BLOCK_KINDS; i++) {
		if (gBlockStoreInventory[i] > 0) {
			var newBlock = new object.block([40, currentY], i);
			gBlockStore.add(newBlock);
			gBlockStoreYOffsets[i] = currentY;
			currentY += newBlock.image.getSize()[1] + 20;
		}
    }
   
    // create empty block & knight sets
    gBlockSet = new gamejs.sprite.Group();
    gKnightSet = new gamejs.sprite.Group();
    
    // create floor
    gFloor = new object.floor([0, 603], b2World);

	// create UI
	gFont = new gamejs.font.Font();
	gTitle = new ui.title();
	gVBarLeft = new ui.vbar(512 - level.constants[gLevelIndex].dropAreaWidth * 0.5);
	gVBarRight = new ui.vbar(512 + level.constants[gLevelIndex].dropAreaWidth * 0.5);
	
	if (levelIndex == 0) {
		gMsg = new ui.msg("pick", [150, 180]);
	}
		
	gState = STATE_BUILDING;
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
        case STATE_LOST: updateLost(events, dt); break;
        case STATE_WIN: updateWin(events, dt); break;
    }
	gStateTimer += dt;

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
		
		// in building state, hit blocks getting outside the drop area
		if (gState == STATE_BUILDING) {
			block.checkDropArea(level.constants[gLevelIndex].dropAreaWidth);
		}
		
		if (block.type != "princess" && block.hp == 0) {
			block.die(b2World);
			gBlockSet.remove(block);
		}
    });
    gKnightSet.forEach(function(knight) {
        knight.update(dt);
		if (knight.hit) {
			knight.die(b2World);
			gKnightSet.remove(knight);
		}
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
		// block picking
        if (event.type === gamejs.event.MOUSE_DOWN) {
            gBlockStore.forEach(function(block) {
                if (block.rect.collidePoint(event.pos)) {
                    if (block.index == "princess") {
						// picked a princess
                        gBlockStore.remove(block);
                        gBlockPickup = block;
						
						if (gLevelIndex == 0) {
							gMsg = new ui.msg("crown", [410, 150]);
						}
                    } else {
						
						if (gMsg) {
							gMsg = new ui.msg("drop", [410, 150]);
						}
						
						// picked a regular block
						if (0 == (--gBlockStoreInventory[block.index])) {
							// that was the last one
							gBlockStore.remove(block);
							gBlockPickup = block;
							
						} else {
							// there are blocks remaining, create a new instance
							gBlockPickup = new object.block(block.rect.topleft, block.index);
						}
                    }
                }
            });
		// block dropping
        } else if (event.type === gamejs.event.MOUSE_UP) {
            if (gBlockPickup) {
				if (gMsg) {
					gMsg = null;
				}
				
                gBlockPickup.turnOnPhysics(b2World);
                gBlockSet.add(gBlockPickup);
                if (gBlockPickup.index == "princess") {
                    // switch to defending state!
                    gState = STATE_DEFENDING;
                    gStateTimer = 0.0;
                    gDefendingNextSpawn = 2000.0;
                    gDefendingNextLeft = true;
                } else  {
					// no more blocks in store, add the princess (level 0 - tutorial)
					if (gBlockStore._sprites.length == 0) {
						if (gLevelIndex == 0) {
							gMsg = new ui.msg("princess", [150, 220]);
							gBlockStore.add(new object.block([20, 250], "princess"));
						}
					}
				}
				
                gBlockPickup = null;
            }
		// block dragging
        } else if (event.type === gamejs.event.MOUSE_MOTION) {
            if (gBlockPickup) {
                gBlockPickup.rect.center = event.pos;
            }
        }
    });
}

//------------------------------------------------------------------------------
// defending state
function updateDefending(events, dt) {

    if (gStateTimer > gDefendingNextSpawn) {
        
		// spawn knights
		var knightIndex = Math.random() < 0.1 ? 1 : 0; // spawn a goat once in a while
        if (gDefendingNextLeft) {
            gKnightSet.add(new object.knight([0, 630], knightIndex, b2World, gDefendingNextLeft));
        } else {
            gKnightSet.add(new object.knight([1024-80, 630], knightIndex, b2World, gDefendingNextLeft));
        }                
        
        gDefendingNextSpawn += 2000.0;
        gDefendingNextLeft = !gDefendingNextLeft;
    }
    
	var duration = level.constants[gLevelIndex].duration;
	var timeLeft = (duration - gStateTimer) / 1000;
	if (timeLeft < 0) {
		if (gLevelIndex == (level.constants.length-1)) {
			gMsg = new ui.msg("end", [260, 180]);
		} else {
			gMsg = new ui.msg("win", [300, 200]);
		}
		gState = STATE_WIN;
	}
}

//------------------------------------------------------------------------------
// lost state
function updateLost(events, dt) {
	
	var restart = false;
    events.forEach(function(event) {
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_SPACE) {
                restart = true;
            };
        } else if (event.type === gamejs.event.MOUSE_UP) {
			restart = true;
        }
    });
	
	if (restart) {
		gMsg = null;
		init(gLevelIndex);
	}
}

//------------------------------------------------------------------------------
// win state
function updateWin(events, dt) {

	// skip, the game is finished
	if (gLevelIndex == (level.constants.length-1)) {
		return;
	}
	
	var next = false;
    events.forEach(function(event) {
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_SPACE) {
				next = true;
            };
        } else if (event.type === gamejs.event.MOUSE_UP) {
			next = true;
        }
    });	
	
	if (next) {
		gMsg = null;
		init(++gLevelIndex);
	}		
}

//------------------------------------------------------------------------------
// draw
function draw() {
    
    gamejs.display.getSurface().fill('white');
    var mainSurface = gamejs.display.getSurface();

	// those need to be drawn before the floor
	if (gState == STATE_BUILDING)
	{
		gVBarLeft.draw(mainSurface);
		gVBarRight.draw(mainSurface);
	}

    gFloor.draw(mainSurface);

	// draw message
	if (gMsg) {
		gMsg.draw(mainSurface);
	}

	if (gBlockPickup) {
        gBlockPickup.draw(mainSurface);
    }

	gBlockSet.draw(mainSurface);
    
	gKnightSet.draw(mainSurface);
    
    if (b2Draw) {
        b2World.DrawDebugData();
    }
	
	// draw title
	gTitle.draw(mainSurface);
	
    // draw game state UI
    switch (gState)
    {
        case STATE_BUILDING: drawBuilding(mainSurface); break;
        case STATE_DEFENDING: drawDefending(mainSurface); break;
        case STATE_LOST: drawLost(mainSurface); break;
        case STATE_WIN: drawWin(mainSurface); break;
    }
	
	// draw level #
	mainSurface.blit(gFont.render("LEVEL " + (gLevelIndex + 1)), [970,10]);
}

//------------------------------------------------------------------------------
// draw defending
function drawBuilding(surface) {
	
	gBlockStore.draw(surface);
	
	// draw remaining blocks count
	for (var i=0; i<NUM_BLOCK_KINDS; ++i) {
		if (gBlockStoreInventory[i] > 0) {
			surface.blit(gFont.render("" + gBlockStoreInventory[i] + " x"), [20, gBlockStoreYOffsets[i] + 15]);
		}
	}
	
	surface.blit(gFont.render("BUILDING"), [10,10]);
}

//------------------------------------------------------------------------------
// draw defending
function drawDefending(surface) {
	
	var duration = level.constants[gLevelIndex].duration;
	var timeLeft = (duration - gStateTimer) / 1000;
	surface.blit(gFont.render("DEFENDING " + timeLeft), [10,10]);
}

//------------------------------------------------------------------------------
// draw lost
function drawLost(surface) {
	
	surface.blit(gFont.render("LOST"), [10,10]);
}

//------------------------------------------------------------------------------
// draw win
function drawWin(surface) {
	
	surface.blit(gFont.render("WIN"), [10,10]);
}
