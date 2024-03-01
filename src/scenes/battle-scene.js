import {
    BATTLE_ASSET_KEYS,
    BATTLE_BACKGROUND_ASSET_KEYS,
    HEALTH_BACKGROUND_ASSET_KEYS,
    MONSTER_ASSET_KEYS,
    PLAYER_ASSET_KEYS
} from "../assetsKeys/asset-keys.js";
import { BattleMenu } from "../battle/ui/menu/battle-menu.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class BattleScene extends Phaser.Scene {
    /**@type {BattleMenu} */
    #battleMenu
    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    #cursorKeys
    constructor() {
        super({
            key: SCENE_KEYS.BATTLE_SCENE,
        });
    }

    preload() {

    }

    create() {
        console.log(`${BattleScene.name}:create] invoked`);
        //Background de batalla AÑADIR LO PRIMERO QUE VA POR CAPA (PRIMERO QUE SE CREA SE VA AL FONDO) o usar .SetDepth()
        this.add.image(this.scale.width / 2, this.scale.height / 2, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setScale(2.25).setAlpha(0.8);

        this.#battleMenu = new BattleMenu(this);
        this.#battleMenu.showMainBattleMenu();

        //Jugador y Enemigo
        this.add.image(1000, 560, MONSTER_ASSET_KEYS.SLIME, 0).setScale(10).setFlipX(true);
        this.add.image(240, 490, PLAYER_ASSET_KEYS.DEFAULT_PLAYER, 0).setScale(8);

        //Contenedor de la barra de vida del jugador
        const player = this.add.text(10, 10, PLAYER_ASSET_KEYS.DEFAULT_PLAYER_NAME, { color: '#f0f011', fontSize: '24px', fontStyle: 'bold', fontFamily: "sans-serif" });
        this.add.container(120, 300,
            [ //Array de objetos a incluir en el contenedor
                this.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(0.5, 0.8),
                player,
                this.add.text(15, 47, "HP", { color: "red", fontSize: "24px", fontStyle: "italic", fontFamily: "sans-serif" }),
                this.add.text(160, 10, "LVL5", { color: 'lime', fontSize: '24px', fontFamily: "sans-serif" }),
                this.add.text(210, 70, "100 / 100", { color: '#7E3D3F', fontSize: '16px', fontFamily: "sans-serif", fontStyle: 'bold' }).setOrigin(1, 0),
                this.#createHealthBar(25, 30)
            ]);


        //Contenedor de la barra de vida del enemigo
        const enemy = this.add.text(10, 10, MONSTER_ASSET_KEYS.SLIME, { color: '#f0f011', fontSize: '24px', fontStyle: 'bold', fontFamily: "sans-serif" });
        this.add.container(880, 300,
            [ //Array de objetos a incluir en el contenedor
                this.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(0.5, 0.8),
                enemy,
                this.add.text(15, 47, "HP", { color: "red", fontSize: "24px", fontStyle: "italic", fontFamily: "sans-serif" }),
                this.#createHealthBar(25, 30)
            ]);
        //Cursores 
        this.#cursorKeys = this.input.keyboard.createCursorKeys();
    }
    update() {
        const wasSpacePressed = Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);
        const wasShiftPressed = Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift);
        if (wasSpacePressed) {
            this.#battleMenu.handlePlayerInput('OK');
            return;
        }

        if (wasShiftPressed) {
            this.#battleMenu.handlePlayerInput('CANCEL');
            return;
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

        if (selectedDirection !== DIRECTION.NONE) {
            this.#battleMenu.handlePlayerInput(selectedDirection);
        }
    }

    /**
     * 
     * @param {number} x Posición X de la barra de vida
     * @param {number} y Posición Y  de la barra de vida
     * @returns 
     */
    #createHealthBar(x, y) {
        const leftCap = this.add.image(x, y, HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP).setOrigin(0, 0.5).setScale(1, 0.8);
        const midCap = this.add.image(leftCap.x + leftCap.width, y, HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP).setOrigin(0, 0.5).setScale(1, 0.8);
        midCap.displayWidth = 150;
        const rightCap = this.add.image(midCap.x + midCap.displayWidth, y, HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP).setOrigin(0, 0.5).setScale(1, 0.8);
        return this.add.container(x, y, [leftCap, midCap, rightCap]);
    }

}