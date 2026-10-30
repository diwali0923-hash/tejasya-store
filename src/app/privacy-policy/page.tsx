import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tejasya',
  description: 'Privacy Policy for Tejasya Living - how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', lineHeight: 1.8 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        Privacy Policy
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: October 30, 2026</p>

      <p>
        Tejasya Living ("Tejasya", "we", "us", or "our") operates the website{' '}
        <strong>www.tejasya.store</strong> and associated services. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you visit our website or make
        a purchase.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following information when you interact with our website:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address provided during checkout.</li>
        <li><strong>Payment Information:</strong> Payment details are processed securely by Razorpay. We do not store your card details on our servers.</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent on pages, browser type, device information, and IP address collected via cookies and analytics tools.</li>
        <li><strong>Marketing Data:</strong> Interactions with our advertisements tracked via Meta Pixel and Google Tag Manager for ad performance measurement.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Process and fulfill your orders, including shipping and delivery.</li>
        <li>Communicate order updates, shipping notifications, and customer support.</li>
        <li>Improve our website, products, and services.</li>
        <li>Measure advertising effectiveness and deliver relevant ads via Meta (Facebook/Instagram) and Google platforms.</li>
        <li>Prevent fraud and ensure secure transactions.</li>
      </ul>

      <h2>3. Third-Party Services</h2>
      <p>We share information with the following third-party services as necessary:</p>
      <ul>
        <li><strong>Razorpay:</strong> Payment processing. Subject to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer">Razorpay&apos;s Privacy Policy</a>.</li>
        <li><strong>Meta (Facebook/Instagram):</strong> Advertising and analytics via Meta Pixel. Subject to <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Meta&apos;s Privacy Policy</a>.</li>
        <li><strong>Google:</strong> Analytics and tag management via Google Tag Manager.</li>
        <li><strong>Shipping Partners:</strong> Your name, address, and phone number are shared with our fulfillment partners to deliver your order.</li>
      </ul>

      <h2>4. Cookies and Tracking</h2>
      <p>
        Our website uses cookies and similar tracking technologies (Meta Pixel, Google Tag Manager)
        to analyze traffic, measure ad performance, and improve your experience. You can control
        cookies through your browser settings.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. All payment
        transactions are encrypted and processed through Razorpay&apos;s PCI-DSS compliant infrastructure.
        However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes outlined
        in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
        Order data is retained for accounting and tax compliance purposes.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your data, subject to legal retention requirements.</li>
        <li>Opt out of marketing communications.</li>
      </ul>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        Our website is not intended for individuals under the age of 18. We do not knowingly collect
        personal information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with
        an updated revision date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:{' '}
        <a href="mailto:hello@tejasya.store">hello@tejasya.store</a>
      </p>
    </main>
  );
}
