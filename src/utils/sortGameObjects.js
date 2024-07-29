"use strict";
/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Middleware used to sort children gameObjects (used in Scene and GameObject declarations)
 * @function
 */
function sortGameObjects(container) {
    container.gameObjects.sort((a, b) => {
        if (b.zIndex == a.zIndex) {
            if (b.y == a.y) {
                return a.x - b.x;
            }
            else {
                return a.y - b.y;
            }
        }
        else {
            return a.zIndex - b.zIndex;
        }
    });
    // TODO when parsing children after gameObjects it's like twice the job
    // but IF we want to parse children which are PIXI stuff that is added directly as child
    // we need container
    // so, remove container and let the dev choose the filtering OR remove the previous one and add a z conditional here ?
    if (container.children) {
        container.children.sort((a, b) => {
            if (b.zIndex == a.zIndex) {
                if (b.y == a.y) {
                    return a.x - b.x;
                }
                else {
                    return a.y - b.y;
                }
            }
            else {
                return a.zIndex - b.zIndex;
            }
        });
    }
    // Not doing anything ?
    // container._shouldSortChildren = false;
    container.emit('gameObjects-sorted');
}
exports.default = sortGameObjects;
