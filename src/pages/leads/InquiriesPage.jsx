import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Eye } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Input, Select, FormGroup, SearchInput } from '../../components/UI/FormElements';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Avatar from '../../components/UI/Avatar';
import DropdownMenu from '../../components/UI/DropdownMenu';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import Pagination from '../../components/UI/Pagination';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { useToast } from '../../components/UI/Toast';
import { theme } from '../../theme/constants';
import api from '../../services/api';
import { getPriorityVariant, getStatusVariant } from '../../utils';
import useLocations from '../../hooks/useLocations';
import SearchableSelect from '../../components/UI/SearchableSelect';
import { useNavigate } from 'react-router-dom';



const PER_PAGE = 6;

const INQUIRY_FORM_DEFAULTS = {
  university_name: '',
  university_email: '',
  contact_person_name: '',
  primary_contact: '',
  designation: '',
  university_website: '',
  country: '',
  state: '',
  city: '',
  institution_type: '',
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

const INSTITUTION_TYPE_OPTIONS = [
  { label: 'Incubator / Accelerator', value: 'Incubator / Accelerator' },
  { label: 'University / College', value: 'University / College' },
  { label: 'Startup Community / NGO', value: 'Startup Community / NGO' },
  { label: 'Government Organization', value: 'Government Organization' },
  { label: 'Other', value: 'Other' },
];

const normalizeUniversity = (item) => ({
  ...item,
  _id: item._id || item.id,
  university_name: item.university_name || '',
  university_email: item.university_email || '',
  contact_person_name: item.contact_person_name || '',
  primary_contact: item.primary_contact || '',
  designation: item.designation || '',
  university_website: item.university_website || '',
  country: item.country || '',
  state: item.state || '',
  city: item.city || '',
  institution_type: item.institution_type || '',
  status: item.status || 'New',
  priority: item.priority || 'Medium',
  followUps: item.followUps || [],
});

const InquiryFormFields = ({ values, setFormData }) => {
  const {
    countries,
    states,
    cities,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocations();

  useEffect(() => {
    handleCountryChange(values.country || '');
  }, [handleCountryChange, values.country]);

  useEffect(() => {
    if (values.country) {
      handleStateChange(values.state || '', values.country);
    } else {
      handleStateChange('', '');
    }
  }, [handleStateChange, values.country, values.state]);

  useEffect(() => {
    if (values.state) {
      handleCityChange(values.city || '');
    } else {
      handleCityChange('');
    }
  }, [handleCityChange, values.state, values.city]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.id,
  }));

  const stateOptions = states.map((state) => ({
    label: state.name,
    value: state.id,
  }));

  const cityOptions = cities.map((city) => ({
    label: city.name,
    value: city.id,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <FormGroup label="University / Organization Name">
        <Input
          name="university_name"
          placeholder="Enter organization name"
          value={values.university_name}
          onChange={(e) => updateField('university_name', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="University Email">
        <Input
          name="university_email"
          type="email"
          placeholder="name@domain.com"
          value={values.university_email}
          onChange={(e) => updateField('university_email', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Contact Person Name">
        <Input
          name="contact_person_name"
          placeholder="Enter contact person"
          value={values.contact_person_name}
          onChange={(e) => updateField('contact_person_name', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Primary Contact">
        <Input
          name="primary_contact"
          placeholder="Enter phone number"
          value={values.primary_contact}
          onChange={(e) => updateField('primary_contact', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Designation">
        <Input
          name="designation"
          placeholder="Enter designation"
          value={values.designation}
          onChange={(e) => updateField('designation', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Website">
        <Input
          name="university_website"
          placeholder="https://example.com"
          value={values.university_website}
          onChange={(e) => updateField('university_website', e.target.value)}
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

      <FormGroup label="Institution Type">
        <Select
          value={values.institution_type}
          onChange={(e) => updateField('institution_type', e.target.value)}
          options={INSTITUTION_TYPE_OPTIONS}
          style={{ width: '100%' }}
        />
      </FormGroup>

      <FormGroup label="Status">
        <Select
          value={values.status}
          onChange={(e) => updateField('status', e.target.value)}
          options={STATUS_OPTIONS}
          style={{ width: '100%' }}
        />
      </FormGroup>

      <FormGroup label="Priority">
        <Select
          value={values.priority}
          onChange={(e) => updateField('priority', e.target.value)}
          options={PRIORITY_OPTIONS}
          style={{ width: '100%' }}
        />
      </FormGroup>
    </div>
  );
};

const InquiriesPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(INQUIRY_FORM_DEFAULTS);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/auth/universities");
        setLeads((res.data?.universities || []).map(normalizeUniversity));
        console.log(res.data?.universities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => setFormData(INQUIRY_FORM_DEFAULTS);

  const handleAdd = async () => {
    try {
      const res = await api.post("/auth/universities", formData);
      const newInquiry = normalizeUniversity(res.data?.university || res.data);
      setLeads([newInquiry, ...leads]);
      setAddModal(false);
      resetForm();
      setPage(1);
      toast.success('Inquiry added', `${newInquiry.university_name || 'New inquiry'} has been saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to add inquiry');
    }
  };

  const handleEdit = async () => {
    if (!selectedLead) return;

    try {
      const res = await api.patch(`/auth/universities/${selectedLead._id}`, formData);
      const updatedInquiry = normalizeUniversity(res.data?.university || res.data);
      setLeads(leads.map(l =>
        l._id === selectedLead._id ? updatedInquiry : l
      ));
      setEditModal(false);
      setSelectedLead(null);
      toast.success('Inquiry updated', `${formData.university_name || 'Inquiry'} changes saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to update inquiry');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/auth/universities/${selectedLead._id}`);
      setLeads(leads.filter(l => l._id !== selectedLead._id));
      setDeleteDialog(false);
      toast.success('Inquiry deleted', `${selectedLead?.university_name || 'Inquiry'} removed.`);
      setSelectedLead(null);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to delete inquiry');
    }
  };
  const openEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...INQUIRY_FORM_DEFAULTS,
      ...lead,
    });
    setEditModal(true);
  };

  const filteredLeads = leads.filter((l) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      l.university_name?.toLowerCase().includes(query) ||
      l.university_email?.toLowerCase().includes(query) ||
      l.contact_person_name?.toLowerCase().includes(query) ||
      l.primary_contact?.toLowerCase().includes(query) ||
      l.institution_type?.toLowerCase().includes(query) ||
      l.country?.toLowerCase().includes(query) ||
      l.state?.toLowerCase().includes(query) ||
      l.city?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || l.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || l.priority === priorityFilter;

    const matchesInstitutionType =
      institutionTypeFilter === 'all' || l.institution_type === institutionTypeFilter;

    const matchesCountry =
      countryFilter === 'all' || l.country === countryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesInstitutionType && matchesCountry;
  });

  const countryFilterOptions = Array.from(
    new Set(leads.map((item) => item.country).filter(Boolean))
  ).sort();

  const institutionTypeFilterOptions = Array.from(
    new Set(leads.map((item) => item.institution_type).filter(Boolean))
  ).sort();

  const totalPages = Math.ceil(filteredLeads.length / PER_PAGE);
  const paged = filteredLeads.slice((page - 1) * PER_PAGE, page * PER_PAGE);



  const columns = [
    {
      header: "University",
      accessor: "university_name",
      render: (row) => (
        <div
          onClick={() => navigate(`/inquiries/${row._id}`)}
         style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={row.university_name} size="sm" />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>
              {row.university_name}
            </div>
            <div style={{ fontSize: 11, color: theme.textLight }}>
              {row.university_email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "primary_contact",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500, color: theme.textPrimary }}>{row.contact_person_name || '-'}</div>
          <div style={{ fontSize: 11, color: theme.textLight }}>{row.primary_contact || '-'}</div>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "country",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500, color: theme.textPrimary }}>{row.country || '-'}</div>
          <div style={{ fontSize: 11, color: theme.textLight }}>
            {[row.state, row.city].filter(Boolean).join(', ') || '-'}
          </div>
        </div>
      ),
    },
    
    {
      header: "Status",
      accessor: "status",
render: (row) => (
  <Badge variant={getStatusVariant(row.status)}>
    {row.status}
  </Badge>
)
    },
    {
      header: "Priority",
      accessor: "priority",
   render: (row) => (
  <Badge variant={getPriorityVariant(row.priority)}>
    {row.priority}
  </Badge>
)
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
   
    {
      header: "",
      accessor: "actions",
      render: (row) => (
        <DropdownMenu
          items={[
            { 
              icon: Eye, 
              label: "View Inquiry",
              onClick: () => navigate(`/inquiries/${row._id}`)
            },
            {
              icon: Edit3,
              label: "Edit",
              onClick: () => openEdit(row),
            },
            { divider: true },
            {
              icon: Trash2,
              label: "Delete",
              danger: true,
              onClick: () => {
                setSelectedLead(row);
                setDeleteDialog(true);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
     <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Inquiries' }]} />



      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>
      Inquiries
</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" onClick={() => { resetForm(); setAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Add New Inquiry
          </Button>
        </div>
      </div>

      <Card>
  <div className="mb-4 flex flex-col gap-3">
    
  {/* 📱 Mobile Layout */}
  <div className="flex flex-col gap-3 sm:hidden">
 <FormGroup label="Search">
      <SearchInput
        value={searchQuery}
        onChange={(e)=>{setSearchQuery(e.target.value); setPage(1);}}
        className="w-full"
        placeholder="Search by university, email, contact, location"
      />
    </FormGroup>
    {/* Row 1 */}
    <div className="flex gap-1">
      <div className="flex-1">
        <FormGroup label="Status">
          <Select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Status', value: 'all' },
          { label: 'New', value: 'New' },
          { label: 'Contacted', value: 'Contacted' },
          { label: 'Qualified', value: 'Qualified' },
          { label: 'Lost', value: 'Lost' },
        ]}
        style={{ width: '100%' }}
      />
        </FormGroup>
      </div>

      <div className="flex-1">
        <FormGroup label="Priority">
         <Select
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Priority', value: 'all' },
          { label: 'Low', value: 'Low' },
          { label: 'Medium', value: 'Medium' },
          { label: 'High', value: 'High' },
        ]}
        style={{ width: '100%' }}
      />
        </FormGroup>
      </div>
    </div>

    {/* Row 2 */}
    <div className="flex gap-1">
      <div className="flex-1">
        <FormGroup label="Institution Type">
          <Select
            value={institutionTypeFilter}
            onChange={(e) => {
              setInstitutionTypeFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'University / College', value: 'University / College' },
              { label: 'Incubator / Accelerator', value: 'Incubator / Accelerator' },
              { label: 'Startup Community / NGO', value: 'Startup Community / NGO' },
              { label: 'Government Organization', value: 'Government Organization' },
              { label: 'Other', value: 'Other' },
            ]}
            style={{ width: '100%' }}
          />
        </FormGroup>
      </div>

      <div className="flex-1">
        <FormGroup label="Country">
          <Select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { label: 'All Countries', value: 'all' },
              { label: 'USA', value: 'USA' },
              { label: 'Canada', value: 'Canada' },
              { label: 'UK', value: 'UK' },
            ]}
            style={{ width: '100%' }}
          />
        </FormGroup>
      </div>
    </div>
  </div>

  {/* 💻 Desktop Layout */}
  <div className="hidden sm:grid sm:grid-cols-5 gap-3 items-end">
    
    <FormGroup label="Search">
      <SearchInput
        value={searchQuery}
        onChange={(e)=>{setSearchQuery(e.target.value); setPage(1);}}
        className="w-full"
        placeholder="Search by university, email, contact, location"
      />
    </FormGroup>

    <FormGroup label="Status">
      <Select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Status', value: 'all' },
          { label: 'New', value: 'New' },
          { label: 'Contacted', value: 'Contacted' },
          { label: 'Qualified', value: 'Qualified' },
          { label: 'Lost', value: 'Lost' },
        ]}
        style={{ width: '100%' }}
      />
    </FormGroup>

    <FormGroup label="Priority">
     <Select
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Priority', value: 'all' },
          { label: 'Low', value: 'Low' },
          { label: 'Medium', value: 'Medium' },
          { label: 'High', value: 'High' },
        ]}
        style={{ width: '100%' }}
      />
    </FormGroup>

    <FormGroup label="Institution Type">
      <Select
        value={institutionTypeFilter}
        onChange={(e) => {
          setInstitutionTypeFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Types', value: 'all' },
          { label: 'University / College', value: 'University / College' },
          { label: 'Incubator / Accelerator', value: 'Incubator / Accelerator' },
          { label: 'Startup Community / NGO', value: 'Startup Community / NGO' },
          { label: 'Government Organization', value: 'Government Organization' },
          { label: 'Other', value: 'Other' },
        ]}
        style={{ width: '100%' }}
      />
    </FormGroup>

    <FormGroup label="Country">
      <Select
        value={countryFilter}
        onChange={(e) => {
          setCountryFilter(e.target.value);
          setPage(1);
        }}
        options={[
          { label: 'All Countries', value: 'all' },
          { label: 'USA', value: 'USA' },
          { label: 'Canada', value: 'Canada' },
          { label: 'UK', value: 'UK' },
        ]}
        style={{ width: '100%' }}
      />
    </FormGroup>

  </div>

</div>

        <Table
          rowKey="_id"
          columns={columns}
          data={paged}
          emptyMessage="No inquiries found"
          compact
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredLeads.length}
          perPage={PER_PAGE}
        />
      </Card>

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Inquiry" size="md"
        footer={<><Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAdd}>Add Inquiry</Button></>}>
        <InquiryFormFields values={formData} setFormData={setFormData} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Inquiry" size="md"
        footer={<><Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button><Button variant="primary" onClick={handleEdit}>Save Changes</Button></>}>
        <InquiryFormFields values={formData} setFormData={setFormData} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Delete ${selectedLead?.university_name}?`}
          message="This will remove the inquiry and all associated data. This action cannot be undone."
      />
    </div>
  );
};

export default InquiriesPage;
