function shorten(str, count) {
    return str.slice(0, count || 5);
}

module.exports = shorten