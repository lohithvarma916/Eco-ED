import { useQuery } from "@tanstack/react-query";

interface AuthResponse {
  isLoggedIn: boolean;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

async function checkAuth(): Promise<AuthResponse> {
  const response = await fetch('/api/auth/check', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    // If not authenticated, return default values
    if (response.status === 401) {
      return {
        isLoggedIn: false,
        user: { id: '', name: '', firstName: '', lastName: '', role: '' }
      };
    }
    throw new Error(`Authentication check failed: ${response.status}`);
  }

  return response.json();
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/check"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: data?.isLoggedIn || false,
    error,
  };
}
