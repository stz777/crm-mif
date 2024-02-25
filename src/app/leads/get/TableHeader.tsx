export default function TableHeader(props: { is_archive: boolean }) {
    return <thead className="sticky-top">
        <tr className="bordered">
            <th>ID</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Клиент</th>
            <th>Создан</th>
            <th>Дедлайн</th>
            {/* <th>Срочность</th> */}
            {<th>Оплата, ₽</th>}
            {props.is_archive && <th>выполнен</th>}
        </tr>
    </thead>
}