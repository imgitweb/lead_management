import React, { useState, useEffect } from 'react';
import { Gift, Users, DollarSign, Copy, CheckCircle, Share2, Trophy, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Avatar from '../components/UI/Avatar';
import Breadcrumb from '../components/UI/Breadcrumb';
import ProgressBar from '../components/UI/ProgressBar';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_REFERRALS = [
  { id: 1, name: 'Rahul Sharma', email: 'r.shar***@gmail.com', date: 'Apr 20, 2026', status: 'Active', earnings: '$45.00' },
  { id: 2, name: 'Priya Patel', email: 'p.pat***@gmail.com', date: 'Apr 15, 2026', status: 'Active', earnings: '$32.00' },
  { id: 3, name: 'Amit Kumar', email: 'a.kum***@gmail.com', date: 'Apr 10, 2026', status: 'Pending', earnings: '$0.00' },
  { id: 4, name: 'Sara Johnson', email: 's.joh***@gmail.com', date: 'Mar 28, 2026', status: 'Active', earnings: '$67.50' },
  { id: 5, name: 'Mike Chen', email: 'm.che***@gmail.com', date: 'Mar 15, 2026', status: 'Active', earnings: '$120.00' },
];

const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const referralCode = 'CINFY-AJ2026';
  const referralLink = `https://cinfy.io/ref/${referralCode}`;

  const toast = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Copied!', 'Referral link copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const columns = [
    { header: 'Name', accessor: 'name', render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={row.name} size="sm" />
        <span style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</span>
      </div>
    ) },
    ...(isMobile ? [] : [{ header: 'Email', accessor: 'email' }]),
    ...(isMobile ? [] : [{ header: 'Date Joined', accessor: 'date' }]),
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: row.status === 'Active' ? 'rgba(3,217,133,0.08)' : 'rgba(249,115,22,0.08)',
          color: row.status === 'Active' ? '#16a34a' : '#f97316',
        }}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Earnings',
      accessor: 'earnings',
      render: (row) => <span style={{ fontWeight: 700, color: theme.primary }}>{row.earnings}</span>,
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Referral Program' }]} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Referral Program</h1>
      </div>

      {/* Referral Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Referrals', value: '5', icon: Users, color: '#3b82f6' },
          { label: 'Active Users', value: '4', icon: CheckCircle, color: '#16a34a' },
          { label: 'Total Earned', value: '$264.50', icon: DollarSign, color: theme.primary },
          { label: 'Your Rank', value: '#12', icon: Trophy, color: '#f97316' },
        ].map((s) => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: isMobile ? '12px 14px' : '16px 18px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.icon style={{ width: 18, height: 18, color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.textPrimary }}>{s.value}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Referral Link Card */}
      <Card style={{
        marginBottom: 24, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.cardBg} 0%, rgba(3,217,133,0.04) 100%)`,
        border: `1px solid rgba(3,217,133,0.15)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Gift style={{ width: 20, height: 20, color: theme.primary }} />
          <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: theme.textPrimary }}>Share & Earn</span>
        </div>
        <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
          Earn <strong style={{ color: theme.primary }}>10% commission</strong> on every referral's earnings for the first 12 months.
          Share your unique link below.
        </p>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, alignItems: isMobile ? 'stretch' : 'center' }}>
          <div style={{
            flex: 1, padding: '12px 16px', background: '#fafafa',
            border: `1px solid ${theme.cardBorder}`, borderRadius: 8,
            fontSize: 14, color: theme.textSecondary, fontFamily: 'monospace',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap',
          }}>
            {referralLink}
          </div>
          <Button variant="primary" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            {copied ? <CheckCircle style={{ width: 16, height: 16 }} /> : <Copy style={{ width: 16, height: 16 }} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <Share2 style={{ width: 16, height: 16 }} /> Share
          </Button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            Your Code: <strong style={{ color: theme.primary }}>{referralCode}</strong>
          </div>
        </div>
      </Card>

      {/* Rewards Tiers */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Star style={{ width: 16, height: 16, color: '#f59e0b' }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Reward Tiers</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { tier: 'Bronze', refs: '1-5 referrals', reward: '10% commission', color: '#b45309', active: true },
            { tier: 'Silver', refs: '6-15 referrals', reward: '15% commission', color: '#6b7280', active: false },
            { tier: 'Gold', refs: '16+ referrals', reward: '20% commission', color: '#f59e0b', active: false },
          ].map((t) => (
            <div key={t.tier} style={{
              padding: '16px', borderRadius: 10, textAlign: 'center',
              border: `2px solid ${t.active ? t.color : theme.cardBorder}`,
              background: t.active ? `${t.color}08` : theme.cardBg,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.tier}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>{t.refs}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary }}>{t.reward}</div>
              {t.active && <div style={{ fontSize: 11, color: t.color, fontWeight: 600, marginTop: 6 }}>● Current Tier</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <ProgressBar value={5} max={6} label="Referrals until Silver Tier" showLabel color={theme.primary} />
        </div>
      </Card>

      {/* Referral Table */}
      <Card>
        <span style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Your Referrals</span>
        <Table columns={columns} data={DEMO_REFERRALS} emptyMessage="No referrals yet. Share your link to get started!" />
      </Card>
    </div>
  );
};

export default ReferralProgram;
