import axios from "axios";
import store from "@/store";
import TokenService from "@/services/storage.service";

const ApiService = {
  _401interceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  },

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  patch(resource, data) {
    return axios.patch(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.request.status == 401) {
          if (error.config.url.includes("/auth/jwt/create")) {
            // Refresh token has failed. Logout the user
            store.dispatch("auth/logout");
            throw error;
          } else {
            // Refresh the access token
            try {
              await store.dispatch("auth/refreshToken");
              // Retry the original request
              console.log(error);
              return this.customRequest({
                method: error.config.method,
                url: error.config.url,
                data: JSON.parse(error.config.data)
              });
            } catch (e) {
              // Refresh has failed - reject the original request
              throw error;
            }
          }
        }

        // If error was not 401 just reject as is
        throw error;
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
