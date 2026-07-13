export type LegalSection = {
  heading: string;
  content: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const legalContent: Record<'privacy' | 'terms' | 'sla', LegalDocument> = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "January 2026",
    sections: [
      {
        heading: "Information We Collect",
        content: [
          "We collect information that you provide directly to us, such as when you fill out a contact form, request a solar quotation, or communicate with our support team.",
          "This may include your name, email address, phone number, property details, and energy consumption data necessary for generating accurate solar estimates."
        ]
      },
      {
        heading: "How Information Is Used",
        content: [
          "The information we collect is used strictly to provide, maintain, and improve our premium solar services.",
          "We use your data to generate quotations, schedule installations, provide customer support, and communicate important updates regarding your solar energy system."
        ]
      },
      {
        heading: "Contact Form Data",
        content: [
          "Data submitted through our contact forms is encrypted and securely stored. We only use this information to respond to your specific inquiries and do not add you to marketing lists without explicit consent."
        ]
      },
      {
        heading: "Cookies",
        content: [
          "We use strictly necessary cookies to ensure our website functions correctly and securely. We do not use intrusive third-party tracking cookies."
        ]
      },
      {
        heading: "Third-party Services",
        content: [
          "We may share necessary information with trusted third-party installation partners and regulatory authorities solely for the purpose of completing your solar installation.",
          "We never sell, rent, or trade your personal information to outside marketers."
        ]
      },
      {
        heading: "Data Security",
        content: [
          "We implement enterprise-grade security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        ]
      },
      {
        heading: "User Rights",
        content: [
          "You have the right to request access to, correction of, or deletion of your personal data at any time. Please contact our privacy team to exercise these rights."
        ]
      },
      {
        heading: "Contact Information",
        content: [
          "For any questions regarding this Privacy Policy, please contact us at privacy@mjsolar.com."
        ]
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "January 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        content: [
          "By accessing or using the MjSolar website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services."
        ]
      },
      {
        heading: "Website Usage",
        content: [
          "Our website is intended for informational purposes and to facilitate the engagement of our solar installation services. You agree to use the site only for lawful purposes."
        ]
      },
      {
        heading: "Quotations & Estimates",
        content: [
          "All solar savings calculators, quotations, and performance estimates provided on this website are illustrative and based on general assumptions.",
          "Final pricing and performance guarantees will be outlined in a formal, binding contract after a physical site inspection."
        ]
      },
      {
        heading: "Intellectual Property",
        content: [
          "All content on this website, including text, graphics, logos, and software, is the property of MjSolar Engineering Inc. and is protected by intellectual property laws."
        ]
      },
      {
        heading: "Accuracy of Information",
        content: [
          "While we strive to provide accurate and up-to-date information, we do not warrant that all product descriptions or other content are entirely accurate, complete, reliable, or error-free."
        ]
      },
      {
        heading: "Limitation of Liability",
        content: [
          "MjSolar shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services."
        ]
      },
      {
        heading: "External Links",
        content: [
          "Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites."
        ]
      },
      {
        heading: "Changes to Terms",
        content: [
          "We reserve the right to modify these terms at any time. Continued use of the website following any changes constitutes acceptance of the new terms."
        ]
      },
      {
        heading: "Governing Law",
        content: [
          "These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions."
        ]
      }
    ]
  },
  sla: {
    title: "Enterprise SLA",
    lastUpdated: "January 2026",
    sections: [
      {
        heading: "Response Time",
        content: [
          "MjSolar guarantees a 24-48 hour response time for all standard support inquiries submitted during standard business hours."
        ]
      },
      {
        heading: "Support Availability",
        content: [
          "Standard support is available Monday through Friday, 9:00 AM to 6:00 PM IST. Emergency support for critical system failures is monitored 24/7."
        ]
      },
      {
        heading: "Installation Timeline",
        content: [
          "Upon contract signing and final approval of site permits, we commit to completing standard residential and commercial installations within a 72-hour operational window, subject to weather conditions."
        ]
      },
      {
        heading: "Maintenance Requests",
        content: [
          "Non-critical maintenance requests will be scheduled within 5 business days of the initial ticket being raised."
        ]
      },
      {
        heading: "Warranty Support",
        content: [
          "All Tier-1 solar panels installed by MjSolar are covered under the manufacturer's 25-year performance warranty. Inverter replacements under warranty will be processed within 14 business days."
        ]
      },
      {
        heading: "Preventive Maintenance",
        content: [
          "Enterprise clients receive bi-annual scheduled preventive maintenance visits, including panel cleaning and electrical safety audits."
        ]
      },
      {
        heading: "Priority Levels",
        content: [
          "Priority 1 (Total System Failure): Addressed within 12 hours.",
          "Priority 2 (Partial System Degradation): Addressed within 48 hours.",
          "Priority 3 (General Inquiries/Minor Issues): Addressed within 3-5 business days."
        ]
      },
      {
        heading: "Escalation Process",
        content: [
          "If a support ticket is not resolved within the defined SLA timeframe, it will be automatically escalated to our Senior Engineering team for immediate review."
        ]
      },
      {
        heading: "Planned Downtime",
        content: [
          "Any scheduled maintenance requiring system downtime will be communicated at least 48 hours in advance via email and client dashboard notifications."
        ]
      },
      {
        heading: "Customer Responsibilities",
        content: [
          "To ensure SLA compliance, clients must ensure unhindered physical access to the solar installation site for our technicians during scheduled visits."
        ]
      }
    ]
  }
};
