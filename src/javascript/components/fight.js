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

function keyDown(
    e,
    firstFighter,
    secondFighter,
    resolve,
    changeFirstFighter,
    changeSecondFighter,
    firstFighterCritTime,
    secondFighterCritTime,
    changeFirstFighterCritTime,
    changeSecondFighterCritTime
) {
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
    if (controls.PlayerOneCriticalHitCombination.every(elem => keydownState.has(elem)) && !firstFighterCritTime) {
        const damage = getCriticalDamage(firstFighter);
        changeSecondFighter(damage);
        changeFirstFighterCritTime();
    }
    // Do normal hit by second player
    if (keydownState.has(controls.PlayerTwoAttack) && !keydownState.has(controls.PlayerTwoBlock)) {
        let damage = getDamage(secondFighter, null);
        if (keydownState.has(controls.PlayerOneBlock)) {
            damage = getDamage(secondFighter, firstFighter);
        }
        changeFirstFighter(damage);
    }
    // Do critical hit by second player
    if (controls.PlayerTwoCriticalHitCombination.every(elem => keydownState.has(elem)) && !secondFighterCritTime) {
        const damage = getCriticalDamage(secondFighter);
        changeFirstFighter(damage);
        changeSecondFighterCritTime();
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
    const firstFighterDom = document.getElementById('left-fighter-indicator');
    const secondFighterDom = document.getElementById('right-fighter-indicator');
    let firstFighterCritTime = 0;
    let secondFighterCritTime = 0;

    setInterval(() => {
        firstFighterCritTime = Math.max(0, firstFighterCritTime - 1000);
        secondFighterCritTime = Math.max(0, secondFighterCritTime - 1000);
        firstFighterDom.innerText = firstFighterCritTime ? `${firstFighterCritTime / 1000}s` : '';
        secondFighterDom.innerText = secondFighterCritTime ? `${secondFighterCritTime / 1000}s` : '';
    }, 1000);

    const changeFirstFighter = damage => {
        currentFirstFighter.health -= damage;
        firstFighterDom.style.width = `${(currentFirstFighter.health * 100) / firstFighter.health}%`;
    };

    const changeSecondFighter = damage => {
        currentSecondFighter.health -= damage;
        secondFighterDom.style.width = `${(currentSecondFighter.health * 100) / secondFighter.health}%`;
    };

    const changeFirstFighterCritTime = () => {
        firstFighterCritTime = 10000;
    };

    const changeSecondFighterCritTime = () => {
        secondFighterCritTime = 10000;
    };

    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        document.addEventListener('keydown', e =>
            keyDown(
                e,
                currentFirstFighter,
                currentSecondFighter,
                resolve,
                changeFirstFighter,
                changeSecondFighter,
                firstFighterCritTime,
                secondFighterCritTime,
                changeFirstFighterCritTime,
                changeSecondFighterCritTime
            )
        );
        document.addEventListener('keyup', keyUp);
    });
}
