export function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

export const istDate = (d) => {
    var dateUTC = new Date(d + '.000Z');
    var dateUTCTime = dateUTC.getTime();
    var dateIST = new Date(dateUTCTime);
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST;
};

export const replaceTnZfromDate = (d) => {
    return d?.toISOString().replace('T', ' ').split('.')[0];
};

export const replaceTfromDate = (d) => {
    return d?.replace('T', ' ').split('.')[0];
    // return d.replace('T', ' ').split('.')[0];
};

export const reduceHoursMins = (d, h, m) => {
    var dateUTC = new Date(d + '.000Z');
    var dateUTCTime = dateUTC.getTime();
    var dateIST = new Date(dateUTCTime);
    dateIST.setHours(dateIST.getHours() - h);
    dateIST.setMinutes(dateIST.getMinutes() - m);
    return dateIST;
};

export const stringToDateTime = (d) => {
    const v = d && d.toString();
    return typeof v === 'string' ? (v.substring(0, 4) + '-' + v.substring(5, 7) + '-' + v.substring(7, 9) + ' ' + '00:00') : null;
};

export const stringToDateTime_EPDCL = (d) => {
    const v = d && d.toString();
    return typeof v === 'string' ? (v.substring(8, 10) + '-' + v.substring(5, 7) + '-' + v.substring(0, 4) + ' ' + v.substring(11, v.length)) : null;
};


