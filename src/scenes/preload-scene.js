import {
    BATTLE_ASSET_KEYS,
    BATTLE_BACKGROUND_ASSET_KEYS,
    DATA_ASSET_KEYS,
    HEALTH_BACKGROUND_ASSET_KEYS,
    MONSTER_ASSET_KEYS,
    PLAYER_ASSET_KEYS,
    UI_ASSET_KEYS,
    WORLD_ASSET_KEYS
} from "../assetsKeys/asset-keys.js";
import Phaser from "../lib/phaser.js";
import { DataUtils } from "../utils/dataUtils.js";
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
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.FOREST, "assets/bgs/nature_1/orig.png");
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.FOREST2, "assets/bgs/nature_5/orig.png");
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.MOUNTAIN, "assets/bgs/nature_3/orig.png");
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.PLAINS, "assets/bgs/nature_2/orig.png");

        //Assets de barra de vida
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_left.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_mid.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_green_right.png");
        //Sombra
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.LEFT_CAP_SHADOW, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_shadow_left.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.MIDDLE_CAP_SHADOW, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_shadow_mid.png");
        this.load.image(HEALTH_BACKGROUND_ASSET_KEYS.RIGHT_CAP_SHADOW, "assets/kennys/kenney_ui-pack-space-expansion/PNG/barHorizontal_shadow_right.png");

        //Assets de monstruos y jugador para batalla
        this.load.spritesheet(MONSTER_ASSET_KEYS.SLIME, "assets/characters/slime.png", { frameWidth: 32 });
        this.load.spritesheet(PLAYER_ASSET_KEYS.DEFAULT_PLAYER, "assets/characters/player.png", { frameWidth: 48, frameHeight: 48, startFrame: 42, });

        //Assets de Interfaz de batalla
        this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, "assets/kennys/kenney_ui-pack-space-expansion/PNG/custom-ui.png");
        this.load.image(UI_ASSET_KEYS.CURSOR, "assets/kennys/kenney_ui-pack-space-expansion/PNG/cursor.png");

        //Cargar Mundo
        this.load.image(WORLD_ASSET_KEYS.WORLD_BACKGROUND, "../../tiled_map/maps/background.png");
        this.load.image(WORLD_ASSET_KEYS.WORLD_FOREGROUND, "../../tiled_map/maps/foreground.png");
        this.load.tilemapTiledJSON(WORLD_ASSET_KEYS.WORLD_DATA, "../../tiled_map/maps/Overworld.json");
        this.load.image(WORLD_ASSET_KEYS.WORLD_COLLISION, "../../tiled_map/maps/background.png");
        

        //Assets de jugador y npcs para el mundo
        this.load.spritesheet(WORLD_ASSET_KEYS.PLAYER, "assets/characters/player.png", { frameWidth: 48, frameHeight: 48, startFrame: 0 });
        this.load.spritesheet(WORLD_ASSET_KEYS.PLAYER_INV, "assets/characters/playerInverted.png", { frameWidth: 48, frameHeight: 48, startFrame: 0 });
        this.load.spritesheet(WORLD_ASSET_KEYS.NPC1, "assets/characters/NPCSV1/NPCS.png", { frameWidth: 48, frameHeight: 48, startFrame: 0 });


        //Cargar JSONs
        this.load.json(DATA_ASSET_KEYS.ATTACKS, 'assets/data/attacks.json');
        this.load.json(DATA_ASSET_KEYS.ANIMATIONS, 'assets/data/animation.json');
    }
    create() {
        console.log(`${PreloadScene.name}:create] invoked`);
        this.#createAnim();
        this.scene.start(SCENE_KEYS.BATTLE_SCENE); //SCENE_KEYS.WORLD_SCENE PARA ESCENA DE MUNDO / SCENE_KEYS.BATTLE_SCENE PARA ESCENA DE BATALLA
    }

    #createAnim() {
        const animations = DataUtils.getAnimations(this);
        animations.forEach((animation) => {
            const frames = animation.frames ?
                this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames }) :
                this.anims.generateFrameNumbers(animation.assetKey)
            this.anims.create({
                key: animation.key,
                frames: frames,
                frameRate: animation.frameRate,
                repeat: animation.repeat,
                delay: animation.delay,
                yoyo: animation.yoyo
            })
        });

    }
}