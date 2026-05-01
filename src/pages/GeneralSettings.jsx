import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Monitor, Moon, Sun, Trash2, AlertTriangle, LogOut, Copy } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Toggle from '../components/UI/Toggle';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { Input, Select } from '../components/UI/FormElements';
import { Checkbox } from '../components/UI/CheckboxRadio';
import Tabs from '../components/UI/Tabs';
import Breadcrumb from '../components/UI/Breadcrumb';
import Tooltip from '../components/UI/Tooltip';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const GeneralSettings = () => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY

  // Notification toggles
  const [notifs, setNotifs] = useState({
    email: true, push: true, revenue: true,
    weekly: false, newFeatures: true, security: true,
  });

  const toggleNotif = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const GeneralTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Globe style={{ width: 16, height: 16, color: theme.primary }} />
          <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Regional Settings</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Language</label>
            <Select options={[
              { label: 'English', value: 'en' }, { label: 'Hindi', value: 'hi' },
              { label: 'Spanish', value: 'es' }, { label: 'French', value: 'fr' },
            ]} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Timezone</label>
            <Select options={[
              { label: 'Asia/Kolkata (UTC+5:30)', value: 'ist' },
              { label: 'America/New_York (UTC-5)', value: 'est' },
              { label: 'Europe/London (UTC+0)', value: 'gmt' },
              { label: 'Asia/Tokyo (UTC+9)', value: 'jst' },
            ]} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Currency Display</label>
            <Select options={[
              { label: 'USD ($)', value: 'usd' }, { label: 'EUR (€)', value: 'eur' },
              { label: 'INR (₹)', value: 'inr' }, { label: 'GBP (£)', value: 'gbp' },
            ]} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Date Format</label>
            <Select options={[
              { label: 'MM/DD/YYYY', value: 'mdy' }, { label: 'DD/MM/YYYY', value: 'dmy' },
              { label: 'YYYY-MM-DD', value: 'ymd' },
            ]} style={{ width: '100%' }} />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Palette style={{ width: 16, height: 16, color: theme.primary }} />
          <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Appearance</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 10, display: 'block' }}>Theme</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((t) => (
                <div key={t.id} style={{
                  flex: 1, padding: '14px 12px', borderRadius: 10, textAlign: 'center',
                  border: `2px solid ${t.id === 'light' ? theme.primary : theme.cardBorder}`,
                  background: t.id === 'light' ? theme.primaryLight : theme.cardBg,
                  cursor: 'pointer', transition: theme.transition,
                }}>
                  <t.icon style={{ width: 20, height: 20, color: t.id === 'light' ? theme.primary : theme.textMuted, marginBottom: 6 }} />
                  <div style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: t.id === 'light' ? theme.primary : theme.textSecondary }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: theme.fontSizeMuted, fontWeight: theme.fontWeightSemiBold, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Sidebar Density</label>
            <Select options={[
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' },
            ]} style={{ width: '100%' }} />
          </div>
        </div>
      </Card>
    </div>
  );

  const NotificationsTab = () => (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Bell style={{ width: 16, height: 16, color: theme.primary }} />
        <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Notification Preferences</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Toggle label="Email Notifications" description="Receive updates via email" checked={notifs.email} onChange={() => toggleNotif('email')} />
        <Toggle label="Push Notifications" description="Browser push alerts" checked={notifs.push} onChange={() => toggleNotif('push')} />
        <Toggle label="Revenue Alerts" description="Get notified on revenue milestones" checked={notifs.revenue} onChange={() => toggleNotif('revenue')} />
        <Toggle label="Weekly Digest" description="Summary of weekly performance" checked={notifs.weekly} onChange={() => toggleNotif('weekly')} />
        <Toggle label="New Features" description="Updates about new platform features" checked={notifs.newFeatures} onChange={() => toggleNotif('newFeatures')} />
        <Toggle label="Security Alerts" description="Login attempts and account changes" checked={notifs.security} onChange={() => toggleNotif('security')} />
      </div>
    </Card>
  );

  const SecurityTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Shield style={{ width: 16, height: 16, color: theme.primary }} />
          <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Security Settings</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Toggle label="Two-Factor Authentication" description="Add extra security to your account" checked={true} onChange={() => {}} />
          <Toggle label="Login Notifications" description="Get alerted for new login attempts" checked={true} onChange={() => {}} />
          <Toggle label="API Access" description="Allow programmatic API access" checked={false} onChange={() => {}} />
        </div>

        <div style={{ marginTop: 16 }}>
          <Button variant="outline" onClick={() => setApiKeyModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 14, height: 14 }} /> Generate API Key
          </Button>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary }}>Active Sessions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { device: 'Chrome on MacOS', ip: '192.168.1.100', time: 'Active now', current: true },
            { device: 'Safari on iPhone', ip: '10.0.0.15', time: '2 hours ago', current: false },
            { device: 'Firefox on Windows', ip: '172.16.0.5', time: '1 day ago', current: false },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 8, border: `1px solid ${theme.cardBorder}`,
              background: s.current ? theme.primaryLight : theme.cardBg,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{s.device}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{s.ip} · {s.time}</div>
              </div>
              {s.current ? (
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.primary }}>● Current</span>
              ) : (
                <Button variant="ghost" style={{ padding: '4px 12px', fontSize: 12 }}>Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card style={{ borderColor: '#fecaca' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle style={{ width: 16, height: 16, color: '#ef4444' }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>Danger Zone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>Delete Account</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Permanently delete your account and all data</div>
          </div>
          <Button variant="ghost" onClick={() => setDeleteDialog(true)}
            style={{ color: '#ef4444', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 style={{ width: 14, height: 14 }} /> Delete
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #fef2f2' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>Export Data</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Download all your data before leaving</div>
          </div>
          <Button variant="ghost" onClick={() => setExportModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Export Data
          </Button>
        </div>
      </Card>
    </div>
  );

  const toast = useToast();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]} />
      <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 24 }}>Settings</h1>

      <Tabs tabs={[
        { label: 'General', content: <GeneralTab /> },
        { label: 'Notifications', content: <NotificationsTab /> },
        { label: 'Security', content: <SecurityTab /> },
      ]} />

      {/* Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <Button variant="ghost">Reset</Button>
        <Button variant="primary" onClick={() => toast.success('Saved', 'Settings saved successfully.')}>Save Settings</Button>
      </div>

      {/* Delete Account Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => toast.error('Account Deleted', 'Your account has been permanently deleted.')}
        type="delete"
        title="Delete Account?"
        message="This action is irreversible. All your apps, reports, and data will be permanently deleted."
      />

      {/* API Key Modal */}
      <Modal isOpen={apiKeyModal} onClose={() => setApiKeyModal(false)} title="API Key" size="md"
        footer={<Button variant="primary" onClick={() => { setApiKeyModal(false); toast.success('Done', 'API key saved.'); }}>Done</Button>}
      >
        <div>
          <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>Your API key has been generated. Copy it now — it won't be shown again.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              flex: 1, padding: '12px 16px', background: '#fafafa', borderRadius: 8,
              border: `1px solid ${theme.cardBorder}`, fontFamily: 'monospace',
              fontSize: 14, color: theme.textSecondary, wordBreak: 'break-all',
            }}>
             {STRIPE_KEY}
            </div>
            <Tooltip text="Copy to clipboard" position="top">
              <button onClick={() => { navigator.clipboard.writeText(STRIPE_KEY); toast.success('Copied', 'API key copied to clipboard.'); }}
                style={{ padding: 8, borderRadius: 6, border: 'none', background: '#f0f0f0', cursor: 'pointer', color: theme.textMuted }}>
                <Copy style={{ width: 16, height: 16 }} />
              </button>
            </Tooltip>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={exportModal} onClose={() => setExportModal(false)} title="Export Data" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setExportModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setExportModal(false); toast.info('Export Started', 'Your data export has begun. You will be notified when ready.'); }}>Start Export</Button>
        </>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 13, color: theme.textMuted }}>Select data to include in your export:</p>
          {['App data & settings', 'Reports & analytics', 'Transaction history', 'Payment information'].map((item, i) => (
            <Checkbox key={i} label={item} checked={true} onChange={() => {}} />
          ))}
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Export Format</label>
            <Select options={[{ label: 'JSON', value: 'json' }, { label: 'CSV', value: 'csv' }]} style={{ width: '100%' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeneralSettings;
 