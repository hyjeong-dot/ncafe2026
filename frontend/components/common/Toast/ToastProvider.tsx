'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#8b62c0', // ditto-700
                    color: '#fff',
                    borderRadius: '12px',
                },
                success: {
                    style: {
                        background: '#f8f4ff', // ditto-100
                        color: '#6e4a9e', // ditto-800
                        border: '1px solid #d4bbf7', // ditto-400
                    },
                    iconTheme: {
                        primary: '#a87edb', // ditto-600
                        secondary: 'white',
                    },
                },
                error: {
                    style: {
                        background: '#fff1f2', // soft pink
                        color: '#e11d48', // ditto danger
                        border: '1px solid #fb7185',
                    },
                    iconTheme: {
                        primary: '#e11d48',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}
