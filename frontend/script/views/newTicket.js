import ticketModel from "../ticketModel.js";

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
            this.ticketinfo[name] = event.target.value;
        });

        return newInput;
    }

    makeSelect(options, required, name) {
        const newSelect = document.createElement("select");
    
        newSelect.required = required;
        newSelect.classList.add("select");
    
        options.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;
            newSelect.appendChild(option);
        });
    
        newSelect.addEventListener("change", (event) => {
            this.ticketinfo[name] = event.target.value;
        });
    
        return newSelect;
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

    async render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Title"));
        form.appendChild(this.makeInput("text", true, "title"));
        form.appendChild(this.makeInputLabel("Describe the problem you are facing"));
        form.appendChild(this.makeInput("textarea", true, "description"));
        form.appendChild(this.makeInputLabel("Category"));
        form.appendChild(this.makeSelect(["Unknown", "Database", "Network", "Account", "Security"], false, "category"));
        form.appendChild(this.makeInputLabel("Department"));
        form.appendChild(this.makeSelect(["Unknown", "Software", "Hardware", "HR", "Legal"], false, "department"));
        //TODO: image / attatchment
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const success = await ticketModel.newTicket(this.ticketinfo);
            if (success) {
                //console.log("Ticket successfully created")
                location.hash = "";
            } else {
                //console.warning("Could not create ticket")
            }
        });

        this.appendChild(form);
    }
}
