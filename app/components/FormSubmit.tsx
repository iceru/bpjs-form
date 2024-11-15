import { NextPage } from 'next'

interface Props {
    label?: string
}

const FormSubmit: NextPage<Props> = ({ label }) => {
    return <button type='submit' className='px-4 py-2 rounded-3xl bg-green-700 text-white'>
        {label || "Submit"}
    </button>
}

export default FormSubmit