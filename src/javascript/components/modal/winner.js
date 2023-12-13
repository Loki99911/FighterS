import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const title = 'Winner';
    const onClose = () => {};
    const bodyElement = createFighterImage(fighter);
    bodyElement.classList.add('fighter-preview___img');
    showModal({ title, bodyElement, onClose });
}
