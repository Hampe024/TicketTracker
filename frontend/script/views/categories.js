import ticketModel from "../ticketModel.js";

export default class Categories extends HTMLElement {
    constructor() {
        super();

        this.category = "";
    }

    // connect component
    connectedCallback() {
        this.render()
    }

    makeInput(type, required, name) {
        const newInput = document.createElement("input");

        newInput.setAttribute("type", type);
        newInput.required = required;
        newInput.classList.add("input");
        newInput.addEventListener("input", (event) => {
            this.category = event.target.value;
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
        newSubmit.setAttribute("value", "Make category");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Category"));
        form.appendChild(this.makeInput("name", true, "name"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const result = await ticketModel.makeCategory(this.category);
            if (result) {
                form.reset();
                // alert("Category successfully added!");
            } else {
                // alert("Could not create category!");
            }
        });

        this.appendChild(form);
    }
}
