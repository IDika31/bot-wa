const formatPhone = require('libphonenumber-js')
const countries = require('./countries.json')
const a = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./|\\\'"=<>?:;{}[]+-_()*&^%$#@!`~';

String.prototype.forEach = function (callbackfn) {
    this.split('').forEach(x => callbackfn(x))
}

String.prototype.format = function () {
    const angka = parseInt(this)

    return angka.format()
}

Number.prototype.format = function () {
    const angka = this.valueOf()
    if (angka < 1 || !angka) return 0
    if (typeof angka === 'string') angka = Number(angka)
    
    const number_string = angka.toString().replace(/[^,\d]/g, '')
    let split = number_string.split(',')
    let sisa = split[0].length % 3
    let number = split[0].substr(0, sisa)
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if(ribuan){
        separator = sisa ? '.' : '';
        number += separator + ribuan.join('.');
    }

    number = split[1] != undefined ? number + ',' + split[1] : number;
    return number
};

Array.prototype.page = function (itemPerPage = 10, page = 1) {
    const array = this

    const maxPage = Math.ceil(array.length / itemPerPage)
    if (page > maxPage || page < 1) return null

    return array.slice((page - 1) * itemPerPage, page * itemPerPage)
};

String.prototype.encode = function() {
    const t = this;
    const d = [];

    for (let i = 0; i < t.length; i++) {
        const s = a.indexOf(t[i]) * 2;

        if (s > a.length) {
            d.push(a[s - a.length]);
        } else {
            d.push(a[s]);
        }
    }

    return d.join('');
};

String.prototype.decode = function() {
    const t = this;
    const d = [];

    for (let i = 0; i < t.length; i++) {
        const s = a.indexOf(t[i]) / 2;

        if (s % 2 === 0 || s % 2 === 1) {
            d.push(a[s]);
        } else if (s % 2 === 0.5 || s % 2 === 1.5) {
            const b = ' ' + a.split('').reverse().join('').replace(/ /, '');
            const j = b.indexOf(t[i]) / 2;

            d.push(b[j]);
        }
    }

    return d.join('');
};

const formatPhoneNumber = (phoneNumber = '') => {
    if (!phoneNumber.startsWith('+')) phoneNumber = '+' + phoneNumber

    const data = countries.filter((v, i, a) => a.findIndex(t => (t.dial_code === v.dial_code)) === i)

    const country = data.find(country => phoneNumber.startsWith(country.dial_code))
    const formatedNumber = formatPhone.parsePhoneNumber(phoneNumber, country.code)

    return formatedNumber.formatInternational()
}

module.exports = {
    formatPhoneNumber
}