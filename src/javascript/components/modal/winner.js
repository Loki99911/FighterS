import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const { name } = fighter;
    const title = `${name} won!!!`;
    const onClose = () => {
        window.location.reload();
    };
    const bodyElement = createFighterImage(fighter);
    bodyElement.classList.remove('fighter-preview___img');
    showModal({ title, bodyElement, onClose });
}
