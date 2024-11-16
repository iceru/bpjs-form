import { NextPage } from 'next'
import { IColor } from 'react-color-palette';

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    value?: string | IColor;
    borderColor?: string;
}

const FormTextarea: NextPage<Props> = ({ name, placeholder, label, borderColor }) => {
    return <div className='mb-4'>
        {label && (
            <label className='block mb-1' htmlFor={name}>{label}</label>
        )}
        <textarea rows={4} style={{ borderColor }} name={name} className='border border-gray-300 rounded-md px-4 py-2 w-full lg:w-[70%]' placeholder={placeholder}></textarea>
    </div>
}

export default FormTextarea