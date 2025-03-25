import Parse from 'parse/dist/parse.min.js';

const app_id = import.meta.env.VITE_PARSE_APP_ID;
const host_url = import.meta.env.VITE_PARSE_HOST_URL;
const javascript_key = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY;

Parse.initialize(app_id, javascript_key);
Parse.serverURL = host_url;

export default Parse;