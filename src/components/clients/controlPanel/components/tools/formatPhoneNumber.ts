export function formatPhoneNumber(phone: string) {
    let newStr = "";
    const onlyNumbers = phone.replace(/[^0-9]/igm, "");

    const first = onlyNumbers.slice(0, 3);
    const second = onlyNumbers.slice(3, 6);
    const third = onlyNumbers.slice(6, 8);
    const fourth = onlyNumbers.slice(8, 10);

    if (first.length) newStr += `${first}`;
    if (second.length) newStr += ` ${second}`;
    if (third.length) newStr += ` ${third}`;
    if (fourth.length) newStr += ` ${fourth}`;

    return newStr;
}