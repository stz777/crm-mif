"use client"

import { useState } from "react";
import { EmployeeInterface } from "./types";
import { toast } from "react-toastify";
import SideModal from "@/components/SideModal/SideModal";

export default function EmployeeTr(props: {
    employee: EmployeeInterface,
    children: any;
}) {
    const [is_open, setIsOpen] = useState(false);
    return <>
        <tr onClick={() => {
            setIsOpen(true);

        }}>
            {props.children}
            <td>
                <SideModal isOpen={is_open}
                    closeHandle={() => {
                        // alert();
                        // closeModal();
                    }}
                >
                    <>

                        {/* <SupplierDetails employee={props.employee} close={closeModal} /> */}
                    </>
                </SideModal>
            </td>
        </tr>
    </>
}