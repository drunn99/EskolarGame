import { BattleChar } from "./battle-Chars.js";

/**
 * @type {import("../../../types/typedef").Coordinates}
 */
const ENEMY_POSITION = Object.freeze({
    x: 1000,
    y: 560
});

export class EnemyBattleChar extends BattleChar {
    /**
     * 
     * @param {import("../../../types/typedef").BattleCharsConfig} config 
     */
    constructor(config) {
        super(config, ENEMY_POSITION);
    }
}