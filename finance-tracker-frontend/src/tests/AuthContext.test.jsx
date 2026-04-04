import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { vi } from 'vitest';

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not authenticated'}
      </p>
      <p data-testid="user-name">{user?.name || 'no user'}</p>
      <button onClick={() => login(
        { name: 'Gourav', email: 'gourav@gmail.com' },
        'test-token-123'
      )}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('UT11 - Initial state is not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status'))
      .toHaveTextContent('not authenticated');
    expect(screen.getByTestId('user-name'))
      .toHaveTextContent('no user');
  });

  test('UT12 - Login sets authenticated state and saves to localStorage',
    async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => {
        expect(screen.getByTestId('auth-status'))
          .toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-name'))
          .toHaveTextContent('Gourav');
        expect(localStorage.getItem('token'))
          .toBe('test-token-123');
      });
  });

  test('UT13 - Logout clears authenticated state and localStorage',
    async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => {
        expect(screen.getByTestId('auth-status'))
          .toHaveTextContent('authenticated');
      });
      fireEvent.click(screen.getByText('Logout'));
      await waitFor(() => {
        expect(screen.getByTestId('auth-status'))
          .toHaveTextContent('not authenticated');
        expect(localStorage.getItem('token')).toBeNull();
      });
  });

  test('UT14 - Persists authentication state from localStorage', async () => {
    localStorage.setItem('token', 'existing-token');
    localStorage.setItem('user', JSON.stringify({
      name: 'Gourav', email: 'gourav@gmail.com'
    }));
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-status'))
        .toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-name'))
        .toHaveTextContent('Gourav');
    });
  });

  test('UT15 - useAuth throws error outside AuthProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    consoleError.mockRestore();
  });

});