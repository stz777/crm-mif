import dayjs from 'dayjs'

export default function Urgency(props: { deadline: any, done_at: any }) {
    const date1 = dayjs(props.deadline).set("hour", 0).set("minute", 0).add(1, "hours");
    const date2 = dayjs().set("hour", 0).set("minute", 0);
    const diffInDays = date1.diff(date2, 'day');
    const limit = 1;

    if (props.done_at) return <span className="badge text-bg-success">выполнено</span>
    if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
    if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
    return <>{diffInDays}</>
}