import { useState, useEffect, useRef, useCallback } from 'react';

const MIN_STEP_MS = 600;

export function useGoodsStream(params) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const serverStepRef = useRef(0);
    const intervalRef = useRef(null);

    const startStepAdvance = useCallback(() => {
        if (intervalRef.current) return;

        // первый шаг показываем сразу, остальные — с задержкой
        setStep(prev => {
            if (prev < serverStepRef.current) return prev + 1;
            return prev;
        });

        intervalRef.current = setInterval(() => {
            setStep(prev => {
                if (prev >= serverStepRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return prev;
                }
                return prev + 1;
            });
        }, MIN_STEP_MS);
    }, []);

    useEffect(() => {
        if (!params) return;

        setIsLoading(true);
        setStep(0);
        serverStepRef.current = 0;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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
                                serverStepRef.current = payload.step;
                                startStepAdvance();
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
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            controller.abort();
        };
    }, [params, startStepAdvance]);

    return { step, data, isLoading, error };
}
