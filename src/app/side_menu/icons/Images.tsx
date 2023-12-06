import Image from "next/image"
import LeadsIcon from "./leads.svg"
import TasksIcon from "./tasks.svg"
import ExpensesIcon from "./expenses.svg"
import StockIcon from "./stock.svg"
import SuppliersIcon from "./suppliers.svg"
import ClientsIcon from "./clients.svg"
import EmployeesIcon from "./employees.svg"
import ReportIcon from "./report.svg"

export default {
    leads: <Image src={LeadsIcon} alt="МотоХит" width={24} />,
    tasks: <Image src={TasksIcon} alt="МотоХит" width={24} />,
    expenses: <Image src={ExpensesIcon} alt="МотоХит" width={24} />,
    stock: <Image src={StockIcon} alt="МотоХит" width={24} />,
    suppliers: <Image src={SuppliersIcon} alt="МотоХит" width={24} />,
    clients: <Image src={ClientsIcon} alt="МотоХит" width={24} />,
    employees: <Image src={EmployeesIcon} alt="МотоХит" width={24} />,
    report: <Image src={ReportIcon} alt="МотоХит" width={24} />,
}
