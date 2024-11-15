"use client";

import { api_host } from "@/lib/config";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import moment from "moment";

interface UserType {
    name: string;
    created_at: string;
    email: string;
}
export default function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const getUsers = async () => {
        const auth = window.localStorage.getItem("auth")
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

    useEffect(() => {
        getUsers();
    }, [])
    return (
        <main className="p-4 bg-green-50 flex gap-8 items-start">
            <Sidebar />
            <div className="bg-white shadow-lg p-4 rounded-3xl overflow-auto w-full">
                <h1 className="mb-4 text-xl font-bold">Users</h1>
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                        <tr className="bg-green-700 text-white">
                            <th className="p-4 text-left text-sm font-medium uppercase">No</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Name</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Email</th>
                            <th className="p-4 text-left text-sm font-medium uppercase">Date Creation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: UserType, index: number) => (
                            <tr key={index} className="odd:bg-gray-100 hover:bg-gray-200 transition">
                                <td className="p-4 capitalize">{index + 1}</td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.created_at ? moment(user.created_at).format('LL') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}