import axios from "axios";

const api = axios.create({
  baseURL: "https://getcody.ai/api/v1",
  headers: {
    Authorization: "Bearer epP3aMR0IexOVRObuBP7FUXx9jcl41qHsi1k8p6U",
  },
});

api.interceptors.response.use(
  (response) => {
    if (response != null) {
      const {
        data,
        status,
        config: { url },
      } = response;
      console.log(url, `response [${status}]=>`, JSON.stringify(data, null, 2));
    }
    return response;
  },
  (error) => {
    let message = error.response?.message ?? error.message;
    switch (error.response?.status) {
      case 401:
        message = "Unauthorised Access. CodyAI key is not valid or expired.";
        break;
    }
    alert(message);
    if (error.response) {
      const {
        data,
        status,
        config: { url },
      } = error.response;
      console.log(`Error [${status}]`, url, JSON.stringify(data, null, 2));
    } else {
      console.log("Unknown Error in API Call: ", error.message);
    }
    throw error;
  }
);

export default api;
