import { WORLD_ASSET_KEYS, WORLD_SOUND } from "../assetsKeys/asset-keys.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { Controls } from "../utils/controls.js";
import { Player } from "../world/characters/player.js";
import { SCENE_KEYS } from "./scene-keys.js";
import { TILE_SIZE } from "../config.js";

const PLAYER_POSITION = Object.freeze({
    x: 8 * TILE_SIZE,
    y: 8 * TILE_SIZE
});

export class WorldScene extends Phaser.Scene {
    /**@type {Player} */
    #player;
    /**@type {Controls} */
    #controls;
    constructor() {
        super({
            key: SCENE_KEYS.WORLD_SCENE,
        })
    }

    preload() {
        //Audio
        this.load.audio(WORLD_SOUND.OW_MUSIC, "assets/audio/OST/OVERWORLD_THEME.WAV");
    }

    create() {

        //Background
        this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND, 0).setOrigin(0).setDepth(0);
        //BG-Music
        this.bg_music = this.sound.add(WORLD_SOUND.OW_MUSIC);
        this.bg_music.play({
            loop: true,
            volume: 0.3,
        })
        //Límites de la cámara
        this.cameras.main.setBounds(0, 0, 1024, 1024);

        //Player
        this.#player = new Player({
            scene: this,
            position: PLAYER_POSITION,
            direction: DIRECTION.DOWN
        });

        //Camara del jugador
        this.cameras.main.startFollow(this.#player.sprite);
        this.cameras.main.setZoom(2);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        /*
        const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_DATA });
        const collisionTiles = map.addTilesetImage('collision', WORLD_ASSET_KEYS.WORLD_COLLISION);
        if (!collisionTiles) {
            console.log('Collision layer error from tiled');
            return;
        }
        const collisionLayer = map.createLayer('Collision', collisionTiles, 0, 0);
        if (!collisionLayer) {
            console.log('Collision layer error from tiled');
            return;
        }
        */
        //Elementos foreground
        this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0).setDepth(2);

        //Crear instancia de controles
        this.#controls = new Controls(this);
    }

    update(time) {
        const selectedDirection = this.#controls.getDirectionKeyPressed();
        if (selectedDirection !== DIRECTION.NONE) {
            this.#player.moveCharacter(selectedDirection);
        }
        this.#player.update(time);
    }
}