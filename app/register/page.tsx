"use client"

import Image from "next/image";
import FormMain from "../components/FormMain";
import FormInput from "../components/FormInput";
import FormSubmit from "../components/FormSubmit";
import { FormEvent, useState } from "react";
import { api_host } from "@/lib/config";
import { encrypt } from "@/lib/encrypt";
import { redirect } from "next/navigation";

export default function Register() {
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email")?.toString() || "";
        const name = formData.get("name")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        const encryptedPassword = encrypt(password)

        const res = await fetch(`${api_host}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password: `${encryptedPassword.encryptedData}|${encryptedPassword.iv}` })
        });

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => {
                redirect('/login')
            }, 2000);
        }

    }
    return (
        <div className="grid lg:grid-cols-2">
            <div className="h-screen hidden lg:block">
                <Image src="/images/login.jpg" width={300} height={600} className="object-cover w-full h-full" alt="Login Image" />
            </div>
            <div className="flex flex-col justify-center p-6 lg:p-8">
                {success && (
                    <div className="px-4 py-2 mb-6 border-green-600 bg-green-200 rounded-lg">
                        Register Success
                    </div>
                )}
                <h2 className="font-bold text-3xl mb-4">Register new account</h2>
                <FormMain submit={handleSubmit}>
                    <FormInput name="name" label="Name" type="text" placeholder="Input your name" />
                    <FormInput name="email" label="Email" type="email" placeholder="Input your email" />
                    <FormInput name="password" label="Password" type="password" placeholder="Input your password" />
                    <FormSubmit />
                </FormMain>
            </div>
        </div>
    )
}