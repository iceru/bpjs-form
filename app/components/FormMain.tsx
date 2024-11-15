import { NextPage } from 'next'
import React from 'react'

interface Props {
    submit?: (event: React.FormEvent<HTMLFormElement>) => void
    children: React.ReactNode
}

const FormMain: NextPage<Props> = ({ submit, children }) => {
    return <form onSubmit={submit}>
        {children}
    </form>
}

export default FormMain