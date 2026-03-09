import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './Profile';

const mockApplicant = {
  businessName: 'Acme Events Co',
  application: 'Food & Beverage',
  currentStatus: 'Approved',
  payment: 'paid',
  date: '2025-02-15',
};

const mockApplicantWithExtras = {
  ...mockApplicant,
  email: 'contact@acmeevents.com',
  phone: '+1 (415) 555-0139',
  website: 'https://acmeevents.com',
  address: '88 Townsend St, San Francisco, CA',
  country: 'United States',
  description: 'Full-service food concessions.',
  documents: [
    { name: 'Insurance Certificate.pdf', type: 'Insurance', url: '#' },
    { name: 'Health Permit.pdf', type: 'Permit', url: '#' },
  ],
};

describe('Profile', () => {
  it('returns null when applicant is null', () => {
    const { container } = render(<Profile applicant={null} onBack={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders profile section with applicant name as heading', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.getByRole('region', { name: /acme events co/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Acme Events Co' })).toBeInTheDocument();
  });

  it('renders back button that calls onBack when clicked', () => {
    const onBack = vi.fn();
    render(<Profile applicant={mockApplicant} onBack={onBack} />);

    const backBtn = screen.getByRole('button', { name: /back to applications/i });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders application summary stats', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    const stats = screen.getByRole('list', { name: /application summary/i });
    expect(stats).toBeInTheDocument();
    expect(stats).toHaveTextContent('Food & Beverage');
    expect(stats).toHaveTextContent('Approved');
    expect(stats).toHaveTextContent('2025');
  });

  it('renders application details card', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.getByRole('region', { name: /application details/i })).toBeInTheDocument();
    expect(screen.getByText('Application details')).toBeInTheDocument();
    expect(screen.getByText('paid')).toBeInTheDocument();
  });

  it('renders contact section with email and phone links', () => {
    render(<Profile applicant={mockApplicantWithExtras} onBack={() => {}} />);
    const contactSection = screen.getByRole('region', { name: /contact/i });
    expect(contactSection).toBeInTheDocument();

    const contactEmailLink = screen.getByRole('link', { name: 'contact@acmeevents.com' });
    expect(contactEmailLink).toHaveAttribute('href', 'mailto:contact@acmeevents.com');

    const phoneLink = screen.getByRole('link', { name: '+1 (415) 555-0139' });
    expect(phoneLink).toHaveAttribute('href', 'tel:+1 (415) 555-0139');
  });

  it('uses generated email when applicant has no email', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    const emailLink = screen.getAllByRole('link', { name: /email acme events co/i })[0];
    expect(emailLink).toHaveAttribute('href', 'mailto:acme.events.co@example.com');
  });

  it('renders website link when applicant has website', () => {
    render(<Profile applicant={mockApplicantWithExtras} onBack={() => {}} />);
    const websiteLink = screen.getByRole('link', { name: /acmeevents\.com.*opens in new tab/i });
    expect(websiteLink).toHaveAttribute('href', 'https://acmeevents.com');
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink.getAttribute('rel')).toMatch(/noopener|noreferrer/);
  });

  it('renders notes section with description or fallback', () => {
    render(<Profile applicant={mockApplicantWithExtras} onBack={() => {}} />);
    expect(screen.getByRole('region', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByText('Full-service food concessions.')).toBeInTheDocument();
  });

  it('renders company section when address, country, or documents exist', () => {
    render(<Profile applicant={mockApplicantWithExtras} onBack={() => {}} />);
    expect(screen.getByRole('region', { name: /company/i })).toBeInTheDocument();
    expect(screen.getByText('88 Townsend St, San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /insurance certificate\.pdf/i })).toBeInTheDocument();
  });

  it('does not render company section when no address, country, or documents', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.queryByRole('region', { name: /company/i })).not.toBeInTheDocument();
  });

  it('hero has accessible group label', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.getByRole('group', { name: /vendor overview/i })).toBeInTheDocument();
  });

  it('primary actions group has aria-label', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.getByRole('group', { name: /primary actions/i })).toBeInTheDocument();
  });

  it('sticky actions have aria-label', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    expect(screen.getByRole('group', { name: /profile actions/i })).toBeInTheDocument();
  });

  it('focuses heading when applicant is set', () => {
    render(<Profile applicant={mockApplicant} onBack={() => {}} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(document.activeElement).toBe(heading);
  });
});
