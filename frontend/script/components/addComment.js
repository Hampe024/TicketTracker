import userModel from "../userModel.js";
import ticketModel from "../ticketModel.js";

export default class AddComment extends HTMLElement {
    constructor() {
        super();

        this.userInfo = {};
    }

    static get observedAttributes() {
        return ['ticket'];
    }

    get ticket() {
        return JSON.parse(this.getAttribute("ticket"));
    }

    // connect component
    connectedCallback() {
        this.render();
    }

    makeInput(type, required, name) {
        const newInput = document.createElement("input");

        newInput.setAttribute("type", type);
        newInput.required = required;
        newInput.classList.add("input");

        newInput.addEventListener("input", (event) => {
            this.userInfo[name] = event.target.value;
        });

        return newInput;
    }

    makeSubmit() {
        const newSubmit = document.createElement("input");

        newSubmit.setAttribute("type", "submit");
        newSubmit.setAttribute("value", "Reply");
        newSubmit.classList.add("button");
        newSubmit.classList.add("msg-btb");
        return newSubmit;
    }

    async getCurrentDate() {
        const currentDate = new Date();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${hours}:${minutes}:${seconds} - ${day} - ${month} - ${year}`;
    }

    render() {
        console.log(this.ticket)
        const form = document.createElement("form");

        form.appendChild(this.makeInput("text", true, "text"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const user = await userModel.getUserById(localStorage.getItem("userId"));
            console.log(user)
            const newComment = {
                "time": await this.getCurrentDate(),
                "msg": this.userInfo.text,
                "sender": user.role
            }
            const oldComments = this.ticket.comment;
            const totComments = [...oldComments, newComment];
            await ticketModel.addComment(this.ticket._id, totComments);
            form.reset();
        });

        this.appendChild(form);
    }
}

