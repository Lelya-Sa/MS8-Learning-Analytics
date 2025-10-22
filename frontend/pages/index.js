import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>MS8 Learning Analytics</title>
        <meta name="description" content="Comprehensive learning analytics platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            🚀 MS8 Learning Analytics
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Comprehensive learning analytics platform with automated CI/CD pipeline
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Frontend</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Next.js application deployed on Vercel
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Backend</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Express.js API deployed on Railway
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Database</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                PostgreSQL database on Supabase
              </p>
            </div>
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #d1fae5'
          }}>
            <p style={{ color: '#065f46', fontSize: '0.875rem' }}>
              ✅ Infrastructure setup complete! Ready for development.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
