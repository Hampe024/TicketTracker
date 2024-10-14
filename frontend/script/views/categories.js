export default class Categories extends HTMLElement {
    constructor() {
        super();
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
            if (this.userInfo.role) {
                const result = await userModel.makeUser(this.userInfo.name, this.userInfo.email, this.userInfo.role);
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

        this.appendChild(form);
    }
}
