import { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  Plug,
  Droplets,
  Clock,
  Tag,
  AlertTriangle,
} from 'lucide-react';
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
  const resolvedEmail = applicant.contact?.email || applicant.email || email;
  const resolvedPhone =
    applicant.contact?.phone || applicant.phone || '+1 (555) 123-4567';
  const resolvedWebsite = applicant.website;
  const resolvedContactName = applicant.contact?.name;
  const resolvedContactTitle = applicant.contact?.title;
  const resolvedAddress = applicant.address;
  const resolvedCountry = applicant.country;

  const statusClass = (() => {
    const key = String(currentStatus || '').toLowerCase();
    if (key === 'approved') return 'profile-status--approved';
    if (key === 'awaiting decision') return 'profile-status--awaiting-decision';
    if (key === 'waitlisted') return 'profile-status--waitlisted';
    if (key === 'rejected') return 'profile-status--rejected';
    if (key === 'withdrawn') return 'profile-status--withdrawn';
    return '';
  })();

  const tags = Array.isArray(applicant.tag) ? applicant.tag : [];
  const highlights = applicant.offerings?.highlights || [];
  const flags = applicant.internal?.flags || [];

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
            {(resolvedContactName || resolvedContactTitle) && (
              <div className="profile-hero-sub">
                {resolvedContactName && (
                  <span className="profile-hero-subline">
                    {resolvedContactName}
                    {resolvedContactTitle ? ` · ${resolvedContactTitle}` : ''}
                  </span>
                )}
              </div>
            )}

            {tags.length > 0 && (
              <div className="profile-tags" aria-label="Vendor tags">
                {tags.slice(0, 5).map((t) => (
                  <span key={t} className="profile-tag">
                    <Tag size={14} aria-hidden /> {t}
                  </span>
                ))}
              </div>
            )}

            <div className="profile-badges" aria-label="Badges">
              <span className={`profile-status ${statusClass}`}>
                {currentStatus}
              </span>
              <span className="profile-chip">{payment === 'paid' ? 'Paid' : 'Not Paid'}</span>
              {applicant.internal?.priority && (
                <span className="profile-chip">Priority: {applicant.internal.priority}</span>
              )}
              {flags.length > 0 && (
                <span className="profile-chip">
                  <AlertTriangle size={14} aria-hidden /> {flags.length} flag{flags.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
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
            <div><span className="profile-k">Status</span><span className="profile-v">{currentStatus}</span></div>
            <div>
              <span className="profile-k">Requested booth</span>
              <span className="profile-v">{applicant.booth?.requestedSize || '—'}</span>
            </div>
            <div>
              <span className="profile-k">Load-in window</span>
              <span className="profile-v">{applicant.booth?.loadInWindow || '—'}</span>
            </div>
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
              <a className="profile-link" href={`tel:${resolvedPhone}`}>{resolvedPhone}</a>
            </li>
            {resolvedWebsite && (
              <li>
                <Globe size={16} aria-hidden />
                <a
                  className="profile-link"
                  href={resolvedWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${resolvedWebsite.replace(/^https?:\/\//, '')} (opens in new tab)`}
                >
                  {resolvedWebsite.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
            {(resolvedAddress || resolvedCountry) && (
              <li>
                <MapPin size={16} aria-hidden />
                <span className="profile-v">
                  {resolvedAddress || '—'}
                  {resolvedCountry ? ` · ${resolvedCountry}` : ''}
                </span>
              </li>
            )}
          </ul>
        </section>

        <section
          className="profile-card profile-card--span2"
          aria-labelledby="notes-title"
        >
          <h3 id="notes-title" className="profile-card-title">Notes</h3>
          <p className="profile-notes">
            {applicant.description ||
              `Vendor specializes in ${String(application || '').toLowerCase()}. Review requirements and confirm compliance items before final approval.`}
          </p>
          {Array.isArray(highlights) && highlights.length > 0 && (
            <div className="profile-inline-section" aria-label="Highlights">
              <h4 className="profile-subtitle">Highlights</h4>
              <ul className="profile-pill-list" role="list">
                {highlights.slice(0, 8).map((h) => (
                  <li key={h} className="profile-pill">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="profile-card" aria-labelledby="booth-title">
          <h3 id="booth-title" className="profile-card-title">Booth & logistics</h3>
          <div className="profile-kv">
            <div>
              <span className="profile-k">
                <Plug size={14} aria-hidden /> Power
              </span>
              <span className="profile-v">
                {applicant.booth?.power?.needed
                  ? `${applicant.booth.power.watts || '—'}W`
                  : 'No'}
              </span>
            </div>
            <div>
              <span className="profile-k">
                <Droplets size={14} aria-hidden /> Water
              </span>
              <span className="profile-v">
                {applicant.booth?.water?.needed ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="profile-k">
                <Clock size={14} aria-hidden /> Setup time
              </span>
              <span className="profile-v">
                {typeof applicant.booth?.setupTimeMinutes === 'number'
                  ? `${applicant.booth.setupTimeMinutes} min`
                  : '—'}
              </span>
            </div>
            <div>
              <span className="profile-k">Refrigeration</span>
              <span className="profile-v">
                {applicant.booth?.refrigeration?.needed ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          {(applicant.booth?.power?.notes || applicant.booth?.water?.notes) && (
            <p className="profile-notes profile-notes--tight">
              {applicant.booth?.power?.notes || applicant.booth?.water?.notes}
            </p>
          )}
        </section>

        <section className="profile-card" aria-labelledby="compliance-title">
          <h3 id="compliance-title" className="profile-card-title">Compliance</h3>
          <div className="profile-kv">
            <div>
              <span className="profile-k">
                <ShieldCheck size={14} aria-hidden /> Insurance
              </span>
              <span className="profile-v">
                {applicant.compliance?.insurance?.status || '—'}
              </span>
            </div>
            <div>
              <span className="profile-k">Expires</span>
              <span className="profile-v">
                {applicant.compliance?.insurance?.expiresOn || '—'}
              </span>
            </div>
            <div>
              <span className="profile-k">W-9</span>
              <span className="profile-v">
                {applicant.compliance?.w9OnFile ? 'On file' : 'Missing'}
              </span>
            </div>
            <div>
              <span className="profile-k">Sales tax ID</span>
              <span className="profile-v">{applicant.compliance?.salesTaxId || '—'}</span>
            </div>
          </div>
          {Array.isArray(applicant.compliance?.permits) &&
            applicant.compliance.permits.length > 0 && (
              <div className="profile-inline-section" aria-label="Permits">
                <h4 className="profile-subtitle">Permits / certificates</h4>
                <ul className="profile-pill-list" role="list">
                  {applicant.compliance.permits.map((p) => (
                    <li key={p} className="profile-pill">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </section>

        {/* Company */}
        {(applicant.address ||
          applicant.country ||
          applicant.company ||
          applicant.documents?.length) && (
          <section className="profile-card" aria-labelledby="company-title">
            <h3 id="company-title" className="profile-card-title">Company</h3>
            <div className="profile-kv">
              {applicant.address && (
                <div>
                  <span className="profile-k">Address</span>
                  <span className="profile-v">{applicant.address}</span>
                </div>
              )}
              {applicant.country && (
                <div>
                  <span className="profile-k">Country</span>
                  <span className="profile-v">{applicant.country}</span>
                </div>
              )}
              {applicant.company?.headquarters && (
                <div>
                  <span className="profile-k">HQ</span>
                  <span className="profile-v">{applicant.company.headquarters}</span>
                </div>
              )}
              {typeof applicant.company?.yearsInBusiness === 'number' && (
                <div>
                  <span className="profile-k">Years in business</span>
                  <span className="profile-v">{applicant.company.yearsInBusiness}</span>
                </div>
              )}
              {typeof applicant.company?.teamSize === 'number' && (
                <div>
                  <span className="profile-k">Team size</span>
                  <span className="profile-v">{applicant.company.teamSize}</span>
                </div>
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

        <section className="profile-card profile-card--span2" aria-labelledby="internal-title">
          <h3 id="internal-title" className="profile-card-title">Internal review</h3>
          <div className="profile-kv">
            <div>
              <span className="profile-k">Reviewer</span>
              <span className="profile-v">{applicant.internal?.reviewer || '—'}</span>
            </div>
            <div>
              <span className="profile-k">Last reviewed</span>
              <span className="profile-v">{applicant.internal?.lastReviewedOn || '—'}</span>
            </div>
            <div>
              <span className="profile-k">Priority</span>
              <span className="profile-v">{applicant.internal?.priority || '—'}</span>
            </div>
            <div>
              <span className="profile-k">Flags</span>
              <span className="profile-v">{Array.isArray(flags) ? flags.length : 0}</span>
            </div>
          </div>
          <p className="profile-notes profile-notes--tight">
            {applicant.internal?.notes || '—'}
          </p>
          {Array.isArray(flags) && flags.length > 0 && (
            <div className="profile-inline-section" aria-label="Flags">
              <h4 className="profile-subtitle">Flags</h4>
              <ul className="profile-pill-list" role="list">
                {flags.map((f) => (
                  <li key={f} className="profile-pill profile-pill--warn">
                    <AlertTriangle size={14} aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
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
