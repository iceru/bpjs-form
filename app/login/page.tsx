"use client"

import Image from "next/image";
import FormMain from "../components/FormMain";
import FormInput from "../components/FormInput";
import FormSubmit from "../components/FormSubmit";
import { api_host } from "@/lib/config";
import { FormEvent } from "react";
import { encrypt } from "@/lib/encrypt";
import { redirect } from "next/navigation";

export default function Login() {
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        const encryptedPassword = encrypt(password)

        const res = await fetch(`${api_host}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password: `${encryptedPassword.encryptedData}|${encryptedPassword.iv}` })
        });

        if (res.ok) {
            const data = await res.json();
            window.localStorage.setItem("auth", data.token);
            setTimeout(() => {
                redirect('/dashboard')
            }, 500);
        }

    }
    return (
        <div className="grid lg:grid-cols-2">
            <div className="h-screen hidden lg:block">
                <Image src="/images/login.jpg" width={300} height={600} className="object-cover w-full h-full" alt="Login Image" />
            </div>
            <div className="flex flex-col justify-center p-8">
                <h2 className="font-bold text-3xl mb-4">Login to your account</h2>
                <FormMain submit={handleSubmit}>
                    <FormInput name="email" label="Email" type="email" placeholder="Input your email" />
                    <FormInput name="password" label="Password" type="password" placeholder="Input your password" />
                    <FormSubmit />
                </FormMain>
            </div>
        </div>
    )
}