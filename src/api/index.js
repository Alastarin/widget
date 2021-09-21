import axios from 'axios';

import weatherService from '@/api/services/weather';

const baseDomain = process.env.VUE_APP_BASE_DOMAIN || 'https://api.openweathermap.org';

const baseURL = `${baseDomain}`;

const weatherApiKey = process.env.VUE_APP_API_WEATHER_KEY || 'e972a49186ef02ba199e9c5c5c6b6b90';

export default {
  createAxiosInstance({ baseURL }) {
    return axios.create({ baseURL });
  },
  initRequestInterceptors(axiosInstance) {
    axiosInstance.interceptors.request.use(async config => {

      if (!config.params['appid']) {
        config.params['appid'] = weatherApiKey;
      }
      return config;
    }, async error => {
      return Promise.reject(error);
    });
  },

  install(Vue) {
    const axiosClient = this.createAxiosInstance({ baseURL });
    this.initRequestInterceptors(axiosClient);
    const services = {
      weather: weatherService(axiosClient)
    };

    Vue.prototype.$services = services;
  }
};
