// src/hooks/useFormValidation.js
import { useState } from 'react';

const useFormValidation = (initialState, validate) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Validate field when it changes
        if (touched[name]) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate field when it loses focus
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };

    const handleSubmit = (callback) => (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validate all fields
        const validationErrors = validate(values);
        setErrors(validationErrors);

        // If no errors, call the submit callback
        if (Object.keys(validationErrors).length === 0) {
            callback();
        }
    };

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        setErrors
    };
};

export default useFormValidation;