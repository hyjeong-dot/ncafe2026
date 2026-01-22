'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#333',
                    color: '#fff',
                },
                success: {
                    style: {
                        background: 'white',
                        color: 'black',
                        border: '1px solid #e5e7eb',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: 'white',
                    },
                },
                error: {
                    style: {
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                    },
                },
            }}
        />
    );
}
