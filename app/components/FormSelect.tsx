import { NextPage } from 'next'
import React from 'react';

interface Option {
    label: string;
    value: string;
}

interface Props {
    options: Option[];
    name: string;
    label: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const FormSelect: NextPage<Props> = ({ options, name, onChange, label }) => {
    return (
        <div className='mb-4'>
            {label && (
                <label htmlFor={name} className='block mb-2'>{label}</label>
            )}
            <select name={name} onChange={onChange}>
                {options?.map((option, i) => {
                    return (
                        <option value={option.value} key={i}>{option.label}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default FormSelect