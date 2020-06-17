import * as axios from "axios";

const instance = axios.create({
        baseURL: 'https://api.datamuse.com/',
    }
);

export const DatamuseApi = {
    getSynonyms(word) {
        return instance.get(`words?ml=${word}`);
    }
}