function conversion(number) {
    const convertNumber = number.replace(/\D/g, '');
    if (!(convertNumber.length === 11 || convertNumber.length === 10)) {
        return false
    }
    if (convertNumber.startsWith('7')) {
        return '8' + convertNumber.slice(1);
    }

    return convertNumber;
}

module.exports = { conversion }