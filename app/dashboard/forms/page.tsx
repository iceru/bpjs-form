"use client";

import { api_host } from "@/lib/config";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import moment from "moment";

interface FormType {
    name: string;
    id: number;
    created_at: string;
}
export default function Forms() {
    const [forms, setForms] = useState<FormType[]>([]);
    const getForms = async () => {
        const auth = window.localStorage.getItem("auth")
        const res = await fetch(`${api_host}/api/forms`, {
            headers: {
                'Authorization': `${auth}`
            }
        })

        if (res.ok) {
            const data = await res.json();
            setForms(data);
        }
    }

    useEffect(() => {
        getForms();
    }, [])

    const thTable = ["No", "Name", "Date Creation", "Action"];

    return (
        <main className="p-4 bg-green-50 flex gap-8 items-start">
            <Sidebar />
            <div className="bg-white shadow-lg p-4 rounded-3xl overflow-auto w-full">
                <h1 className="mb-4 text-xl font-bold">Forms</h1>
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                        <tr className="bg-green-700 text-white">
                            {thTable.map((th, index) => {
                                return (
                                    <th key={index} className="p-4 text-left text-sm font-medium uppercase">{th}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form: FormType, index: number) => (
                            <tr key={index} className="odd:bg-gray-100 hover:bg-gray-200 transition">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4">{form.name}</td>
                                <td className="p-4">{form.created_at ? moment(form.created_at).format('LL') : '-'}</td>
                                <td className="p-4">
                                    <a href={`/dashboard/forms/${form.id}`}>
                                        Detail
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}