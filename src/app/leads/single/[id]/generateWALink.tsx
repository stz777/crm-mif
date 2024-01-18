export function GenerateWALink(props: { phoneNumber: string }) {
    const толькоЦифры = props.phoneNumber.replace(/\D/g, '');
    if (толькоЦифры.length === 11) {
        return <a className="text-decoration-none fw-bold " href={`https://wa.me/${'7' + толькоЦифры.slice(1)}`}>{addSpacesToPhoneNumber(props.phoneNumber)} </a>;
    } else if (толькоЦифры.length === 10) {
        return <a className="text-decoration-none fw-bold " href={`https://wa.me/${'7' + толькоЦифры.slice(1)}`}> {addSpacesToPhoneNumber(props.phoneNumber)} </a>;
    } else {
        return <>Некорректный номер телефона {props.phoneNumber} {JSON.stringify(props.phoneNumber)}</>;
    }
}

function addSpacesToPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    phoneNumber = phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
    return phoneNumber;
}