import { NextPage } from 'next'
import React from 'react'

interface Props {
    submit?: (event: React.FormEvent<HTMLFormElement>) => void
    children: React.ReactNode;
    className?: string;
}

const FormMain: NextPage<Props> = ({ submit, children, className }) => {
    return <form onSubmit={submit} className={className}>
        {children}
    </form>
}

export default FormMain