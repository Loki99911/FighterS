import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #getInfoEndpoint = '';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
        this.#getInfoEndpoint = `details/fighter/${id}.json`;
        try {
            const apiResult = await callApi(this.#getInfoEndpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
