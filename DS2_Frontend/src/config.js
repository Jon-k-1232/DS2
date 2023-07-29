import TokenService from './Services/TokenService';

const config = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000',
  FRONT_WEB: process.env.REACT_APP_FRONT_WEB || '*',
  API_TOKEN: '',
  JWT_TOKEN: `bearer ${TokenService.getAuthToken()}`,
  DISPLAY_NAME: process.env.REACT_APP_DISPLAY_NAME || ''
};

export default config;
