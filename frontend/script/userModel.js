const userModel = {
    APIURL: "http://localhost:3000/",  

    fetcher: async (dataPoint) => {
        const response = await fetch(`${userModel.APIURL}${dataPoint}`);
        const result = await response.json();

        return result.result;
    },

    getUserById: async (userId) => {
        const query = JSON.stringify({ "_id" : userId });
        const response = await fetch(`${userModel.APIURL}user/?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        return result.result;
    },

    getUserRole: async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) { console.error("userId not defined") }
        const user = await userModel.getUserById(userId);
        // console.log(user)
        return user.role
    },

    login: async (email, password="") => {
        const query = JSON.stringify({ email: email });
        const response = await fetch(`${userModel.APIURL}user/login/?email=${encodeURIComponent(query)}&password=${password}`);
        const result = await response.json();

        return result.result;
    },

    makeUser: async (name, email, role, password, firstTimeLogIn) => {
        const body = {
            "name": name,
            "email": email,
            "role": role,
            "password": password,
            "firstTimeLogIn": firstTimeLogIn
        }
        const response = await fetch(`${userModel.APIURL}user`, {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });
        const result = await response.json();

        return result.result;
    }

}

export default userModel;