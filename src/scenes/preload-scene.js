import {
    BATTLE_ASSET_KEYS,
    BATTLE_BACKGROUND_ASSET_KEYS,
    BATTLE_UI_SOUND,
    HEALTH_BACKGROUND_ASSET_KEYS,
    MONSTER_ASSET_KEYS,
    PLAYER_ASSET_KEYS,
    UI_ASSET_KEYS
} from "../assetsKeys/asset-keys.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
            active: true,
        });
    }

    preload() {
        console.log(`${PreloadScene.name}:preload] invoked`);
        //Fondos de batalla 
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.FOREST, "assets/bgs/nature_5/orig.png");
        //Assets de barra de vida
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_left.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_mid.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_right.png");
        //Assets de monstruos y jugador
        this.load.spritesheet(MONSTER_ASSET_KEYS.SLIME, "assets/characters/slime.png", { frameWidth: 32 });
        this.load.spritesheet(PLAYER_ASSET_KEYS.DEFAULT_PLAYER, "assets/characters/player.png", { frameWidth: 48, frameHeight: 48, startFrame: 26 });
        //Assets de Interfaz de batalla
        this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, "assets/kennys/kenney_ui-pack-space-expansion/PNG/custom-ui.png");
        this.load.image(UI_ASSET_KEYS.CURSOR, "assets/kennys/kenney_ui-pack-space-expansion/PNG/cursor.png");

        //Audio
        this.load.audio(BATTLE_UI_SOUND.CURSOR, "assets/kennys/kenney_ui-pack/Bonus/click1.ogg");
    }
    create() {
        console.log(`${PreloadScene.name}:create] invoked`);
        this.scene.start(SCENE_KEYS.BATTLE_SCENE);

    }
}