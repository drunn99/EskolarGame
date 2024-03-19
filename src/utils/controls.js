import { DIRECTION } from "../common/direction.js";
import phaser from "../lib/phaser.js";

export class Controls {
    /**@type {Phaser.Scene} */
    #scene
    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    #cursorKeys;
    /**@type {boolean} */
    #lockPlayerInput

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.#scene = scene;
        this.#cursorKeys = this.#scene.input.keyboard.createCursorKeys();
        this.#lockPlayerInput = false;
    }

    get isInputLocked (){
        return this.#lockPlayerInput;
    }

    set lockInput(val){
        this.#lockPlayerInput = val;
    }

    wasSpaceKeyPressed() {
        if (this.#cursorKeys === undefined) {
            return false;
        }
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);
    }

    wasBackKeyPressed() {
        if (this.#cursorKeys === undefined) {
            return false;
        }
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift);;
    }

    getDirectionKeyPressedOnce() {
        if (this.#cursorKeys === undefined) {
            return DIRECTION.NONE;
        }
        /**@type {import("../common/direction.js").Direction}*/
        let selectedDirection = DIRECTION.NONE;
        if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.left)) {
            selectedDirection = DIRECTION.LEFT;
        } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.down)) {
            selectedDirection = DIRECTION.DOWN;
        } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.right)) {
            selectedDirection = DIRECTION.RIGHT;
        } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up)) {
            selectedDirection = DIRECTION.UP;
        }
        return selectedDirection;
    }

    getDirectionKeyPressed() {
        if (this.#cursorKeys === undefined) {
            return DIRECTION.NONE;
        }
        /**@type {import("../common/direction.js").Direction}*/
        let selectedDirection = DIRECTION.NONE;
        if (this.#cursorKeys.left.isDown) {
            selectedDirection = DIRECTION.LEFT;
        } else if (this.#cursorKeys.down.isDown) {
            selectedDirection = DIRECTION.DOWN;
        } else if (this.#cursorKeys.right.isDown) {
            selectedDirection = DIRECTION.RIGHT;
        } else if (this.#cursorKeys.up.isDown) {
            selectedDirection = DIRECTION.UP;
        }

        return selectedDirection;
    }
}