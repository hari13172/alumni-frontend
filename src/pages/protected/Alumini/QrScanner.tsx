// src/components/QRScanner.tsx
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router';

const QRScanner: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const navigate = useNavigate();

  const handleScan = (data: string | null) => {
    if (data) {
      setResult(data);
      try {
        const url = new URL(data);
        // Check if the URL matches the app's domain
        if (url.origin === window.location.origin) {
          navigate(url.pathname); // Navigate to the path within the app
        } else {
          window.location.href = data; // Redirect to external URL
        }
      } catch (error) {
        setResult('Invalid QR code');
      }
    }
  };

  const handleError = (err: Error) => {
    console.error(err);
    setResult('Error scanning QR code');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>QR Code Scanner</h2>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            handleScan(result?.getText());
          }
          if (error) {
            handleError(error);
          }
        }}
        constraints={{ facingMode: 'environment' }} // Use rear camera by default
      />
      <p>Scanned Result: {result}</p>
    </div>
  );
};

export default QRScanner;