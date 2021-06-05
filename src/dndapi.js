const fetch = require('node-fetch');

const baseurl = 'https://www.dnd5eapi.co/api';
/**
 * 
 * @param {string} url 
 */
const dndapi = async (url) => {
    const e = fetch(`${baseurl}${url.startsWith('/') ? url : `/${url}`}`)
    .then(res => res.json())
    return Promise.resolve(e);
};

module.exports = dndapi;