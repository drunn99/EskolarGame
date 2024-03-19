import { DIRECTION } from "../../common/direction.js";
import { TILE_SIZE } from "../../config.js";
import { getTargetPositionFromPositionAndDirection } from "../../utils/gridUtils.js";
import { exhaustiveGuard } from "../../utils/guard.js";

/**
 * @typedef CharacterIdleFrameConfig
 * @type {object}
 * @property {Number} UP
 * @property {Number} DOWN
 * @property {Number} LEFT
 * @property {Number} RIGHT
 * @property {Number} NONE
 * 

/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {string} assetKey
 * @property {import("../../../types/typedef").Coordinates} [origin = {x: 0 , y : 0}]
 * @property {import("../../../types/typedef").Coordinates} position
 * @property {import("../../common/direction.js").Direction} direction
 * @property {()=> void} [spriteGridMovementCallback]
 * @property {CharacterIdleFrameConfig} idleFrameConfig
*/

export class Character {
    /**@type {Phaser.Scene} */
    _scene;
    /**@type {Phaser.GameObjects.Sprite} */
    _phaserGameObject;
    /**@type {import("../../common/direction.js").Direction} */
    _direction;
    /**@type {boolean} */
    _isMoving;
    /**@type {import("../../../types/typedef").Coordinates} */
    _targetPosition;
    /**@type {import("../../../types/typedef").Coordinates} */
    _previousTargetPosition;
    /**@type {() => void | undefined} */
    _spriteGridMovementCallback;
    /**@type {CharacterIdleFrameConfig} */
    _idleFrameConfig;
    /**@type {import("../../../types/typedef").Coordinates} */
    _origin;

    /**
     * @param {CharacterConfig} config 
     */
    constructor(config) {
        this._scene = config.scene;
        this._direction = config.direction;
        this._isMoving = false;
        this._origin = config.origin ? {...config.origin} : {x: 8, y : 8};
        this._targetPosition = { ...config.position };
        this._previousTargetPosition = { ...config.position };
        this._idleFrameConfig = config.idleFrameConfig;
        this._phaserGameObject = config.scene.add.sprite(config.position.x, config.position.y, config.assetKey, this._getIdleFrame()).setOrigin(this._origin.x, this._origin.y).setScale(1.5,1.5);
        this._spriteGridMovementCallback = config.spriteGridMovementCallback;
    }

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    get sprite() {
        return this._phaserGameObject;
    }

    /**
     * @type {boolean}
     */
    get isMoving() {
        return this._isMoving;
    }

    /**
    * @type {import("../../common/direction.js").Direction}
    */
    get direction() {
        return this._direction;
    }

    /**@param {import("../../common/direction").Direction} direction  */
    moveCharacter(direction) {
        if (this._isMoving) {
            return;
        }
        this._moveSprite(direction);
    }

    /**
     * 
     * @param {DOMHighResTimeStamp} time
     * @returns {void} 
     */
    update(time) {
        if (this._isMoving) {
            return;
        }
        const idleFrame = this._phaserGameObject.anims.currentAnim?.frames[2].frame.name;
        if (!idleFrame) {
            return;
        }

        switch (this._direction) {
            case DIRECTION.DOWN:
                this._phaserGameObject.setFrame(idleFrame);
                break;
            case DIRECTION.LEFT:
                this._phaserGameObject.setFrame(idleFrame);
                break;
            case DIRECTION.RIGHT:
                this._phaserGameObject.setFrame(idleFrame);
                break;
            case DIRECTION.UP:
                this._phaserGameObject.setFrame(idleFrame);
                break;
            case DIRECTION.NONE:
                break;
            default:
        }
        this._phaserGameObject.anims.stop();
    }

    /**@param {import("../../common/direction").Direction} direction  */
    _moveSprite(direction) {
        this._direction = direction;
        if (this.is_blockingTile()) {
            return;
        }
        this._isMoving = true;
        this.#handleSpriteMovement();
    }

    #handleSpriteMovement() {
        if (this._direction === DIRECTION.NONE) {
            return;
        }

        const updatedPosition = getTargetPositionFromPositionAndDirection(this._targetPosition, this._direction);
        this._previousTargetPosition = { ...this._targetPosition };
        this._targetPosition.x = updatedPosition.x;
        this._targetPosition.y = updatedPosition.y;

        this._scene.add.tween({
            delay: 0,
            duration: 250,
            y: {
                from: this._phaserGameObject.y,
                start: this._phaserGameObject.y,
                to: this._targetPosition.y
            },
            x: {
                from: this._phaserGameObject.x,
                start: this._phaserGameObject.x,
                to: this._targetPosition.x
            },
            targets: this._phaserGameObject,
            onComplete: () => {
                this._isMoving = false;
                this._previousTargetPosition = { ...this._targetPosition };
                if (this._spriteGridMovementCallback) {
                    this._spriteGridMovementCallback();
                }
            }
        })


    }

    is_blockingTile() {
        if (this._direction === DIRECTION.NONE) {
            return;
        }
        //TODO añadir lógica de colisión
        return false;
    }

    _getIdleFrame() {
        return this._idleFrameConfig[this._direction];
    }
}
