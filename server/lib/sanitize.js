const sanitizeHtml = require('sanitize-html');

const sanitize = (str) => {
    const clean = sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} })

    return clean;
}

module.exports = {sanitize}