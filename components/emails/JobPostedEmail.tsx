import * as React from 'react';

interface EmailProps {
    jobTitle: string;
    companyName: string;
    userName: string;
    jobId: string;
}

export const JobPostedEmail: React.FC<Readonly<EmailProps>> = ({
    jobTitle,
    companyName,
    userName,
    jobId,
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <h1 style={{ color: '#5AB1C3' }}>¡Hola {userName}! 🐆</h1>
        <p>Gracias por publicar tu oferta en <strong>SoloJunior</strong>.</p>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h2 style={{ margin: 0 }}>{jobTitle}</h2>
            <p style={{ color: '#666' }}>en {companyName}</p>
        </div>

        <p>Tu oferta ha sido recibida correctamente y está <strong>pendiente de revisión</strong>.</p>
        <p>Te avisaremos en cuanto esté pública para que puedas compartirla.</p>

        <a
            href={`https://solo-junior.vercel.app/jobs/${jobId}`}
            style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px' }}
        >
            Ver Publicación
        </a>

        <p style={{ fontSize: '12px', color: '#888', marginTop: '30px' }}>
            Si no fuiste vos, ignorá este mensaje.
        </p>
    </div>
);