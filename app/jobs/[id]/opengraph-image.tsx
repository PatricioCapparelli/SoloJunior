import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const alt = 'Detalle del Empleo - SoloJunior';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const job = await prisma.job.findUnique({
        where: { id },
    });

    if (!job) {
        return new ImageResponse(
            (
                <div style={{ fontSize: 48, background: 'black', color: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    SoloJunior
                </div>
            )
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#020617',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '14px solid #5AB1C3',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Efectos de Brillo (Glow) */}
                <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: '#5AB1C3', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }} />
                <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: '#5AB1C3', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }} />

                {/* Logo / Marca */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                        Solo<span style={{ color: '#5AB1C3' }}>Junior</span> 🐆
                    </div>
                </div>

                {/* Tarjeta Central */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '40px 60px',
                        borderRadius: '20px',
                        border: '1px solid #334155',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        maxWidth: '80%',
                        textAlign: 'center',
                    }}
                >
                    {/* Título del Job */}
                    <div style={{ fontSize: 64, fontWeight: 'bold', color: 'white', marginBottom: '10px', lineHeight: 1.1 }}>
                        {job.title.length > 50 ? job.title.slice(0, 50) + '...' : job.title}
                    </div>

                    {/* Empresa */}
                    <div style={{ fontSize: 32, color: '#94a3b8', marginBottom: '30px' }}>
                        en <span style={{ color: '#5AB1C3', fontWeight: 'bold' }}>{job.company}</span>
                    </div>

                    {/* Badges / Detalles */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '10px 20px', borderRadius: '10px', fontSize: 24 }}>
                            {job.workMode}
                        </div>
                        <div style={{ background: '#5AB1C3', color: '#0f172a', padding: '10px 20px', borderRadius: '10px', fontSize: 24, fontWeight: 'bold' }}>
                            {job.seniority}
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <div style={{ position: 'absolute', bottom: 40, color: '#64748b', fontSize: 20 }}>
                    La bolsa de trabajo donde la experiencia NO es requisito.
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}