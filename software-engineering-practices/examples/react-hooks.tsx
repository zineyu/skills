// React Hooks Best Practices Example
import { useState, useEffect, useCallback, useRef } from 'react';

// ✅ Good: Custom hook with cleanup
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ✅ Good: useCallback for stable references
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return <input type="text" value={query} onChange={handleChange} />;
}

// ✅ Good: useRef for DOM access without re-renders
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}

// ❌ Bad: Hook inside condition
function BadExample({ shouldFetch }: { shouldFetch: boolean }) {
  if (shouldFetch) {
    // ❌ Never call hooks conditionally!
    // const data = useFetchData();
  }
  return <div />;
}

// ❌ Bad: Missing dependency in useEffect
function BadEffectExample({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // ❌ Missing dependency: userId

  return <div>{user?.name}</div>;
}