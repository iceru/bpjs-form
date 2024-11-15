import { NextPage } from 'next'
import Link from 'next/link'


const Sidebar: NextPage = ({ }) => {
    return <section className="xl:h-[95vh] flex-shrink-0 bg-green-700 text-white w-full mb-6 xl:mb-0 xl:w-[280px] rounded-3xl p-6">
        <ul className="flex overflow-auto xl:grid gap-6 items-center text-center xl:text-start text-sm lg:text-base">
            <li className='hidden xl:block'>
                <Link href="/">
                    <div className='font-bold text-2xl'>
                        Form Generator
                    </div>
                </Link>
            </li>
            <li>
                <a href="/dashboard">
                    Dashboard
                </a>
            </li>
            <li>
                <a href="/dashboard/users">
                    Users
                </a>
            </li>
            <li>
                <a href="/dashboard/forms">
                    Forms
                </a>
            </li>
            <li>
                <a href="/dashboard/form-types">
                    Form Types
                </a>
            </li>
        </ul>
    </section>
}

export default Sidebar