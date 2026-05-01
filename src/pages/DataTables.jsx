import React, { useState } from 'react';
import { Download, Filter, Search, MoreHorizontal, ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/UI/Breadcrumb';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Avatar from '../components/UI/Avatar';
import { SkeletonTable } from '../components/UI/Skeleton';
import { Input } from '../components/UI/FormElements';
import { Checkbox } from '../components/UI/CheckboxRadio';
import DropdownMenu from '../components/UI/DropdownMenu';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const DEMO_DATA = Array.from({ length: 15 }).map((_, i) => ({
  id: `ORD-${2026001 + i}`,
  customer: `Customer ${i + 1}`,
  date: `Apr ${Math.max(1, 30 - i)}, 2026`,
  amount: `$${(Math.random() * 500 + 50).toFixed(2)}`,
  status: i % 4 === 0 ? 'Pending' : i % 7 === 0 ? 'Failed' : 'Completed',
  items: Math.floor(Math.random() * 5) + 1,
}));

const DataTables = () => {
  const [data] = useState(DEMO_DATA);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(data.map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(r => r !== id));
    }
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const columns = [
    {
      header: (
        <Checkbox 
          checked={selectedRows.length === data.length && data.length > 0} 
          onChange={(e) => handleSelectAll(e.target.checked)} 
        />
      ),
      accessor: 'select',
      render: (row) => (
        <Checkbox 
          checked={selectedRows.includes(row.id)} 
          onChange={(e) => handleSelectRow(row.id, e.target.checked)} 
        />
      ),
    },
    {
      header: <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Order ID <ArrowUpDown style={{ width: 14, height: 14, cursor: 'pointer' }} /></div>,
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 600, color: theme.primary }}>{row.id}</span>
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.customer} size="sm" />
          <span style={{ fontWeight: 500, color: theme.textPrimary }}>{row.customer}</span>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: 'items' },
    { header: 'Amount', accessor: 'amount', render: (row) => <span style={{ fontWeight: 600 }}>{row.amount}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const variant = row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'error';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <DropdownMenu items={[
          { icon: Edit, label: 'Edit Order' },
          { icon: Download, label: 'Download Invoice' },
          { divider: true },
          { icon: Trash2, label: 'Delete', danger: true, onClick: () => toast.error('Deleted', `${row.id} deleted.`) },
        ]}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
            <MoreHorizontal style={{ width: 18, height: 18 }} />
          </button>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Data Tables' }]} />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary, marginBottom: 4 }}>Advanced Data Tables</h1>
          <p style={{ fontSize: theme.fontSizeBody, color: theme.textMuted }}>Examples of interactive data grids and lists.</p>
        </div>
        <Button variant="primary" onClick={simulateLoading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Refresh Data
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div style={{ position: 'relative' }} className="w-full sm:w-[280px]">
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: theme.inputPlaceholder }} />
              <Input placeholder="Search orders..." style={{ width: '100%', paddingLeft: 36 }} />
            </div>
            <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter style={{ width: 14, height: 14 }} /> Filters
            </Button>
          </div>
          
          {selectedRows.length > 0 && (
            <div className="flex items-center flex-wrap gap-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(3,217,133,0.1)' }}>
              <span style={{ fontSize: theme.fontSizeBody, fontWeight: theme.fontWeightSemiBold, color: theme.primary }}>{selectedRows.length} selected</span>
              <Button variant="primary" style={{ padding: '6px 12px', fontSize: theme.fontSizeMuted }}>Export Selected</Button>
              <Button variant="ghost" style={{ padding: '6px 12px', fontSize: theme.fontSizeMuted, color: '#ef4444' }}>Delete Selected</Button>
            </div>
          )}
        </div>

        {loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <Table columns={columns} data={data.slice(0, 8)} />
        )}
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card>
          <span style={{ fontSize: theme.fontSizeH3, fontWeight: theme.fontWeightSemiBold, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Compact Table</span>
          <Table 
            compact
            columns={columns.slice(1, 4).concat(columns.slice(5, 7))} 
            data={data.slice(0, 4)} 
          />
        </Card>
        
        <Card>
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 16, display: 'block' }}>Empty State</span>
          <Table columns={columns.slice(1, 6)} data={[]} emptyMessage="No transactions found for this period." />
        </Card>
      </div>
    </div>
  );
};

export default DataTables;
