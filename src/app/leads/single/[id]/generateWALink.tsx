export function GenerateWALink(props: { phoneNumber: string }) {
    const толькоЦифры = props.phoneNumber.replace(/\D/g, '');
    if (толькоЦифры.length === 11) {
        return <a href={`https://wa.me/${'7' + толькоЦифры.slice(1)}`}> {props.phoneNumber} </a>;
    } else if (толькоЦифры.length === 10) {
        return <a href={`https://wa.me/${'7' + толькоЦифры.slice(1)}`}> {props.phoneNumber} </a>;
    } else {
        return <>Некорректный номер телефона {props.phoneNumber}</>;
    }
}