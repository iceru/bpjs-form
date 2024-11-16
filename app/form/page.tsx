"use client"

import { api_host } from "@/lib/config"
import { useEffect, useState } from "react"
import FormMain from "../components/FormMain"
import FormInput from "../components/FormInput";
import FormTextarea from "../components/FormTextarea";
import FormSubmit from "../components/FormSubmit";

interface FormType {
    form_type: string;
    type: string;
    bg_color: string;
    id: number | string;
    border_color: string;
    label: string;
    table: string;
}

export default function Forms() {
    const [forms, setForms] = useState([])
    const [bgColor, setBgColor] = useState("#fff")
    const [borderColor, setBorderColor] = useState("#000")
    const [table, setTable] = useState("");

    const getGeneratedForms = async () => {
        const auth = window.localStorage.getItem("auth");
        const userId = window.localStorage.getItem("userId");
        const res = await fetch(`${api_host}/api/generate-form`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth || ""
            },
            body: JSON.stringify({ id: userId })
        })
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                setForms(data);
                setBgColor(data[0].bg_color);
                setBorderColor(data[0].border_color);
                setTable(data[0].table);
            }
        }
    }

    useEffect(() => {
        getGeneratedForms();
    }, [])


    function updateLabel(str: string) {
        if (!str) return '';

        const cleanedStr = str.replace(/_/g, ' ');
        return cleanedStr.charAt(0).toUpperCase() + cleanedStr.slice(1).toLowerCase();
    }

    const checkFormType = (form: FormType) => {
        console.log(form);
        console.log(table);
        let input;
        switch (form.form_type) {
            case "input":
                input = <FormInput name={form.label} label={updateLabel(form.label)} borderColor={borderColor} />
                break;
            case "textarea":
                input = <FormTextarea name={form.label} label={updateLabel(form.label)} borderColor={borderColor} />
            default:
                break;
        }

        return input;
    }

    return (
        <main className="flex justify-center items-center flex-col w-screen min-h-screen overflow-auto py-5">
            <div className="w-[90%] lg:w-[50vw]  rounded-lg p-8" style={{ backgroundColor: bgColor }}>
                <FormMain>
                    {forms?.length > 0 && forms?.map((form, i) => {
                        return (
                            <div key={i}>
                                {checkFormType(form)}
                            </div>
                        )
                    })}
                    <FormSubmit />
                </FormMain>
            </div>

        </main>
    )
}