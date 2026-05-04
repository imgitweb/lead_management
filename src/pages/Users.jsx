import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Shield, ShieldAlert } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Avatar from '../components/UI/Avatar';
import Pagination from '../components/UI/Pagination';
import Breadcrumb from '../components/UI/Breadcrumb';
import { Input, Select } from '../components/UI/FormElements';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';
import api from '../services/api';

// start with empty list; will fetch from backend
const DEMO_USERS = [];

const PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState(DEMO_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const resp = await api.get('/admin/users');
        if (mounted && resp?.data?.data) {
          // format createdAt to YYYY-MM-DD
          const items = resp.data.data.map(u => ({
            ...u,
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : ''
          }));
          setUsers(items);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
        toast.error('Could not load users');
      }
    };
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  const filteredUsers = users.filter(u => {
    const name = (u && u.name) ? u.name : '';
    const role = (u && u.role) ? u.role : '';
    const matchesSearch = name.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesRole = roleFilter === 'all' || role.toLowerCase() === (roleFilter || '').toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const paged = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Read-only users list; actions (invite/edit/delete) are disabled to avoid accidental changes.

  const roleStyles = {
    Admin: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    Editor: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    Viewer: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
  };

  const statusVariants = { Active: 'success', Invited: 'warning', Inactive: 'default' };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={row.name} size="md" />
          <div>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>{row.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => {
        const role = (row.role || '').toString();
        const roleKey = role.toLowerCase();
        const roleVariant = (r) => {
          switch (r) {
            case 'super_admin': return 'error';
            case 'admin': return 'info';
            case 'lead_manager': return 'success';
            case 'support_staff': return 'warning';
            case 'sales_head': return 'info';
            default: return 'default';
          }
        };
        const prettyRole = (r) => r.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');

        return (
          <Badge variant={roleVariant(roleKey)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {roleKey === 'admin' ? <ShieldAlert style={{ width: 12, height: 12 }} /> : <Shield style={{ width: 12, height: 12 }} />}
            {prettyRole(roleKey)}
          </Badge>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>
    },
    { header: 'Created At', accessor: 'createdAt' },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Team Members' }]} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Team Members</h1>
          <p style={{ fontSize: 14, color: theme.textMuted }}>Manage your team's access and roles.</p>
        </div>
        <Button variant="primary" disabled style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Invite Member
        </Button>
      </div>

      <Card>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 350 }}>
            <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: theme.inputPlaceholder, pointerEvents: 'none' }} />
            <Input 
              placeholder="Search users..." 
              value={searchQuery} 
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} 
              style={{ paddingLeft: 40, width: '100%' }} 
            />
          </div>
          <Select 
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            options={[
              { label: 'All Roles', value: 'all' },
              { label: 'Admins', value: 'admin' },
              { label: 'Editors', value: 'editor' },
              { label: 'Viewers', value: 'viewer' },
            ]} 
          />
        </div>

        {/* Table */}
        <Table columns={columns} data={paged} emptyMessage="No team members found." />

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
          totalItems={filteredUsers.length} 
          perPage={PER_PAGE} 
        />
      </Card>

      {/* Read-only view: invite/edit/delete functionality disabled to avoid accidental changes */}
    </div>
  );
};

export default Users;
