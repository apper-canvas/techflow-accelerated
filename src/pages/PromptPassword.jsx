import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-blue-50 to-indigo-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
            <div className="flex-1 py-12 px-5 flex justify-center items-center">
                <div id="authentication-prompt-password" className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700">
                </div>
            </div>
        </div>
    );
};

export default PromptPassword;