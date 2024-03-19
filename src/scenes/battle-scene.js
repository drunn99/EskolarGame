import {
    BATTLE_ASSET_KEYS,
    BATTLE_UI_SOUND,
    MONSTER_ASSET_KEYS,
    PLAYER_ASSET_KEYS
} from "../assetsKeys/asset-keys.js";
import { Background } from "../battle/background.js";
import { BattleChar } from "../battle/battleChars/battle-Chars.js";
import { EnemyBattleChar } from "../battle/battleChars/enemy-battle-chars.js";
import { PlayerBattleChar } from "../battle/battleChars/player-battle-char.js";
import { HealthBar } from "../battle/ui/health-bar.js";
import { BattleMenu } from "../battle/ui/menu/battle-menu.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { Controls } from "../utils/controls.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class BattleScene extends Phaser.Scene {
    /**@type {BattleMenu} */
    #battleMenu;
    /**@type {Controls} */
    #controls;
    /**@type {EnemyBattleChar} */
    #activeEnemy;
    /**@type {PlayerBattleChar} */
    #activePlayer;

    constructor() {
        super({
            key: SCENE_KEYS.BATTLE_SCENE,
        });
    }

    preload() {
        //Audio
        this.load.audio(BATTLE_UI_SOUND.CURSOR, "assets/kennys/kenney_ui-pack/Bonus/click1.ogg");
        this.load.audio(BATTLE_UI_SOUND.BG_MUSIC, "assets/audio/OST/battle.mp3");
    }

    create() {
        console.log(`${BattleScene.name}:create] invoked`);
        //Background de batalla AÑADIR LO PRIMERO QUE VA POR CAPA (PRIMERO QUE SE CREA SE VA AL FONDO) o usar .SetDepth()
        const background = new Background(this);
        background.showRandomBG();

        //Musica de batalla
        this.bg_music = this.sound.add(BATTLE_UI_SOUND.BG_MUSIC);
        this.bg_music.play({
            loop: true,
            volume: 0.3,
        })

        //Jugador y Enemigo
        this.#activePlayer = new PlayerBattleChar({
            scene: this,
            characterDetails: {
                name: PLAYER_ASSET_KEYS.DEFAULT_PLAYER_NAME,
                assetKey: PLAYER_ASSET_KEYS.DEFAULT_PLAYER,
                level: 5,
                assetFrame: 0,
                currentHp: 100,
                maxHp: 100,
                attackOptions: [1, 2],
                baseAttack: 20,
            }
        })

        this.#activeEnemy = new EnemyBattleChar({
            scene: this,
            characterDetails: {
                name: MONSTER_ASSET_KEYS.SLIME,
                assetKey: MONSTER_ASSET_KEYS.SLIME,
                assetFrame: 0,
                level: 5,
                currentHp: 100,
                maxHp: 100,
                attackOptions: [3],
                baseAttack: 5,
            }
        });

        //Menu de batalla
        this.#battleMenu = new BattleMenu(this, this.#activePlayer);
        this.#battleMenu.showMainBattleMenu();
        //this.add.image(1000, 560, MONSTER_ASSET_KEYS.SLIME, 0).setScale(10).setFlipX(true);
        //this.add.image(240, 490, PLAYER_ASSET_KEYS.DEFAULT_PLAYER, 0).setScale(8);

        //Contenedor de la barra de vida del jugador

        //Cursores 
        this.#controls = new Controls(this);
        /*
        playerHealthBar.setMeterPercentageAnimated(0.5, { duration: 3000, callback: () => console.log("animationCompleted") });
        this.#activeEnemy.takeDmg(0);
        */

    }
    update() {
        const wasSpacePressed = this.#controls.wasSpaceKeyPressed();
        const wasShiftPressed = this.#controls.wasBackKeyPressed();

        if (wasSpacePressed) {
            this.#battleMenu.handlePlayerInput('OK');
            //Comprobar si se ha seleccionado LUCHAR -> ATACAR
            if (this.#battleMenu.selectedAttack === undefined) {
                return;
            } else {
                this.#battleMenu.hideFightMenu();
                /*
                this.#handleBattleSequence();
                */
            }
        }

        if (wasShiftPressed) {
            this.#battleMenu.handlePlayerInput('CANCEL');
            return;
        }
        const selectedDirection = this.#controls.getDirectionKeyPressedOnce();
        if (selectedDirection !== DIRECTION.NONE) {
            this.#battleMenu.handlePlayerInput(selectedDirection);
        }
    }

    #handleBattleSequence() {
        /*Secuencia de combate general jugador selecciona ataque - pregunta
        - enemigo -> pausa - animación de daño -> pausa - actualizar vida - pasar al otro personaje
        */
        this.#playerAttack();
    }

    #playerAttack() {
        this.#battleMenu.updateInfoPaneMessagesAndWaitInput([])
    }

}