import * as me from 'https://cdn.jsdelivr.net/npm/melonjs@10.4.0/dist/melonjs.module.js';

import PlayScreen from './player.js';
// import PlayerEntity from './js/renderables/player.js';
// import EnemyEntity from './js/renderables/enemy.js';

import DataManifest from './manifest.js';


me.device.onReady(function () {

    // initialize the display canvas once the device/browser is ready
    if (!me.video.init(1333, 750, {parent : "screen", scale : "auto", scaleMethod: "flex-width"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    me.loader.crossOrigin = "anonymous";

    me.loader.preload(DataManifest, function() {
        // set the user defined game stages
        me.state.set(me.state.PLAY, new PlayScreen());

        me.pool.register("player", PlayerEntity);

        // Start the game.
        me.state.change(me.state.PLAY);
    });
});