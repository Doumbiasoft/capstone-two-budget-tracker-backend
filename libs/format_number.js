function addCommas(number) {
    //Check if the passed down parameters is a number type
    if (typeof number === 'number') {
        //Check if number param is a number
        if (Number.isInteger(number)) {
            /* toLocaleString() is a built-in method in JavaScript
                that's primarily used to format numbers, dates, and times
                into a locale-specific string representation. 
                The "locale" refers to a specific region or language, 
                and the function takes into account 
                the conventions of that locale when formatting the value.
             */
            return number.toLocaleString();
        } else {
            //Split the number string by dot '.' to separate the integer part and the decimal part
            const parts = number.toString().split('.');
            //Now applying toLocaleString() to the integer part
            const integerPart = parseInt(parts[0]).toLocaleString();
            //Check if there is a decimal part in the number passed down then, add it to the integer part and return the result
            return integerPart + (parts[1] ? '.' + parts[1] : '');
        }
    } else {
        return 'Invalid input';
    }
}

module.exports = addCommas;