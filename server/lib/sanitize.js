const sanitizeHtml = require('sanitize-html');

const sanitize = (str) => {

    let clean = str;
    clean = clean.replace(/<(?:.|\n)*?>/gm, "\n");
    clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2}/ig, "\n");
    
    return clean;
    
    //! sanitizeHtml! 지우지 마세요!
    // const clean = sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} })
}

module.exports = {sanitize}