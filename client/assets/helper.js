function capitalizeFirstLetter(str) {
    if (!str) return str; // Return the original string if it's empty or not provided
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = capitalizeFirstLetter; // For Node.js
export default capitalizeFirstLetter; // For ES6 modules in React