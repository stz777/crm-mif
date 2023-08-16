export default async function Page({ params }: { params: { id: number } }) {
    const { id } = params;

    return <>
        <h1>Заказ #{id}</h1>
    </>
}