export default class NotFound extends HTMLElement {
    constructor() {
        super();
    }

    // connect component
    connectedCallback() {
        this.innerHTML = `
            404 not found

            Could not find route ${location.hash}
        `;
    }
}
