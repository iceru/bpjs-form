import { NextPage } from 'next'
import { IColor } from 'react-color-palette';

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    value?: string | IColor;
    type?: "text" | "email" | "tel" | "url" | "password";
}

const FormInput: NextPage<Props> = ({ name, placeholder, type, label, value }) => {
    return <div className='mb-4'>
        {label && (
            <label className='block mb-1' htmlFor={name}>{label}</label>
        )}
        <input name={name} defaultValue={value} className='border border-gray-300 rounded-md px-4 py-2 w-full lg:w-[70%]' type={type || 'text'} placeholder={placeholder} />
    </div>
}

export default FormInput