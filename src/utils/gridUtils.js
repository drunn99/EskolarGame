import { DIRECTION } from "../common/direction.js";
import { TILE_SIZE } from "../config.js";
import { exhaustiveGuard } from "./guard.js";

/**
 * 
 * @param {import("../../types/typedef").Coordinates} currentPosition 
 * @param {import("../common/direction").Direction} direction 
 * @returns {import("../../types/typedef").Coordinates}
 */
export function getTargetPositionFromPositionAndDirection(currentPosition, direction){
    /**@type {import("../../types/typedef").Coordinates} */
    let targetPosition = {...currentPosition};
    switch (direction) {
        case DIRECTION.DOWN:
            targetPosition.y += TILE_SIZE;
            break;
        case DIRECTION.LEFT:
            targetPosition.x -= TILE_SIZE;
            break;
        case DIRECTION.UP:
            targetPosition.y -= TILE_SIZE;
            break;
        case DIRECTION.RIGHT:
            targetPosition.x += TILE_SIZE;
            break;
        case DIRECTION.NONE:
            break;
        default:
            exhaustiveGuard(direction);
    }
    return targetPosition;
}