import { HEALTH_BACKGROUND_ASSET_KEYS } from "../../assetsKeys/asset-keys.js";
import Phaser from "../../lib/phaser.js";

export class HealthBar {
    /**@type {Phaser.Scene} */
    #scene;
    /**@type {Phaser.GameObjects.Container} */
    #healthBarContainer;
    /**@type {Number} */
    #fullWidth;
    /**@type {Number} */
    #scaleY;
    /**@type {Phaser.GameObjects.Image} */
    #leftCap;
    /**@type {Phaser.GameObjects.Image} */
    #midCap;
    /**@type {Phaser.GameObjects.Image} */
    #rightCap;
    /**@type {Phaser.GameObjects.Image} */
    #leftCap_shadow;
    /**@type {Phaser.GameObjects.Image} */
    #midCap_shadow;
    /**@type {Phaser.GameObjects.Image} */
    #rightCap_shadow;

    /**
     * 
     * @param {Phaser.Scene} scene La escena de phaser3 que se añadirá al menú de batalla
     * @param {Number} x
     * @param {Number} y
     */
    constructor(scene, x, y) {
        this.#scene = scene;
        this.#fullWidth = 160;
        this.#scaleY = 0.8;
        this.#healthBarContainer = this.#scene.add.container(x, y, []);
        this.#createHealthBarShadowImages(x, y);
        this.#createHealthBarImages(x, y);
        this.#setMeterPercentage(1);
    }

    get container() {
        return this.#healthBarContainer;
    }

    /**
     * 
     * @param {number} x Posición X de la barra de vida
     * @param {number} y Posición Y  de la barra de vida
     * @returns {void}
     */
    #createHealthBarImages(x, y) {
        this.#leftCap = this.#scene.add.image(x, y, HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#midCap = this.#scene.add.image(this.#leftCap.x + this.#leftCap.width, y, HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#midCap.displayWidth = this.#fullWidth;
        this.#rightCap = this.#scene.add.image(this.#midCap.x + this.#midCap.displayWidth, y, HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#healthBarContainer.add([this.#leftCap, this.#midCap, this.#rightCap]);
    }

    /**
    * 
    * @param {number} x Posición X de la sombra de barra de vida
    * @param {number} y Posición Y de la sombra de barra de vida
    * @returns {void}
    */
    #createHealthBarShadowImages(x, y) {
        this.#leftCap_shadow = this.#scene.add.image(x, y, HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP_SHADOW).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#midCap_shadow = this.#scene.add.image(this.#leftCap_shadow.x + this.#leftCap_shadow.width, y, HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP_SHADOW).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#midCap_shadow.displayWidth = this.#fullWidth;
        this.#rightCap_shadow = this.#scene.add.image(this.#midCap_shadow.x + this.#midCap_shadow.displayWidth, y, HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP_SHADOW).setOrigin(0, 0.5).setScale(1, this.#scaleY);
        this.#healthBarContainer.add([this.#leftCap_shadow, this.#midCap_shadow, this.#rightCap_shadow]);
    }

    /**
     * 
     * @param {Number} percent Porcentaje que modifica el ancho de la barra de vida antes del combate
     */
    #setMeterPercentage(percent = 1) {
        let width = this.#fullWidth * percent;
        this.#midCap.displayWidth = width;
        this.#rightCap.x = this.#midCap.x + this.#midCap.displayWidth;
    }


    /**
     * 
     * @param {Number} percent Porcentaje que modifica el ancho de la barra de vida durante el combate
     * @param {Object} options 
     * @param {Number} [options.duration=1000] Duración de la animación en s
     * @param {() => void} options.callback Función anónima que se ejecuta al terminar la animación
     */
    setMeterPercentageAnimated(percent, options) {
        let width = this.#fullWidth * percent;
        this.#scene.tweens.add({
            targets: this.#midCap,
            displayWidth: width,
            duration: options?.duration || 1000,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: () => {
                this.#rightCap.x = this.#midCap.x + this.#midCap.displayWidth;
                const isVisible = this.#midCap.displayWidth > 1;
                this.#leftCap.visible = isVisible;
                this.#midCap.visible = isVisible;
                this.#rightCap.visible = isVisible;
            },
            onComplete: options?.callback,


        })
    }
}