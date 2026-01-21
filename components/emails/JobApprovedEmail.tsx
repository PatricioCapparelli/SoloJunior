import * as React from 'react';

interface EmailProps {
    jobTitle: string;
    companyName: string;
    userName: string;
    jobId: string;
}

export const JobApprovedEmail: React.FC<Readonly<EmailProps>> = ({
    jobTitle,
    companyName,
    userName,
    jobId,
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#333', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
            <h1 style={{ color: '#5AB1C3', margin: 0, fontSize: '24px' }}>SoloJunior 🐆</h1>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', padding: '20px', borderRadius: '0 0 8px 8px' }}>
            <h2 style={{ color: '#16a34a' }}>¡Buenas noticias, {userName}! 🚀</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Tu oferta ha sido <strong>aprobada</strong> y ya está visible para miles de juniors.
            </p>

            <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '6px', margin: '20px 0', border: '1px solid #bbf7d0' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#15803d' }}>{jobTitle}</h3>
                <p style={{ margin: 0, color: '#166534' }}>en {companyName}</p>
            </div>

            <p>Compartí este link en tus redes para conseguir más postulantes:</p>

            <a
                href={`https://solo-junior.vercel.app/jobs/${jobId}`}
                style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#fff', padding: '12px 24px', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px' }}
            >
                Ver Oferta en Vivo
            </a>
        </div>
    </div>
);