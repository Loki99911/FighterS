import controls from '../../constants/controls';

const keydownState = new Set();

export function getHitPower(fighter) {
    // return hit power
    const { attack } = fighter;
    const criticalHitChance = Math.random() + 1;
    const power = attack * criticalHitChance;
    return power;
}

export function getBlockPower(fighter) {
    // return block power
    const { defense } = fighter;
    const dodgeChance = Math.random() + 1;
    const power = defense * dodgeChance;
    return power;
}

export function getDamage(attacker, defender) {
    // return damage
    const hit = getHitPower(attacker);
    const block = defender ? getBlockPower(defender) : 0;
    const result = hit - block;
    return result > 0 ? result : 0;
}

export function getCriticalDamage(attacker) {
    // return damage
    const { attack } = attacker;
    return attack * 2;
}
function keyUp(e) {
    keydownState.delete(e.code);
}

function keyDown(e, firstFighter, secondFighter, resolve, changeFirstFighter, changeSecondFighter) {
    keydownState.add(e.code);
    // Do normal hit by first player
    if (keydownState.has(controls.PlayerOneAttack) && !keydownState.has(controls.PlayerOneBlock)) {
        let damage = getDamage(firstFighter, null);
        if (keydownState.has(controls.PlayerTwoBlock)) {
            damage = getDamage(firstFighter, secondFighter);
        }
        changeSecondFighter(damage);
    }
    // Do critical hit by first player
    if (controls.PlayerOneCriticalHitCombination.every(elem => keydownState.has(elem))) {
        const damage = getCriticalDamage(firstFighter);
        changeSecondFighter(damage);
    }
    // Do normal hit by second player
    if (keydownState.has(controls.PlayerTwoAttack) && !keydownState.has(controls.PlayerTwoAttack)) {
        let damage = getDamage(secondFighter, null);
        if (keydownState.has(controls.PlayerOneBlock)) {
            damage = getDamage(secondFighter, firstFighter);
        }
        changeFirstFighter(damage);
    }
    // Do critical hit by second player
    if (controls.PlayerTwoCriticalHitCombination.every(elem => keydownState.has(elem))) {
        const damage = getCriticalDamage(secondFighter);
        changeFirstFighter(damage);
    }
    // Check the winner
    if (firstFighter.health <= 0) {
        resolve(secondFighter);
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    } else if (secondFighter.health <= 0) {
        resolve(firstFighter);
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }
}

export async function fight(firstFighter, secondFighter) {
    const currentFirstFighter = { ...firstFighter };
    const currentSecondFighter = { ...secondFighter };
    const changeFirstFighter = damage => {
        currentFirstFighter.health -= damage;
        // console.log(currentFirstFighter, damage);
    };
    const changeSecondFighter = damage => {
        currentSecondFighter.health -= damage;
        // console.log(currentSecondFighter, damage);
    };
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        document.addEventListener('keydown', e =>
            keyDown(e, currentFirstFighter, currentSecondFighter, resolve, changeFirstFighter, changeSecondFighter)
        );
        document.addEventListener('keyup', keyUp);
    });
}
