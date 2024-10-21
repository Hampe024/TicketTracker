import userModel from "../userModel.js";

export default class UserManager extends HTMLElement {
    constructor() {
        super();

        this.userInfo = {};
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
        newSubmit.setAttribute("value", "Make Account");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    makeError() {
        const errorBox = document.createElement("div");

        errorBox.id = "loginError";
        errorBox.innerHTML = `Could not find account`;
        return errorBox;
    }

    makeSelect(options, required, name) {
        const newSelect = document.createElement("select");
    
        newSelect.required = required;
        newSelect.classList.add("select");

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Role"
        defaultOption.disabled = true;
        defaultOption.selected = true;
        newSelect.appendChild(defaultOption);
    
        options.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue.toLowerCase();
            option.textContent = optionValue;
            newSelect.appendChild(option);
        });
    
        newSelect.addEventListener("change", (event) => {
            this.userInfo[name] = event.target.value;
        });
    
        return newSelect;
    }

    async render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Name"));
        form.appendChild(this.makeInput("name", true, "name"));
        form.appendChild(this.makeInputLabel("Email"));
        form.appendChild(this.makeInput("email", true, "email"));
        form.appendChild(this.makeInputLabel("User Role"));
        form.appendChild(this.makeSelect(["Customer", "Agent", "Admin"], true, "role"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (this.userInfo.role) {
                const result = await userModel.makeUser(this.userInfo.name, this.userInfo.email, this.userInfo.role, "password", true);
                //TODO: add password
                if (result.acknowledged) {
                    form.reset();
                    alert("Account successfully added!");
                } else {
                    alert("Could not create account!");
                }
            } else {
                alert("Please specify role");
            }
            
        });

        this.appendChild(this.makeError());
        this.appendChild(form);
    }
}
