import { SupplierInterface } from "../components/types/supplierInterface";

export default function Client(props: { suppliers: SupplierInterface[] }) {
    return <>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>наименование</th>
                    <th>материалы</th>
                </tr>
            </thead>
            <tbody>
                {props.suppliers.map(supplier => <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.name}</td>
                    <td>{supplier.materials}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}