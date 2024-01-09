class PlayerEntity extends me.Sprite {

    /**
     * constructor
     */
    constructor() {
        let image = me.loader.getImage("player");

        super(
            me.game.viewport.width / 2 - image.width / 2,
            me.game.viewport.height - image.height - 20,
            { image : image, width: 32, height: 32 }
        );
    }

    /**
     * update the sprite
     */
    update(dt) {
        // change body force based on inputs
        //....
        // call the parent method
        return super.update(dt);
    }

   /**
     * collision handler
     * (called when colliding with other objects)
     */
    onCollision(response, other) {
        // Make all other objects solid
        return true;
    }
};