"use client"

import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { ColorPicker, useColor } from "react-color-palette";

import { api_host } from "@/lib/config";
import Sidebar from "../../components/Sidebar";
import FormMain from "@/app/components/FormMain";
import FormInput from "@/app/components/FormInput";
import FormSelect from "@/app/components/FormSelect";

import "react-color-palette/css";
import FormSubmit from "@/app/components/FormSubmit";
interface Props {
    params: {
        id: string;
    };
}

interface Option {
    label: string;
    value: string;
}

interface FormType {
    name: string;
    id: number;
    created_at: string;
}
const FormDetail: NextPage<Props> = () => {
    const params = useParams<{ id: string; }>()


    const [form, setForm] = useState<FormType>();
    const [tables, setTables] = useState<Option[]>([]);
    const [color, setColor] = useColor("#fff");
    const [border, setBorder] = useColor("#000");

    const getForms = async () => {
        const auth = window.localStorage.getItem("auth")
        const res = await fetch(`${api_host}/api/form/${params.id}`, {
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
            const dataTables = constructTables(data);
            setTables(dataTables);
        }
    }

    function capitalize(str: string) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const constructTables = (data: Array<string>) => {
        const table: Option[] = [];
        data.forEach((item) => {
            table.push({ label: capitalize(item), value: item })
        })

        return table;
    }

    useEffect(() => {
        getForms();
        getTables();
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const table = formData.get("table")?.toString() || "";
        const auth = window.localStorage.getItem("auth") || "";

        const res = await fetch(`${api_host}/api/set-tables`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            body: JSON.stringify({ table, bg_color: color.hex, border_color: border.hex, id: form?.id })
        })

        if (res.ok) {
            // redirect(`/dashboard/form/${params.id}`)
        }
    }

    return (
        <main className="p-4 bg-green-50 flex gap-8 items-start">
            <Sidebar />
            <div className="bg-white shadow-lg p-4 lg:p-8 rounded-3xl overflow-auto w-full">
                <h1 className="mb-4 text-xl font-bold">Generate Form {capitalize(form?.name || "")}</h1>
                <FormMain submit={handleSubmit}>
                    <FormSelect name="table" options={tables} label="Select Table" />
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="mb-4">
                            <FormInput label="Background Color" name="bg_color" value={color.hex} />
                            <ColorPicker hideInput={["rgb", "hsv"]} color={color} onChange={setColor} />
                        </div>
                        <div className="mb-4">
                            <FormInput label="Border Color" name="border_color" value={border.hex} />
                            <ColorPicker hideInput={["rgb", "hsv"]} color={border} onChange={setBorder} />
                        </div>
                    </div>
                    <FormSubmit />
                </FormMain>
            </div>
        </main>
    )
}

export default FormDetail