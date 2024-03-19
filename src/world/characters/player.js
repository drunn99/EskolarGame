import { WORLD_ASSET_KEYS } from "../../assetsKeys/asset-keys.js";
import { DIRECTION } from "../../common/direction.js";
import { Character } from "./character.js";

/**
 * @typedef {Omit<import("./character").CharacterConfig, 'assetKey' | 'assetFrame' | 'idleFrameConfig'>} PlayerConfig
*/

export class Player extends Character {
    /**@param {PlayerConfig} config */
    constructor(config) {
        super({
            ...config,
            assetKey: WORLD_ASSET_KEYS.PLAYER,
            origin: {x: 0, y: 0.2},
            idleFrameConfig: {
                DOWN: 0,
                UP : 14,
                LEFT: 26,
                RIGHT: 26,
                NONE: 0
            }
        });

    }

    /**@param {import("../../common/direction").Direction} direction  */
    moveCharacter(direction) {
        super.moveCharacter(direction);
        switch (direction) {
            case DIRECTION.DOWN:
                if (!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this.direction}`) {
                    this._phaserGameObject.play(`PLAYER_${this.direction}`);
                }
                break;
            case DIRECTION.LEFT:
                if (!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this.direction}`) {
                    this._phaserGameObject.play(`PLAYER_${this.direction}`);
                }
                break;
            case DIRECTION.RIGHT:
                if (!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this.direction}`) {
                    this._phaserGameObject.play(`PLAYER_${this.direction}`);
                }
                break;
            case DIRECTION.UP:
                if (!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this.direction}`) {
                    this._phaserGameObject.play(`PLAYER_${this.direction}`);
                }
                break;
            case DIRECTION.NONE:
                break;
            default:
        }
    }
}
