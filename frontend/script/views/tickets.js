import ticketModel from "../ticketModel.js";

export default class Tickets extends HTMLElement {
    constructor() {
        super();
        this.tickets = []
    }

    // connect component
    async connectedCallback() {
        this.tickets = await ticketModel.fetcher("tickets")
        console.log(this.tickets)
        this.render();
    }
    render() {
        
    }
}
