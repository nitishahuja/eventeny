import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('renders nothing when message is empty', () => {
    const { container } = render(<Toast message='' />);
    expect(container.querySelector('.toast-root')).toBeNull();
  });

  it('renders message and close button with role=status', () => {
    render(<Toast message='Status updated' variant='success' autoHideMs={0} />);

    const root = screen.getByRole('status');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Status updated')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /dismiss notification/i }),
    ).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Toast
        message='Something went wrong'
        variant='error'
        onDismiss={onDismiss}
        autoHideMs={0}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /dismiss notification/i }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-hides after the given timeout', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <Toast
        message='Auto hide'
        variant='success'
        onDismiss={onDismiss}
        autoHideMs={3000}
      />,
    );

    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

