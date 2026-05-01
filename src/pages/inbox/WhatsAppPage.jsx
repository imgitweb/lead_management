import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/UI/Breadcrumb';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { theme } from '../../theme/constants';

const WhatsAppPage = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      navigate('/chat');
    }, 700);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Inbox', path: '/inbox/whatsapp' }, { label: 'WhatsApp' }]} />

      <div style={{
        minHeight: 'calc(100vh - 220px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 0',
      }}>
        <Card style={{
          width: '100%',
          maxWidth: 640,
          padding: '40px 28px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(3,217,133,0.06) 0%, rgba(255,255,255,1) 100%)',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3,217,133,0.12)',
            color: theme.primary,
          }}>
            <MessageCircle style={{ width: 34, height: 34 }} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '6px 12px', background: 'rgba(3,217,133,0.08)', color: theme.primary, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
            <Smartphone style={{ width: 14, height: 14 }} /> WhatsApp Inbox
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.textPrimary, margin: '0 0 10px' }}>
            Connect your WhatsApp account
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: theme.textLight, margin: '0 auto 28px', maxWidth: 480 }}>
            Connect your account first, then we will open the existing chat workspace so your team can continue conversations from one place.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28, textAlign: 'left' }}>
            <div style={{ padding: 16, borderRadius: 16, background: '#fff', border: `1px solid ${theme.cardBorder}` }}>
              <CheckCircle2 style={{ width: 18, height: 18, color: theme.primary, marginBottom: 10 }} />
              <div style={{ fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Quick setup</div>
              <div style={{ fontSize: 13, color: theme.textLight }}>Connect in one click and continue into chat.</div>
            </div>
            <div style={{ padding: 16, borderRadius: 16, background: '#fff', border: `1px solid ${theme.cardBorder}` }}>
              <ShieldCheck style={{ width: 18, height: 18, color: theme.primary, marginBottom: 10 }} />
              <div style={{ fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Secure access</div>
              <div style={{ fontSize: 13, color: theme.textLight }}>Keep your messaging workflow organized and safe.</div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleConnect}
            disabled={connecting}
            style={{ minWidth: 220, height: 48, fontSize: 15, fontWeight: 700 }}
          >
            {connecting ? 'Connecting...' : 'Connect Account'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppPage;
