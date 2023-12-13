import controls from '../../constants/controls';

const firstPlayer = [];
const secondPlayer = [];
function keyDown(e) {
    if (e === controls.PlayerOneAttack) {
        firstPlayer.push(e);
    }
}

function keyUp(e) {
    if (e === controls.PlayerOneAttack) {
        secondPlayer.push(e);
    }
}

export async function fight(firstFighter, secondFighter) {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        if (firstFighter.health === 0) {
            resolve(secondFighter);
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
        } else if (secondFighter.health === 0) {
            resolve(firstFighter);
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
        }
    });
}

export function getDamage(attacker, defender) {
    // return damage
    return { ...attacker, ...defender };
}

export function getHitPower(fighter) {
    // return hit power
    return { ...fighter };
}

export function getBlockPower(fighter) {
    // return block power
    return { ...fighter };
}
