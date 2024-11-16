"use client"

import { api_host } from "@/lib/config"
import { useEffect, useState } from "react"
import FormMain from "../components/FormMain"

interface FormType {
    form_type: string;
    type: string;
    bg_color: string;
    id: number | string;
    border_color: string;
}

export default function Forms() {
    const [forms, setForms] = useState([])
    const [bgColor, setBgColor] = useState("#fff")
    const [borderColor, setBorderColor] = useState("#000")

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
            setForms(data);
            setBgColor(data[0].bg_color);
            setBorderColor(data[0].border_color);
        }
    }

    useEffect(() => {
        getGeneratedForms();
    }, [])

    const checkFormType = (form: FormType) => {
        console.log(form);
        return (<div>A</div>)
    }

    return (
        <main className="flex justify-center items-center flex-col w-screen h-screen">
            <div className="w-[90%] lg:w-[40vw] rounded-lg p-8" style={{ backgroundColor: bgColor }}>
                <FormMain>
                    {forms?.length > 0 && forms?.map((form, i) => {
                        return (
                            <div key={i}>
                                {checkFormType(form)}
                            </div>
                        )
                    })}
                </FormMain>
            </div>

        </main>
    )
}