import { useEffect } from 'react';

const useFontSize = (textSize: string) => {
    useEffect(() => {
        const root = document.documentElement;
        switch (textSize) {
            case 'small':
                root.style.setProperty('--font-size', '12px');
                break;
            case 'medium':
                root.style.setProperty('--font-size', '16px');
                break;
            case 'large':
                root.style.setProperty('--font-size', '20px');
                break;
            default:
                root.style.setProperty('--font-size', '16px');
        }
    }, [textSize]);
};

export default useFontSize;
