"use client"

import { NextPage } from "next";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { api_host } from "@/lib/config";
import FormMain from "@/app/components/FormMain";

interface Props {
    params: {
        id: string;
    };
}

interface FormType {
    name: string;
    id: number;
    created_at: string;
}
const FormDetail: NextPage<Props> = ({ params }) => {
    const { id } = params;
    const [form, setForm] = useState<FormType>();
    const [tables, setTables] = useState([]);

    const getForms = async () => {
        const auth = window.localStorage.getItem("auth")
        const res = await fetch(`${api_host}/api/form/${id}`, {
            headers: {
                'Authorization': `${auth}`
            }
        })

        if (res.ok) {
            const data = await res.json();
            setForm(data[0]);
        }
    }

    const getTables = async () => {
        const auth = window.localStorage.getItem("auth")
        const res = await fetch(`${api_host}/api/tables`, {
            headers: {
                'Authorization': `${auth}`
            }
        })

        if (res.ok) {
            const data = await res.json();
            setTables(data);
        }
    }

    useEffect(() => {
        getForms();
        getTables();
    }, [])

    console.log(tables);

    return (
        <main className="p-4 bg-green-50 flex gap-8 items-start">
            <Sidebar />
            <div className="bg-white shadow-lg p-4 lg:p-8 rounded-3xl overflow-auto w-full">
                <h1 className="mb-4 text-xl font-bold">Form {form?.name}</h1>
                <FormMain submit={handleSubmit}>

                </FormMain>
            </div>
        </main>
    )
}

export default FormDetail