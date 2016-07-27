# CrossFire

Tuesday:

General:
Fixed the wall collisions and mapObjects Generation. Refactored and renamed a bunch of the player movement functions.
Changed the player1Down sprite to a perfect square so I could check more closely for collisions

Server side:
Noticed that the map data (objects and tiles) in the config folder of the server was outdated and so must not be getting used.
Commented out all the data and the functions that use it in the server/engine/index.js file and the game seems to run fine. 
Guess these can be deleted at some point. 

Client side:
While rewriting the collision data I rewrote a lot of the movement functions consolidating what was 3 or 4 functions into 1.
(can refactor back out in multiple functions again if needed but it had to all be rewritten in order to trace/fix a bug)

BUGS:
There is now a bug where other players do not render correctly on each others screens. They keep moving instead of slowing down. 
This is probably due to the index.js file not telling the other players to slow down and stop. Could be it's still trying to send/run an older function to the server that I have since renamed. 
Will look into this tomorrow.


Wednesday:

General:
Fixed/rewrote collisions for player when interacting with objects/items/weapons
added in armour, effect and respawnTime as variables for items 
added in armour as a variable for the player and changed the takeDamage & healthbar functions to show this. 
added in cloak and speedBoost as items; as of yet these do not affect the player and they share the same sprite as the overshield

ServerSide:
Added in the new item variables to the itemFactory and engine/index.js

ClientSide
Added in the new item variables to the itemFactory
rewrote/added to functions for object collision, itemPickup, takeDamage & healthbar

BUGS
still have Tuesdays bug where players do not stop moving on each others screens.
items respawn almost instantly despite being told to take 10 seconds. I think this is a problem on the server side. There's still a lot of code there that I do not fully understand so it's hard to trace the bug.









## Setup

* `git clone`
* `npm i`
  * You will also need to `npm i -g gulp` if you don't have it already

## Running

* run `gulp`
  * This will run:
    * The game server
    * Webpack js bundling and transpiling
    * Browser-sync for the client (automatically reloads when you change client-side code)
* open browser to http://localhost:3000
