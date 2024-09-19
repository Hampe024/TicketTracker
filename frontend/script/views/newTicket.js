export default class NewTicket extends HTMLElement {
    constructor() {
        super();
        this.ticketinfo = {};
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

    makeInputLabel(text) {
        const newInputLabel = document.createElement("p");

        newInputLabel.classList.add("input-label");
        newInputLabel.innerHTML = text;
        return newInputLabel;
    }

    makeSubmit() {
        const newSubmit = document.createElement("input");

        newSubmit.setAttribute("type", "submit");
        newSubmit.setAttribute("value", "Submit");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Describe the problem you are facing"));
        form.appendChild(this.makeInput("textarea", true, "description"));
        //add image / attatchment
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            // save ticket to mongo
            location.hash = "";
        });

        this.appendChild(form);
    }
}
