import { useState, useEffect } from 'react';

export function useGoodsStream(params) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!params) return;

        setIsLoading(true);
        setStep(0);
        setData(null);
        setError(null);

        const queryString = new URLSearchParams({
            ...params,
            highRating: params.highRating ? 'true' : 'false',
            original: params.original ? 'true' : 'false',
            premium: params.premium ? 'true' : 'false',
        }).toString();

        const eventSource = new EventSource(
            `http://localhost:3000/goods-stream?${queryString}`
        );

        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            if (parsed.step) {
                setStep(parsed.step);
            }
        };

        eventSource.addEventListener('done', (event) => {
            const parsed = JSON.parse(event.data);
            setData(parsed);
            setIsLoading(false);
            eventSource.close();
        });

        eventSource.addEventListener('error', () => {
            setError('Ошибка соединения с сервером');
            setIsLoading(false);
            eventSource.close();
        });

        // Таймаут на случай, если сервер не ответит
        const timeout = setTimeout(() => {
            if (isLoading) {
                setError('Превышено время ожидания');
                setIsLoading(false);
                eventSource.close();
            }
        }, 30000);

        return () => {
            clearTimeout(timeout);
            eventSource.close();
        };
    }, [params]);

    return { step, data, isLoading, error };
}