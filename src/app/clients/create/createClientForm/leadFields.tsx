import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

export default function LeadFields(props: {
    control: any
    register: any
}) {
    const { control, register } = props;
    return <>
        <FieldWrapper title="Дедлайн"
            field={<>
                <Controller
                    control={control}
                    name="deadline"
                    render={({ field }) => (
                        <DatePicker
                            locale="ru"
                            {...field}
                            dateFormat="dd.MM.yyyy"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            placeholderText="выберите дату"
                        />
                    )}
                />
            </>}
        />

        <FieldWrapper title="Описание"
            field={<>
                <textarea {...register("description")} autoComplete="off" />
            </>}
        />

        <FieldWrapper title="Сумма заказа"
            field={<>
                <input type="number" {...register("sum")} autoComplete="off" />
            </>}
        />
    </>
}