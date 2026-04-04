import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from '../pages/Register';
import { authAPI } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  authAPI: {
    register: vi.fn()
  }
}));

const renderRegister = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('UT06 - Register form renders correctly', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Enter your full name'))
      .toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email'))
      .toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimum 6 characters'))
      .toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password'))
      .toBeInTheDocument();
  });

  test('UT07 - Shows error when passwords do not match', async () => {
    renderRegister();
    fireEvent.change(
      screen.getByPlaceholderText('Enter your full name'),
      { target: { value: 'Gourav Khurana' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your email'),
      { target: { value: 'gourav@gmail.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Minimum 6 characters'),
      { target: { value: 'password123' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Confirm your password'),
      { target: { value: 'differentpassword' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match'))
        .toBeInTheDocument();
    });
  });

  test('UT08 - Shows error when password is too short', async () => {
    renderRegister();
    fireEvent.change(
      screen.getByPlaceholderText('Enter your full name'),
      { target: { value: 'Gourav Khurana' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your email'),
      { target: { value: 'gourav@gmail.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Minimum 6 characters'),
      { target: { value: '123' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Confirm your password'),
      { target: { value: '123' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );
    await waitFor(() => {
      expect(screen.getByText(
        'Password must be at least 6 characters'
      )).toBeInTheDocument();
    });
  });

  test('UT09 - Sign in link is present', () => {
    renderRegister();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('UT10 - Shows loading state when form is submitted', async () => {
    authAPI.register.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    renderRegister();
    fireEvent.change(
      screen.getByPlaceholderText('Enter your full name'),
      { target: { value: 'Gourav Khurana' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Enter your email'),
      { target: { value: 'new@gmail.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Minimum 6 characters'),
      { target: { value: 'password123' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Confirm your password'),
      { target: { value: 'password123' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Create Account' })
    );
    await waitFor(() => {
      expect(screen.getByText('Creating account...'))
        .toBeInTheDocument();
    });
  });

});