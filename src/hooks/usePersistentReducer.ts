// File: src/hooks/usePersistentReducer.ts
import { useReducer, useEffect, type Reducer } from 'react';

export function usePersistentReducer<S, A>(
    reducer: Reducer<S, A>,
    initialState: S,
    storageKey: string
): [S, React.Dispatch<A>] {
    // 1. Lazy initialization: Try to load from storage, fallback to initialState
    const [state, dispatch] = useReducer(reducer, initialState, (init) => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : init;
        } catch (error) {
            console.warn(`Failed to load state for key "${storageKey}"`, error);
            return init;
        }
    });

    // 2. Sync to storage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn(`Failed to save state for key "${storageKey}"`, error);
        }
    }, [storageKey, state]);

    return [state, dispatch];
}