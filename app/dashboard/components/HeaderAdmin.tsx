"use client"

import { Button } from '@/components/ui/button'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'


const HeaderAdmin: NextPage = ({ }) => {
    const router = useRouter();
    const logout = async () => {
        const res = await fetch('/api/logout');
        if (res.ok) {
            router.push('/login')
        }
    }
    return <div className="bg-admin mb-6 justify-between items-center">
        <p>
            Welcome, Admin
        </p>
        <div>
            <Button type='button' onClick={logout}>Logout</Button>
        </div>
    </div>
}

export default HeaderAdmin