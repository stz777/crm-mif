import dayjs from "dayjs";

export default function TaskStatus(props: { deadline: any }) {
  let isLate = dayjs().isAfter(props.deadline);
  return (
    <div>
      <div
        style={{ width: 102 }}
        className={isLate ? "bg-danger p-1" : "bg-warning p-1"}
      >
        {isLate ? "Просрочено" : "В работе"}
      </div>
    </div>
  );
}
