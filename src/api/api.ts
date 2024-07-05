export class Api {


    async get(path: string) {
        let response = await fetch(location.origin + path);
        let data = await response.json();
        return data;
    }

}

export let api = new Api();