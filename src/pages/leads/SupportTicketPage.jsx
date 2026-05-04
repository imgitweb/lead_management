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

const PER_PAGE = 6;

const TICKET_FORM_DEFAULTS = {
  subject: '',
  category: 'General',
  priority: 'Medium',
  status: 'Open',
  description: '',
  assignedTo: '',
};

const STATUS_OPTIONS = [
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Closed', value: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

const CATEGORY_OPTIONS = [
  { label: 'General', value: 'General' },
  { label: 'Product Issue', value: 'Product Issue' },
  { label: 'Billing', value: 'Billing' },
  { label: 'Technical', value: 'Technical' },
  { label: 'Other', value: 'Other' },
];

const normalizeTicket = (ticket) => ({
  ...ticket,
  _id: ticket._id || ticket.id,
  subject: ticket.subject || '',
  category: ticket.category || 'General',
  priority: ticket.priority || 'Medium',
  status: ticket.status || 'Open',
  description: ticket.description || '',
  createdBy: ticket.createdBy || '',
  assignedTo: ticket.assignedTo || '',
});

const getTicketStatusVariant = (status) => {
  switch (status) {
    case 'Open':
      return 'info';
    case 'In Progress':
      return 'warning';
    case 'Resolved':
      return 'success';
    case 'Closed':
      return 'default';
    default:
      return 'default';
  }
};

const SupportTicketPage = () => {
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState(TICKET_FORM_DEFAULTS);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/support-tickets');
        setTickets((res.data?.tickets || []).map(normalizeTicket));
      } catch (err) {
        console.error(err);
        toast.error('Error', 'Failed to fetch support tickets');
      }
    };

    fetchTickets();
  }, [toast]);

  const resetForm = () => setFormData(TICKET_FORM_DEFAULTS);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...formData,
        createdBy: localStorage.getItem('user_email') || 'system',
      };
      const res = await api.post('/support-tickets', payload);
      const newTicket = normalizeTicket(res.data?.ticket || res.data);
      setTickets([newTicket, ...tickets]);
      setAddModal(false);
      resetForm();
      setPage(1);
      toast.success('Ticket created', `${newTicket.subject || 'New ticket'} has been saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', err?.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleEdit = async () => {
    if (!selectedTicket) return;

    try {
      const res = await api.patch(`/support-tickets/${selectedTicket._id}`, formData);
      const updatedTicket = normalizeTicket(res.data?.ticket || res.data);
      setTickets(tickets.map((ticket) => (ticket._id === selectedTicket._id ? updatedTicket : ticket)));
      setEditModal(false);
      setSelectedTicket(null);
      toast.success('Ticket updated', `${formData.subject || 'Ticket'} changes saved.`);
    } catch (err) {
      console.error(err);
      toast.error('Error', err?.response?.data?.message || 'Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/support-tickets/${selectedTicket._id}`);
      setTickets(tickets.filter((ticket) => ticket._id !== selectedTicket._id));
      setDeleteDialog(false);
      toast.success('Ticket deleted', `${selectedTicket?.subject || 'Ticket'} removed.`);
      setSelectedTicket(null);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to delete ticket');
    }
  };

  const openEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      ...TICKET_FORM_DEFAULTS,
      ...ticket,
    });
    setEditModal(true);
  };

  const openView = (ticket) => {
    setSelectedTicket(ticket);
    setViewModal(true);
  };

  const categoryOptionsForFilter = Array.from(new Set(tickets.map((ticket) => ticket.category).filter(Boolean))).sort();

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.category?.toLowerCase().includes(query) ||
      ticket.description?.toLowerCase().includes(query) ||
      ticket.assignedTo?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / PER_PAGE);
  const paged = filteredTickets.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const columns = [
    {
      header: 'Ticket',
      accessor: 'subject',
      render: (row) => (
        <div
          onClick={() => openView(row)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={row.subject} size="sm" />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>
              {row.subject}
            </div>
            <div style={{ fontSize: 11, color: theme.textLight }}>
              {row.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <Badge variant={row.priority === 'High' ? 'error' : row.priority === 'Medium' ? 'warning' : 'success'}>
          {row.priority}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={getTicketStatusVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
      render: (row) => row.assignedTo || '-',
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu
          items={[
            { icon: Eye, label: 'View', onClick: () => openView(row) },
            { icon: Edit3, label: 'Edit', onClick: () => openEdit(row) },
            { divider: true },
            {
              icon: Trash2,
              label: 'Delete',
              danger: true,
              onClick: () => {
                setSelectedTicket(row);
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
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Inbox', path: '/inbox/whatsapp' }, { label: 'Raise Support Ticket' }]} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
            Raise Support Ticket
          </h1>
        
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Add New Ticket
        </Button>
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, alignItems: 'end' }}>
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by subject, category, or assignee"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={{ width: '100%' }}
            />
          </FormGroup>

          <FormGroup label="Status">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={[{ label: 'All Status', value: 'all' }, ...STATUS_OPTIONS]}
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
              options={[{ label: 'All Priority', value: 'all' }, ...PRIORITY_OPTIONS]}
              style={{ width: '100%' }}
            />
          </FormGroup>

          <FormGroup label="Category">
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { label: 'All Categories', value: 'all' },
                ...categoryOptionsForFilter.map((category) => ({ label: category, value: category })),
              ]}
              style={{ width: '100%' }}
            />
          </FormGroup>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          data={paged}
          emptyMessage="No tickets found"
          compact
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredTickets.length}
          perPage={PER_PAGE}
        />
      </Card>

      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Add New Ticket"
        size="md"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Create Ticket</Button>
          </>
        )}
      >
        <TicketForm values={formData} setFormData={setFormData} />
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Ticket"
        size="md"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
          </>
        )}
      >
        <TicketForm values={formData} setFormData={setFormData} />
      </Modal>

      <Modal
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        title="Ticket Quick Info"
        size="md"
        footer={(
          <Button variant="ghost" onClick={() => setViewModal(false)}>Close</Button>
        )}
      >
        {selectedTicket && (
          <div className="ticket-quick-sheet" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <QuickInfoHeader value={selectedTicket.subject} />

            <QuickInfoRow label="Category" value={selectedTicket.category} />
            <QuickInfoRow
              label="Priority"
              value={(
                <Badge variant={selectedTicket.priority === 'High' ? 'error' : selectedTicket.priority === 'Medium' ? 'warning' : 'success'}>
                  {selectedTicket.priority}
                </Badge>
              )}
            />
            <QuickInfoRow
              label="Status"
              value={(
                <Badge variant={getTicketStatusVariant(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
              )}
            />

            <QuickInfoDivider />

            <QuickInfoRow label="Assigned To" value={selectedTicket.assignedTo || '-'} />
            <QuickInfoRow label="Created By" value={selectedTicket.createdBy || '-'} />
            <QuickInfoRow label="Created" value={selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : '-'} />
            <QuickInfoRow label="Updated" value={selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString() : '-'} />

            <QuickInfoDivider />

            <div style={{ paddingTop: 2 }}>
              <div style={{ fontSize: 12, color: theme.textLight, marginBottom: 6 }}>Description</div>
              <div style={{ color: theme.textPrimary, lineHeight: 1.55, wordBreak: 'break-word' }}>
                {selectedTicket.description || '-'}
              </div>
            </div>
          </div>
        )}
        <style>{`
          .ticket-quick-sheet {
            padding: 2px 0 4px;
          }

          @media (max-width: 768px) {
            .ticket-quick-sheet {
              padding: 0;
            }
          }
        `}</style>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Delete ${selectedTicket?.subject || 'ticket'}?`}
        message="This will remove the ticket and all associated data. This action cannot be undone."
      />
    </div>
  );
};

const TicketForm = ({ values, setFormData }) => {
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <FormGroup label="Subject">
        <Input value={values.subject} onChange={(e) => updateField('subject', e.target.value)} placeholder="Ticket subject" />
      </FormGroup>
      <FormGroup label="Category">
        <Select value={values.category} onChange={(e) => updateField('category', e.target.value)} options={CATEGORY_OPTIONS} style={{ width: '100%' }} />
      </FormGroup>
      <FormGroup label="Priority">
        <Select value={values.priority} onChange={(e) => updateField('priority', e.target.value)} options={PRIORITY_OPTIONS} style={{ width: '100%' }} />
      </FormGroup>
      <FormGroup label="Status">
        <Select value={values.status} onChange={(e) => updateField('status', e.target.value)} options={STATUS_OPTIONS} style={{ width: '100%' }} />
      </FormGroup>
      <FormGroup label="Assigned To">
        <Input value={values.assignedTo} onChange={(e) => updateField('assignedTo', e.target.value)} placeholder="Assign to team member" />
      </FormGroup>
      <div style={{ gridColumn: 'span 2' }}>
        <FormGroup label="Description">
          <textarea
            value={values.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe the issue..."
            style={{ width: '100%', minHeight: 160, border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusMd, padding: 12, fontSize: 14, color: theme.textPrimary, background: theme.inputBg, outline: 'none', resize: 'vertical' }}
          />
        </FormGroup>
      </div>
    </div>
  );
};

const QuickInfoHeader = ({ value }) => (
  <div style={{ paddingBottom: 14, marginBottom: 10, borderBottom: `1px solid ${theme.cardBorder}` }}>
    <div style={{ fontSize: 12, color: theme.textLight, marginBottom: 6 }}>Subject</div>
    <div style={{ color: theme.textPrimary, fontWeight: 700, fontSize: 18, lineHeight: 1.35, wordBreak: 'break-word' }}>
      {value || '-'}
    </div>
  </div>
);

const QuickInfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '12px 0' }}>
    <span style={{ fontSize: 14, color: theme.textPrimary, flex: '0 0 auto' }}>{label}</span>
    <span style={{ fontSize: 14, color: theme.textPrimary, fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>
      {value || '-'}
    </span>
  </div>
);

const QuickInfoDivider = () => (
  <div style={{ height: 1, background: theme.cardBorder, margin: '2px 0' }} />
);

export default SupportTicketPage;
