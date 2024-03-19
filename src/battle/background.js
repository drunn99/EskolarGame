import Phaser from "../lib/phaser.js";
import { BATTLE_BACKGROUND_ASSET_KEYS, } from "../assetsKeys/asset-keys.js";

export class Background {
    /**@type {Phaser.Scene} */
    #scene;
    /**@type {Phaser.GameObjects.Image} */
    #backgroundGameObject

    /**
     * 
     * @param {Phaser.Scene} scene La escena de phaser3 que se añadirá al menú de batalla
     */
    constructor(scene) {
        this.#scene = scene;
        //Background de batalla AÑADIR LO PRIMERO QUE VA POR CAPA (PRIMERO QUE SE CREA SE VA AL FONDO) o usar .SetDepth()
        this.#backgroundGameObject = this.#scene.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setScale(2.25).setAlpha(0).setOrigin(0);
    }

    showRandomBG() {
        let ran = Math.floor((Math.random() * 4) + 1);
        switch (ran) {
            case 1:
                this.#backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setAlpha(0.8);
                break;
            case 2:
                this.#backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST2).setAlpha(0.8);
                break;
            case 3:
                this.#backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.MOUNTAIN).setAlpha(0.8);
                break;
            case 4:
                this.#backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.PLAINS).setAlpha(0.8);
                break;
            default:
                this.#backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST2).setAlpha(0.8);
        }

    }
}