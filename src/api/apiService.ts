import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook to save PIN to the fake API using React Query.
 */
export const useSavePin = () => {
  return useMutation({
    mutationFn: (pin: number) => {
      return fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save PIN');
        }
        return response.json();
      });
    },
  });
};
