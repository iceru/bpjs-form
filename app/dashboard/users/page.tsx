"use client";

import { api_host } from "@/lib/config";
import Sidebar from "../components/Sidebar";
import { FormEvent, useEffect, useState } from "react";
import moment from "moment";
import FormMain from "@/app/components/FormMain";
import FormSelect from "@/app/components/FormSelect";
import FormSubmit from "@/app/components/FormSubmit";

interface UserType {
    name: string;
    created_at: string;
    email: string;
    id: string;
    form_id: string;
}

interface Options {
    label: string;
    value: string;
}

interface Form {
    name: string;
    id: string;
}
export default function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [forms, setForms] = useState<Form[]>([]);

    const auth = window.localStorage.getItem("auth")
    const getUsers = async () => {
        const res = await fetch(`${api_host}/api/users`, {
            headers: {
                'Authorization': `${auth}`
            }
        })

        if (res.ok) {
            const data = await res.json();
            setUsers(data);
        }
    }

    const getForms = async () => {
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

    const constructUsers = (users: UserType[]) => {
        const data: Options[] = []
        users?.forEach((user: UserType) => {
            data.push({ label: user.name, value: user.id })
        });
        return data;
    }
    const constructForms = (forms: Form[]) => {
        const data: Options[] = []
        forms?.forEach((form: Form) => {
            data.push({ label: form.name, value: form.id })
        });
        return data;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const id = formData.get("user")?.toString() || users[0].id || "";
        const formId = formData.get("form")?.toString() || forms[0].id || "";

        const res = await fetch(`${api_host}/api/update-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${auth}`,
            },
            body: JSON.stringify({ id, formId })
        })

        if (res.ok) {
            window.location.reload();
        }
    }

    useEffect(() => {
        getUsers();
        getForms();
    }, [])
    return (
        <main className="p-4 bg-green-50 flex gap-8 items-start">
            <Sidebar />
            <div className="bg-white shadow-lg p-4 rounded-3xl overflow-auto w-full">
                <h1 className="mb-4 text-xl font-bold">Users</h1>
                <div className="mb-4">
                    <FormMain submit={handleSubmit}>
                        <FormSelect name="user" label="User" options={constructUsers(users)} />
                        <FormSelect name="form" label="Form" options={constructForms(forms)} />
                        <FormSubmit />
                    </FormMain>
                </div>
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                        <tr className="bg-green-700 text-white">
                            <th className="p-4 text-left text-sm font-medium uppercase">No</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Name</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Email</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Form Id</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Date Creation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: UserType, index: number) => (
                            <tr key={index} className="odd:bg-gray-100 hover:bg-gray-200 transition">
                                <td className="p-4 capitalize">{index + 1}</td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.form_id}</td>
                                <td className="p-4 capitalize">{user.created_at ? moment(user.created_at).format('LL') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}