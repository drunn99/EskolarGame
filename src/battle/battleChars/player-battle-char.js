import { BattleChar } from "./battle-Chars.js";

/**
 * @type {import("../../../types/typedef").Coordinates}
 */
const PLAYER_POSITION = Object.freeze({
    x: 240,
    y: 450
});

export class PlayerBattleChar extends BattleChar {
    /**@type {Phaser.GameObjects.Text} */
    #healthBarTextGameObject

    /**
     * 
     * @param {import("../../../types/typedef").BattleCharsConfig} config 
     */
    constructor(config) {
        super(config, PLAYER_POSITION);
        this._phaserGameObject.setFlipX(false);
        this._phaserHealthBarContainer.setPosition(120, 300);
        this.#addHealthBarComponents();
    }

    #setHealthBarText() {
        this.#healthBarTextGameObject.setText(`${this._currentHealth} / ${this._maxHealth}`);
    }

    #addHealthBarComponents() {
        this.#healthBarTextGameObject = this._scene.add.text(210, 70, '', {
            color: '#7E3D3F', fontSize: '16px', fontFamily: "sans-serif", fontStyle: 'bold'
        }).setOrigin(1, 0);
        this.#setHealthBarText();
        this._phaserHealthBarContainer.add(this.#healthBarTextGameObject);
    }

    /**
    * 
    * @param {Number} damage 
    * @param {() => void} [callback] 
    */
    takeDmg(damage, callback) {
        //Actualziar vida y animar
        super.takeDmg(damage, callback);
        this.#setHealthBarText();
    }
}