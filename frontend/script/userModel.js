const userModel = {
    APIURL: "http://localhost:3000/",  

    fetcher: async (dataPoint) => {
        const response = await fetch(`${userModel.APIURL}${dataPoint}`);
        const result = await response.json();

        return result.result;
    },

    getUserById: async (userId) => {
        const response = await fetch(`${userModel.APIURL}user/?query=${{ "_id": userId }}`);
        const result = await response.json();

        return result.result;
    },

    login: async (email) => {
        const query = JSON.stringify({ email: email });
        const response = await fetch(`${userModel.APIURL}user/?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        return result.result;
    }

}

export default userModel;