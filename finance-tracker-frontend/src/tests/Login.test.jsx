import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import { authAPI } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn()
  }
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('UT01 - Login form renders correctly', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Enter your email'))
      .toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password'))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' }))
      .toBeInTheDocument();
  });

  test('UT02 - Shows loading state when form is submitted', async () => {
    authAPI.login.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    renderLogin();
    fireEvent.change(
      screen.getByPlaceholderText('Enter your email'),
      { target: { value: 'gourav@gmail.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your password'),
      { target: { value: 'password123' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });

  test('UT03 - Shows error message on invalid credentials', async () => {
    authAPI.login.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } }
    });
    renderLogin();
    fireEvent.change(
      screen.getByPlaceholderText('Enter your email'),
      { target: { value: 'wrong@gmail.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your password'),
      { target: { value: 'wrongpassword' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password'))
        .toBeInTheDocument();
    });
  });

  test('UT04 - Register link is present', () => {
    renderLogin();
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  test('UT05 - Email field accepts valid email format', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput,
      { target: { value: 'gourav@gmail.com' } });
    expect(emailInput.value).toBe('gourav@gmail.com');
  });

});