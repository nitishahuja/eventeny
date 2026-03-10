import { useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Phone, Globe } from 'lucide-react';
import './Profile.css';

function Profile({ applicant, onBack }) {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!applicant) return;
    headingRef.current?.focus();
  }, [applicant]);

  if (!applicant) return null;

  const {
    businessName,
    application,
    currentStatus,
    payment,
    date,
  } = applicant;

  const emailSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '.');
  const email = `${emailSlug}@example.com`;
  const resolvedEmail = applicant.email || email;

  return (
    <section className="profile" aria-labelledby="profile-title">
      {/* Hero */}
      <header className="profile-hero" role="group" aria-label="Vendor overview">
        <button
          type="button"
          className="profile-back"
          onClick={onBack}
          aria-label="Back to applications"
        >
          <ArrowLeft size={18} aria-hidden />
          <span>Back</span>
        </button>
        <div className="profile-hero-main">
          <img
            src="/business-logo-placeholder.png"
            alt=""
            className="profile-avatar"
            width={64}
            height={64}
          />
          <div className="profile-hero-meta">
            <h2
              id="profile-title"
              ref={headingRef}
              className="profile-name"
              tabIndex={-1}
            >
              {businessName}
            </h2>
          </div>
        </div>
        <div className="profile-hero-actions" role="group" aria-label="Primary actions">
          <a
            className="profile-btn profile-btn--ghost"
            href={`mailto:${resolvedEmail}`}
            aria-label={`Email ${businessName}`}
          >
            <Mail size={16} aria-hidden /> Message
          </a>
        </div>
      </header>

      {/* Summary stats */}
      <ul className="profile-stats" aria-label="Application summary">
        <li className="profile-stat">
          <span className="profile-stat-k">Application</span>
          <span className="profile-stat-v">{application}</span>
        </li>
        <li className="profile-stat">
          <span className="profile-stat-k">Status</span>
          <span className="profile-stat-v">{currentStatus}</span>
        </li>
        <li className="profile-stat">
          <span className="profile-stat-k">Submitted</span>
          <span className="profile-stat-v">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </li>
      </ul>

      {/* Content grid */}
      <div className="profile-grid">
        <section className="profile-card" aria-labelledby="app-details-title">
          <h3 id="app-details-title" className="profile-card-title">Application details</h3>
          <div className="profile-kv">
            <div><span className="profile-k">Type</span><span className="profile-v">{application}</span></div>
            <div><span className="profile-k">Payment</span><span className="profile-v">{payment}</span></div>
            <div><span className="profile-k">Submitted</span><span className="profile-v">{new Date(date).toLocaleDateString()}</span></div>
          </div>
        </section>

        <section className="profile-card" aria-labelledby="contact-title">
          <h3 id="contact-title" className="profile-card-title">Contact</h3>
          <ul className="profile-list" role="list">
            <li>
              <Mail size={16} aria-hidden />
              <a className="profile-link" href={`mailto:${resolvedEmail}`}>{resolvedEmail}</a>
            </li>
            <li>
              <Phone size={16} aria-hidden />
              <a className="profile-link" href={`tel:${applicant.phone || '+15551234567'}`}>{applicant.phone || '+1 (555) 123-4567'}</a>
            </li>
            {applicant.website && (
              <li>
                <Globe size={16} aria-hidden />
                <a className="profile-link" href={applicant.website} target="_blank" rel="noopener noreferrer" aria-label={`${applicant.website.replace(/^https?:\/\//, '')} (opens in new tab)`}>{applicant.website.replace(/^https?:\/\//, '')}</a>
              </li>
            )}
          </ul>
        </section>

        <section className="profile-card profile-card--span2" aria-labelledby="notes-title">
          <h3 id="notes-title" className="profile-card-title">Notes</h3>
          <p className="profile-notes">
            {applicant.description || `Vendor specializes in ${application.toLowerCase()}. Great fit for family-friendly events. Confirm power and space requirements if approved.`}
          </p>
        </section>

        {/* Company */}
        {(applicant.address || applicant.country || applicant.documents?.length) && (
          <section className="profile-card" aria-labelledby="company-title">
            <h3 id="company-title" className="profile-card-title">Company</h3>
            <div className="profile-kv">
              {applicant.address && (
                <div><span className="profile-k">Address</span><span className="profile-v">{applicant.address}</span></div>
              )}
              {applicant.country && (
                <div><span className="profile-k">Country</span><span className="profile-v">{applicant.country}</span></div>
              )}
            </div>
            {Array.isArray(applicant.documents) && applicant.documents.length > 0 && (
              <ul className="profile-docs" role="list" aria-label="Documents">
                {applicant.documents.map((d) => (
                  <li key={d.name} className="profile-doc">
                    <a className="profile-link" href={d.url || '#'}>{d.name}</a>
                    <span className="profile-doc-meta">{d.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {/* Sticky actions on mobile */}
      <div className="profile-sticky-actions" role="group" aria-label="Profile actions">
        <a
          className="profile-btn profile-btn--primary"
          href={`mailto:${resolvedEmail}`}
          aria-label={`Email ${businessName}`}
        >
          <Mail size={16} aria-hidden /> Message
        </a>
      </div>
    </section>
  );
}

export default Profile;
