import Phaser from "../src/lib/phaser.js";

/**
 * @typedef BattleCharsConfig
 * @type {Object}
 * @property {Phaser.Scene} scene
 * @property {Character} characterDetails
 * @property {Number} [scaleHealthBar = 1]
 */

/**
 * @typedef Character
 * @type {Object}
 * @property {string} name
 * @property {string} assetKey
 * @property {Number} [assetFrame = 0]
 * @property {Number} maxHp
 * @property {Number} level
 * @property {Number} currentHp
 * @property {Number} baseAttack
 * @property {Number []} attackOptions
 */

/**
 * @typedef Coordinates
 * @property {Number} x
 * @property {Number} y
 */

/**
 * @typedef Attack
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} animation
 */

/**
 * @typedef Animation
 * @type {Object}
 * @property {String} key
 * @property {Number []} [frames]
 * @property {Number} frameRate
 * @property {Number} repeat
 * @property {Number} delay
 * @property {boolean} yoyo
 * @property {String} assetKey
 */

/**
 * @typedef Question
 * @type {Object}
 * @property {Number} id
 * @property {String} questionHeader
 * @property {Number} questionAnswer
 * @property {String []} questionOptions
 */