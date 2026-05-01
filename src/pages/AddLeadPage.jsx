import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Breadcrumb from '../components/UI/Breadcrumb';
import { Input, Select, FormGroup } from '../components/UI/FormElements';
import SearchableSelect from '../components/UI/SearchableSelect';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';
import api from '../services/api';
import useLocations from '../hooks/useLocations';
import { getPriorityVariant, getStatusVariant } from '../utils';

const FORM_DEFAULTS = {
  name: '',
  email: '',
  phone: '',
  country: '',
  userType: '',
  organization: '',
  interest: '',
  note: '',
  type: 'contact',
  status: 'New',
  priority: 'Medium',
};

const STATUS_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Lost', value: 'Lost' },
];

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

const TYPE_OPTIONS = [
  { label: 'contact', value: 'contact' },
  { label: 'schedule', value: 'schedule' },
  { label: 'demo', value: 'demo' },
];

const AddLeadPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState(FORM_DEFAULTS);
  const { countries, handleCountryChange } = useLocations();

  useEffect(() => {
    handleCountryChange(formData.country || '');
  }, [handleCountryChange, formData.country]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countryOptions = countries.map((country) => ({ label: country.name, value: country.id }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/contact', formData);
      toast.success('Lead added', `${formData.name || 'Lead'} has been saved.`);
      navigate('/leads');
    } catch (err) {
      console.error(err);
      toast.error('Error', err?.response?.data?.message || 'Failed to add lead');
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Leads', path: '/leads' }, { label: 'Add Lead' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.textPrimary, margin: 0 }}>Add Lead</h1>
          <p style={{ margin: '8px 0 0', color: theme.textLight }}>Create a new lead with the same model-backed fields used in the leads list.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/leads')}>Back to Leads</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormGroup label="Lead Name">
            <Input value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Enter full name" />
          </FormGroup>
          <FormGroup label="Phone Number">
            <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Enter phone number" />
          </FormGroup>
          <FormGroup label="Email Address">
            <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@company.com" />
          </FormGroup>
          <FormGroup label="User Type">
            <Input value={formData.userType} onChange={(e) => updateField('userType', e.target.value)} placeholder="Enter user type" />
          </FormGroup>
          <FormGroup label="Organization">
            <Input value={formData.organization} onChange={(e) => updateField('organization', e.target.value)} placeholder="Enter organization" />
          </FormGroup>
          <FormGroup label="Interest">
            <Input value={formData.interest} onChange={(e) => updateField('interest', e.target.value)} placeholder="Enter interest" />
          </FormGroup>
          <SearchableSelect
            label="Country"
            value={formData.country}
            options={countryOptions}
            placeholder="Search country"
            onSelect={(countryCode) => updateField('country', countryCode)}
          />
          <FormGroup label="Type">
            <Select value={formData.type} onChange={(e) => updateField('type', e.target.value)} options={TYPE_OPTIONS} style={{ width: '100%' }} />
          </FormGroup>
          <FormGroup label="Status">
            <Select value={formData.status} onChange={(e) => updateField('status', e.target.value)} options={STATUS_OPTIONS} style={{ width: '100%' }} />
          </FormGroup>
          <FormGroup label="Priority">
            <Select value={formData.priority} onChange={(e) => updateField('priority', e.target.value)} options={PRIORITY_OPTIONS} style={{ width: '100%' }} />
          </FormGroup>
          <div style={{ gridColumn: 'span 2' }}>
            <FormGroup label="Note">
              <textarea
                value={formData.note}
                onChange={(e) => updateField('note', e.target.value)}
                placeholder="Enter note"
                style={{ width: '100%', minHeight: 120, border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusMd, padding: 12, fontSize: 14, color: theme.textPrimary, background: theme.inputBg, outline: 'none', resize: 'vertical' }}
              />
            </FormGroup>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/leads')}>Cancel</Button>
            <Button variant="primary" type="submit">Save Lead</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddLeadPage;
