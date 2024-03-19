import { BATTLE_ASSET_KEYS, DATA_ASSET_KEYS } from "../../assetsKeys/asset-keys.js";
import Phaser from "../../lib/phaser.js";
import { HealthBar } from "../ui/health-bar.js";


export class BattleChar {
    /**@protected @type {Phaser.Scene} */
    _scene;
    /**@protected @type {import("../../../types/typedef.js").Character} */
    _charDetails;
    /**@type {HealthBar} */
    _healthBar;
    /**@type {Phaser.GameObjects.Image} */
    _phaserGameObject;
    /**@type {Number} */
    _currentHealth;
    /**@type {Number} */
    _maxHealth;
    /**@type {import("../../../types/typedef.js").Attack[]} */
    _charAttacks;
    /**@type {Phaser.GameObjects.Container} */
    _phaserHealthBarContainer

    /**
     * 
     * @param {import("../../../types/typedef.js").BattleCharsConfig} config 
     * @param {import("../../../types/typedef.js").Coordinates} position
     */
    constructor(config, position) {
        this._scene = config.scene;
        this._charDetails = config.characterDetails;
        this._currentHealth = this._charDetails.currentHp;
        this._maxHealth = this._charDetails.maxHp;
        this._charAttacks = [];
        this._phaserGameObject = this._scene.add.image(position.x, position.y, this._charDetails.assetKey, this._charDetails.assetFrame).setScale(10).setFlipX(true);
        this.#createHealthBarComponents();
        
        /**@type {import("../../../types/typedef.js").Attack[]} */
        const data = this._scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS);
        this._charDetails.attackOptions.forEach((attackOpt) => {
            const charAttack = data.find((attack) => attack.id == attackOpt);
            if (charAttack != undefined) {
                this._charAttacks.push(charAttack);
            }
        })
    }

    /** @type {boolean}*/
    get isFainted() {
        return this._currentHealth < 1;
    }

    /** @type {String} */
    get name() {
        return this._charDetails.name;
    }

    /**@type {import("../../../types/typedef.js").Attack[]} */
    get attack() {
        return [...this._charAttacks];
    }

    /** @type {Number} */
    get baseAttack() {
        return this._charDetails.baseAttack;
    }

    /**
     * 
     * @param {Number} damage 
     * @param {() => void} [callback] 
     */
    takeDmg(damage, callback) {
        //Actualziar vida y animar
        this._currentHealth -= damage;
        if (this._currentHealth < 0) {
            this._currentHealth = 0;
        }
        this._healthBar.setMeterPercentageAnimated(this._currentHealth / this._maxHealth, { callback });
    }

    #createHealthBarComponents() {
        //Contenedor de la barra de vida del enemigo
        this._healthBar = new HealthBar(this._scene, 25, 30);
        const battleCharGameText = this._scene.add.text(10, 10, this.name, { color: '#f0f011', fontSize: '24px', fontStyle: 'bold', fontFamily: "sans-serif" });
        const healthBarBgImage = this._scene.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(0.5, 0.8);
        const charHpText = this._scene.add.text(15, 47, "HP", { color: "red", fontSize: "24px", fontStyle: "italic", fontFamily: "sans-serif" });
        this._phaserHealthBarContainer = this._scene.add.container(880, 300,
            [ //Array de objetos a incluir en el contenedor
                healthBarBgImage,
                battleCharGameText,
                charHpText,
                this._healthBar.container
            ]);
    }
}
