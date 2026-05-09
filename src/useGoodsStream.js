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

        const controller = new AbortController();

        (async () => {
            try {
                const response = await fetch('http://localhost:3000/goods-stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params),
                    signal: controller.signal,
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let currentEvent = 'message';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (line === '') { currentEvent = 'message'; continue; }
                        if (line.startsWith('event: ')) { currentEvent = line.slice(7).trim(); continue; }
                        if (line.startsWith('data: ')) {
                            const payload = JSON.parse(line.slice(6));
                            if (currentEvent === 'done') {
                                setData(payload);
                                setIsLoading(false);
                            } else if (currentEvent === 'error') {
                                setError(payload.message || 'Ошибка сервера');
                                setIsLoading(false);
                            } else if (payload.step) {
                                setStep(payload.step);
                            }
                        }
                    }
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Ошибка соединения с сервером');
                    setIsLoading(false);
                }
            }
        })();

        const timeout = setTimeout(() => {
            controller.abort();
            setError('Превышено время ожидания');
            setIsLoading(false);
        }, 600000);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [params]);

    return { step, data, isLoading, error };
}
