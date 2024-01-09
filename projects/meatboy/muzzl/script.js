import * as me from 'https://cdn.jsdelivr.net/npm/melonjs@10.4.0/dist/melonjs.module.js';

class PlayScreen extends me.Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        me.game.world.addChild(me.pool.pull("player"));
    }
};

export default PlayScreen;