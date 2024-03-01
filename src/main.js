import Phaser from './lib/phaser.js';
import { BattleScene } from './scenes/battle-scene.js';
import { PreloadScene } from './scenes/preload-scene.js';
import { SCENE_KEYS } from './scenes/scene-keys.js';

const eskolar = new Phaser.Game({
    scale: {
        width: 1240,
        height: 720,
        parent : "game-container",
        autoCenter : Phaser.Scale.CENTER_BOTH,
        mode : Phaser.Scale.FIT,
    },
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    pixelArt: true,
});

eskolar.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
eskolar.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
eskolar.scene.start(SCENE_KEYS.PRELOAD_SCENE);