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



const PER_PAGE = 4;

const LEAD_FORM_DEFAULTS = {
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


// Default options for fallback
const STATUS_DEFAULTS = ['New', 'Contacted', 'Qualified', 'Lost'];
const PRIORITY_DEFAULTS = ['Low', 'Medium', 'High'];
const TYPE_DEFAULTS = ['contact', 'schedule', 'demo'];

// Helper to get unique options from data
function getUniqueOptions(arr, key, defaults) {
  const values = Array.from(new Set(arr.map((item) => item[key]).filter(Boolean)));
  const merged = Array.from(new Set([...values, ...defaults]));
  return merged.map((v) => ({ label: v, value: v }));
}

const LeadFormFields = ({ values, setFormData, statusOptions, priorityOptions, typeOptions }) => {
  const {
    countries,
    handleCountryChange,
  } = useLocations();

  useEffect(() => {
    handleCountryChange(values.country || '');
  }, [handleCountryChange, values.country]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const countryOptions = countries.map((country) => ({ label: country.name, value: country.id }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      <FormGroup label="User Type">
        <Input
          name="userType"
          placeholder="Enter user type"
          value={values.userType}
          onChange={(e) => updateField('userType', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Organization">
        <Input
          name="organization"
          placeholder="Enter organization"
          value={values.organization}
          onChange={(e) => updateField('organization', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Interest">
        <Input
          name="interest"
          placeholder="Enter interest"
          value={values.interest}
          onChange={(e) => updateField('interest', e.target.value)}
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
          }));
        }}
      />

      <SearchableSelect
        label="Type"
        value={values.type}
        options={typeOptions}
        placeholder="Select type"
        onSelect={(type) => updateField('type', type)}
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

      <div style={{ gridColumn: 'span 2' }}>
        <FormGroup label="Note">
          <textarea
            name="note"
            placeholder="Enter note"
            value={values.note}
            onChange={(e) => updateField('note', e.target.value)}
            style={{
              width: '100%',
              minHeight: 110,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: theme.radiusMd,
              padding: 12,
              fontSize: 14,
              color: theme.textPrimary,
              background: theme.inputBg,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </FormGroup>
      </div>
    </div>
  );
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(LEAD_FORM_DEFAULTS);
  const toast = useToast();
  const navigate = useNavigate();


  // Dynamic filter options
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    ...STATUS_DEFAULTS.map((value) => ({ label: value, value })),
  ];
  const priorityOptions = [
    { label: 'All Priority', value: 'all' },
    ...PRIORITY_DEFAULTS.map((value) => ({ label: value, value })),
  ];
  const typeOptions = TYPE_DEFAULTS.map((value) => ({ label: value, value }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/contact");
        setLeads(res.data?.contacts.reverse() || []);
        console.log(res.data?.contacts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => setFormData(LEAD_FORM_DEFAULTS);

  const handleAdd = async () => {
    try {
      const res = await api.post("/contact", formData);
      const newLead = res.data?.contact || res.data;
      setLeads([newLead, ...leads]);
      setAddModal(false);
      resetForm();
      setPage(1);
      toast.success('Lead added', `${newLead.name || 'New lead'} has been saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to add lead');
    }
  };

  const handleEdit = async () => {
    if (!selectedLead) return;

    try {
      const res = await api.patch(`/contact/${selectedLead._id}`, formData);
      const updatedLead = res.data?.contact || res.data;
      setLeads(leads.map(l =>
        l._id === selectedLead._id ? updatedLead : l
      ));
      setEditModal(false);
      setSelectedLead(null);
      toast.success('Lead updated', `${formData.name || 'Lead'} changes saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to update lead');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/contact/${selectedLead._id}`);
      setLeads(leads.filter(l => l._id !== selectedLead._id));
      setDeleteDialog(false);
      toast.success('Lead deleted', `${selectedLead?.name || 'Lead'} removed.`);
      setSelectedLead(null);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to delete lead');
    }
  };
  const openEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...LEAD_FORM_DEFAULTS,
      ...lead,
    });
    setEditModal(true);
  };

  const filteredLeads = leads.filter((l) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      l.name?.toLowerCase().includes(query) ||
      l.email?.toLowerCase().includes(query) ||
      l.phone?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || l.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || l.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredLeads.length / PER_PAGE);
  const paged = filteredLeads.slice((page - 1) * PER_PAGE, page * PER_PAGE);



  const columns = [
    {
      header: "Lead",
      accessor: "name",
      render: (row) => (
        <div
            onClick={() => navigate(`/leads/${row._id}`)}
         style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={row.name} size="sm" />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>
              {row.name}
            </div>
            <div style={{ fontSize: 11, color: theme.textLight }}>
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
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
            { icon: Eye, label: "View Lead",
              onClick: () => {
                navigate(`/leads/${row._id}`);
              }
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
     <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Leads' }]} />



      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
       <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>
  Leads
</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" onClick={() => { resetForm(); setAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Add New Lead
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by name, email, phone"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={{ width: '100%' }}
            />
          </FormGroup>

        <div style={{ display: 'flex', gap: 2 }}>
  <div style={{ flex: 1 }}>
    <FormGroup label="Status">
      <Select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        options={statusOptions}
        style={{ width: '100%' }}
      />
    </FormGroup>
  </div>

  <div style={{ flex: 1 }}>
    <FormGroup label="Priority">
      <Select
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
          setPage(1);
        }}
        options={priorityOptions}
        style={{ width: '100%' }}
      />
    </FormGroup>
  </div>
</div>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          data={paged}
          emptyMessage="No leads found"
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
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Lead" size="md"
        footer={<><Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAdd}>Add Lead</Button></>}>
        <LeadFormFields values={formData} setFormData={setFormData} statusOptions={statusOptions.filter((option) => option.value !== 'all')} priorityOptions={priorityOptions.filter((option) => option.value !== 'all')} typeOptions={typeOptions} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Lead" size="md"
        footer={<><Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button><Button variant="primary" onClick={handleEdit}>Save Changes</Button></>}>
        <LeadFormFields values={formData} setFormData={setFormData} statusOptions={statusOptions.filter((option) => option.value !== 'all')} priorityOptions={priorityOptions.filter((option) => option.value !== 'all')} typeOptions={typeOptions} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Delete ${selectedLead?.name}?`}
        message="This will remove the lead and all associated data. This action cannot be undone."
      />
    </div>
  );
};

export default LeadsPage;
