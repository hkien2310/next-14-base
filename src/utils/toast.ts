import { toast } from 'react-toastify';

export const showError = (msgError: string) => {
    return toast(msgError, { type: 'error' })
}

export const showSuccess = (msgSuccess: string) => {
    return toast(msgSuccess, { type: 'success' })
}