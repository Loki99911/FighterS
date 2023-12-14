import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const { name, health, attack, defense } = fighter;
        const fiterImg = createFighterImage(fighter);
        // fiterImg.classList.add('fighter-preview___img');
        if (position === 'right') {
            fiterImg.classList.add('fighter-preview___mirror');
        }
        const nameInfoElement = document.createElement('h3');
        nameInfoElement.textContent = name;
        const healthInfoElement = document.createElement('p');
        healthInfoElement.textContent = `Health: ${health}`;
        const attackInfoElement = document.createElement('p');
        attackInfoElement.textContent = `Attack: ${attack}`;
        const defenseInfoElement = document.createElement('p');
        defenseInfoElement.textContent = `Defense: ${defense}`;
        fighterElement.append(nameInfoElement, healthInfoElement, attackInfoElement, defenseInfoElement, fiterImg);
    }
    return fighterElement;
}
