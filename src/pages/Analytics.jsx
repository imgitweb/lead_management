import React, { useState } from 'react';
import Modal from '../components/UI/Modal';
import { Input, Select, FormGroup } from '../components/UI/FormElements';
import SearchableSelect from '../components/UI/SearchableSelect';
import useLocations from '../hooks/useLocations';
import { useToast } from '../components/UI/Toast';
// Import Lead form logic from LeadsPage
import { getPriorityVariant, getStatusVariant } from '../utils';
// Lead form defaults and helpers (copy from LeadsPage)
const LEAD_FORM_DEFAULTS = {
  name: '',
  email: '',
  phone: '',
  country: '',
  state: '',
  city: '',
  source: '',
  status: 'New',
  priority: 'Low',
};
const STATUS_DEFAULTS = ['New', 'Qualified', 'Contacted' , 'Lost'];
const PRIORITY_DEFAULTS = ['High', 'Medium', 'Low'];
const SOURCE_DEFAULTS = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'];
function getUniqueOptions(arr, key, defaults) {
  const values = Array.from(new Set(arr.map((item) => item[key]).filter(Boolean)));
  const merged = Array.from(new Set([...values, ...defaults]));
  return merged.map((v) => ({ label: v, value: v }));
}

const LeadFormFields = ({ values, setFormData, statusOptions, priorityOptions, sourceOptions }) => {
  const {
    countries,
    states,
    cities,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocations();

  React.useEffect(() => {
    handleCountryChange(values.country || '');
  }, [handleCountryChange, values.country]);

  React.useEffect(() => {
    if (values.country) {
      handleStateChange(values.state || '', values.country);
    } else {
      handleStateChange('', '');
    }
  }, [handleStateChange, values.country, values.state]);

  React.useEffect(() => {
    if (values.state) {
      handleCityChange(values.city || '');
    } else {
      handleCityChange('');
    }
  }, [handleCityChange, values.state, values.city]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countryOptions = countries.map((country) => ({ label: country.name, value: country.id }));
  const stateOptions = states.map((state) => ({ label: state.name, value: state.id }));
  const cityOptions = cities.map((city) => ({ label: city.name, value: city.id }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormGroup label="Lead Name">
        <Input
          name="name"
          placeholder="Enter full name"
          value={values.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Phone Number">
        <Input
          name="phone"
          placeholder="Enter phone number"
          value={values.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Email Address">
        <Input
          name="email"
          type="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </FormGroup>

      <SearchableSelect
        label="Country"
        value={values.country}
        options={countryOptions}
        placeholder="Search country"
        onSelect={(countryCode) => {
          handleCountryChange(countryCode);
          setFormData((prev) => ({
            ...prev,
            country: countryCode,
            state: '',
            city: '',
          }));
        }}
      />

      <SearchableSelect
        label="State"
        value={values.state}
        options={stateOptions}
        placeholder={values.country ? 'Search state' : 'Select country first'}
        disabled={!values.country}
        onSelect={(stateCode) => {
          handleStateChange(stateCode, values.country);
          setFormData((prev) => ({
            ...prev,
            state: stateCode,
            city: '',
          }));
        }}
      />

      <SearchableSelect
        label="City"
        value={values.city}
        options={cityOptions}
        placeholder={values.state ? 'Search city' : 'Select state first'}
        disabled={!values.state}
        onSelect={(cityName) => {
          handleCityChange(cityName);
          setFormData((prev) => ({ ...prev, city: cityName }));
        }}
      />

      <SearchableSelect
        label="Source"
        value={values.source}
        options={sourceOptions}
        placeholder="Search source"
        onSelect={(source) => updateField('source', source)}
      />

      <FormGroup label="Status">
        <Select
          value={values.status}
          onChange={(e) => updateField('status', e.target.value)}
          options={statusOptions}
          style={{ width: '100%' }}
        />
      </FormGroup>

      <FormGroup label="Priority">
        <Select
          value={values.priority}
          onChange={(e) => updateField('priority', e.target.value)}
          options={priorityOptions}
          style={{ width: '100%' }}
        />
      </FormGroup>
    </div>
  );
};
import { DollarSign, Eye, MousePointerClick, Target, Activity, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/UI/StatCard';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Breadcrumb from '../components/UI/Breadcrumb';
import { theme } from '../theme/constants';
import { useEffect, useMemo } from 'react';
import api from '../services/api';

const Analytics = () => {
   const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // 🚀 FETCH DATA
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState(LEAD_FORM_DEFAULTS);
  const toast = useToast();
    // Dynamic filter options for form
    const statusOptions = [
      { label: 'All Status', value: 'all' },
      ...getUniqueOptions(leads, 'status', STATUS_DEFAULTS),
    ];
    const priorityOptions = [
      { label: 'All Priority', value: 'all' },
      ...getUniqueOptions(leads, 'priority', PRIORITY_DEFAULTS),
    ];
    const sourceOptions = getUniqueOptions(leads, 'source', SOURCE_DEFAULTS);

    const handleAdd = () => {
      const newLead = {
        ...formData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setLeads([newLead, ...leads]);
      setAddModal(false);
      setFormData(LEAD_FORM_DEFAULTS);
      toast.success('Lead added', `${newLead.name || 'New lead'} has been saved.`);
    };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadRes, inquiryRes] = await Promise.all([
          api.get('/contact'),
          api.get('/auth/universities'),
        ]);

        const leadData = leadRes.data;
        const inquiryData = inquiryRes.data;

        setLeads(leadData?.contacts || []);
        setInquiries(inquiryData?.universities || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 📊 SUMMARY
const stats = useMemo(() => {
  const today = new Date().toDateString();

  return {
    totalLeads: leads.length,
    totalInquiries: inquiries.length,

    todayLeads: leads.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    ).length,

    todayInquiries: inquiries.filter(
      (i) => new Date(i.createdAt).toDateString() === today
    ).length,

    qualified: leads.filter(l => l.status === "Qualified").length,
    highPriority: leads.filter(l => l.priority === "High").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    newInquiries: inquiries.filter(i => i.status === "New").length,
  };
}, [leads, inquiries]);

  const [chartPeriod, setChartPeriod] = useState('daily');

const chartData = useMemo(() => {
  const map = {};

  const getKey = (date) => {
    const d = new Date(date);

    if (chartPeriod === "daily") {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }

    if (chartPeriod === "weekly") {
      const week = Math.ceil(d.getDate() / 7);
      return `Week ${week}`;
    }

    if (chartPeriod === "monthly") {
      return d.toLocaleDateString("en-US", { month: "short" });
    }
  };

  leads.forEach((l) => {
    const key = getKey(l.createdAt);
    if (!map[key]) map[key] = { name: key, leads: 0, inquiries: 0 };
    map[key].leads += 1;
  });

  inquiries.forEach((i) => {
    const key = getKey(i.createdAt);
    if (!map[key]) map[key] = { name: key, leads: 0, inquiries: 0 };
    map[key].inquiries += 1;
  });

  return Object.values(map);
}, [leads, inquiries, chartPeriod]);



  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Analytics' }]} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Analytics</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setAddModal(true)}>
            <Plus style={{ width: 16, height: 16 }} />  Add New Lead
          </Button>
              {/* Add Lead Modal */}
              <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Lead" size="md"
                footer={<><Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAdd}>Add Lead</Button></>}>
                <LeadFormFields values={formData} setFormData={setFormData} statusOptions={getUniqueOptions(leads, 'status', STATUS_DEFAULTS)} priorityOptions={getUniqueOptions(leads, 'priority', PRIORITY_DEFAULTS)} sourceOptions={sourceOptions} />
              </Modal>
        </div>
      </div>


      {/* Responsive Stat Cards Grid: Tailwind version, 2 per row on md+, 1 per row on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Eye} title="Total Leads" value={stats.totalLeads} iconBg={theme.statIcons.impressions} path="/leads" trend="+12%" trendUp={true} />
        <StatCard icon={DollarSign} title="Total Inquiries" value={stats.totalInquiries} iconBg={theme.statIcons.revenue} path="/inquiries" />
        <StatCard icon={Target} title="Qualified Leads" value={stats.qualified} iconBg={theme.statIcons.ecpm} path="/leads" />
        <StatCard icon={Activity} title="High Priority" value={stats.highPriority} iconBg={theme.statIcons.fillRate} path="/high-priority" />
        <StatCard icon={MousePointerClick} title="Contacted Leads" value={stats.contacted} iconBg={theme.statIcons.clicks} path="/leads" />
        {/* <StatCard icon={Scissors} title="New Inquiries" value={stats.newInquiries} iconBg={theme.statIcons.ctr} path="/new-inquiries" /> */}
      </div>



      {/* Performance Chart */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <Activity style={{ width: 18, height: 18, color: theme.primary }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>Performance Measurements</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', background: theme.cardBg,
              border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusSm,
              fontSize: 13, color: theme.textSecondary, cursor: 'pointer',
            }}>
             <div style={{ fontSize: 14, fontWeight: 500 }}>
  Leads vs Inquiries
</div>
            </div>
            <button style={{
              width: 30, height: 30, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: theme.cardBg, border: `1px solid ${theme.inputBorder}`,
              color: theme.textLight, cursor: 'pointer',
            }}>
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div style={{ display: 'flex', borderRadius: theme.radiusSm, overflow: 'hidden', border: `1px solid ${theme.inputBorder}`, width: 'fit-content', maxWidth: '100%' }}>
            {['Daily', 'Weekly', 'Monthly'].map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p.toLowerCase())}
                style={{
                  padding: '7px 16px', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: theme.transition, border: 'none',
                  background: chartPeriod === p.toLowerCase() ? '#222' : theme.cardBg,
                  color: chartPeriod === p.toLowerCase() ? '#fff' : theme.textMuted,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 300, width: '100%', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#e0e0e0" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#e0e0e0" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.textPrimary, fontSize: 13, boxShadow: theme.shadowMd }}
                itemStyle={{ color: theme.primary }}
              />
             <Area type="monotone" dataKey="leads" stroke="#4f46e5" fill="#4f46e533" />
<Area type="monotone" dataKey="inquiries" stroke="#22c55e" fill="#22c55333" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* No data text */}
       {chartData.length === 0 && (
  <div style={{ textAlign: 'center', padding: 20 }}>
    No lead data available
  </div>
)}
      </Card>
    </div>
  );
};

export default Analytics;
