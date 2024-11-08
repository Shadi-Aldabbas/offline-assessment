import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useSavePin } from "../api/apiService";

// Mock fetch globally to simulate API calls
global.fetch = jest.fn();

describe("useSavePin", () => {
  // Create a new QueryClient for each test
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  // Wrapper component to provide QueryClient context to the hook
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
  

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should successfully save PIN", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, pin: 6576 }),
    });

    const { result } = renderHook(() => useSavePin(), { wrapper });

    await act(async () => {
      result.current.mutate(6576);
    });

    expect(fetch).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: 6576 }),
    });

    expect(result.current.isError).toBe(false);
  });
});
