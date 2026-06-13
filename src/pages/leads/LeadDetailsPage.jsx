import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Badge from "../../components/UI/Badge";
import Modal from "../../components/UI/Modal";
import { Input, FormGroup, Select } from "../../components/UI/FormElements";
import { theme } from "../../theme/constants";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { getPriorityVariant, getStatusVariant } from "../../utils";
import { ArrowLeft } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useToast } from "../../components/UI/Toast";

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followModal, setFollowModal] = useState(false);

  const [followData, setFollowData] = useState({
    nextFollowUpDate: "",
    note: ""
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/contact/${id}`);
        const data = res.data?.contact || res.data;
        setLead(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!lead) return <div style={{ padding: 20 }}>No lead found</div>;
  const todayDate = new Date().toISOString().split("T")[0];

  const handleAddFollowUp = async () => {
    try {
      const newFollow = {
        date: new Date().toISOString(),
        note: followData.note,
        nextFollowUpDate: followData.nextFollowUpDate,
        createdBy: user?.email || user?.name || "system",
      };

      const res = await api.post(`/contact/${id}/followups`, newFollow);
      const updatedLead = res.data?.contact || {
        ...lead,
        followUps: [...(lead.followUps || []), newFollow]
      };

      setLead(updatedLead);
      setFollowModal(false);

      setFollowData({
        nextFollowUpDate: "",
        note: ""
      });

      toast.success('Follow-up added', 'Follow-up has been saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to add follow-up');
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Leads", path: "/leads" },
          { label: lead.name },
        ]}
      />

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 12
      }}>
        <h1 style={{
          fontSize: theme.fontSizeH1,
          fontWeight: theme.fontWeightBold,
          color: theme.textPrimary,
          margin: 0,
          flex: "1 1 auto"
        }}>
          Lead Details
        </h1>

        <Button variant="primary" onClick={() => navigate("/leads")} style={{ whiteSpace: "nowrap" }}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 20
      }}
      className="grid-responsive"
      onLoad={() => {
        if (window.innerWidth >= 768) {
          document.querySelector('.grid-responsive').style.gridTemplateColumns = "2fr 1fr";
        }
      }}>

        {/* LEFT */}
        <Card>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            color: theme.textPrimary,
            marginBottom: 16
          }}
          className="details-grid">
            <Detail label="Name" value={lead.name} />
            <Detail label="Email" value={lead.email} />
            <Detail label="Phone" value={lead.phone} />
            <Detail label="Country" value={lead.country} />
            <Detail label="User Type" value={lead.userType} />
            <Detail label="Organization" value={lead.organization || "-"} />
            <Detail label="Interest" value={lead.interest} />
            <Detail label="Type" value={lead.type} />
          </div>

          <div style={{ marginTop: 16 , color: theme.textPrimary }}>
            <Detail label="Note" value={lead.note} full />
          </div>
        </Card>

        {/* RIGHT */}
        <Card>
          <h3 style={{
            fontSize: theme.fontSizeH3,
            fontWeight: theme.fontWeightSemiBold,
            marginBottom: 16
            , color: theme.textPrimary
          }}>
            Quick Info
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row label="Status">
              <Badge variant={getStatusVariant(lead.status)}>
                {lead.status}
              </Badge>
            </Row>

            <Row label="Priority">
              <Badge variant={getPriorityVariant(lead.priority)}>
                {lead.priority}
              </Badge>
            </Row>

            <Divider />

            <Row label="Created"  >
              {new Date(lead.createdAt).toLocaleString()}
            </Row>

            <Row label="Updated">
              {new Date(lead.updatedAt).toLocaleString()}
            </Row>

            <Divider />

            <Row label="Follow-ups">
              <span style={{ color: theme.primary, fontWeight: 600 }}>
                {lead.followUps?.length || 0}
              </span>
            </Row>
          </div>
        </Card>
      </div>

      {/* TIMELINE */}
      <Card style={{ marginTop: 20 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14
        }}>
          <h3 style={{ fontSize: theme.fontSizeH3 }}>Follow-up Timeline</h3>

          <Button variant="primary" onClick={() => setFollowModal(true)}>
            Add Follow-up
          </Button>
        </div>

        {(lead.followUps || []).map((f, i) => (
          <div
            key={i}
            style={{
              padding: 14,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: theme.radiusMd,
              marginBottom: 12,
              transition: theme.transition
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: theme.textLight,
              marginBottom: 6
            }}>
              <span>{new Date(f.date).toLocaleString()}</span>
              <span>{f.createdBy}</span>
            </div>

            <div style={{ color: theme.textPrimary }}>
              {f.note}
            </div>

            {f.nextFollowUpDate && (
              <div style={{
                marginTop: 6,
                fontSize: 12,
                color: theme.primary
              }}>
                Next: {new Date(f.nextFollowUpDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </Card>

     <Modal
  isOpen={followModal}
  onClose={() => setFollowModal(false)}
  title="Update Lead Details"
  size="md"
  footer={
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        flexWrap: "wrap" // ✅ mobile fix
      }}
    >
      <Button
        variant="outline"
        onClick={() => setFollowModal(false)}
        style={{ flex: "1 1 auto" }}
      >
        Cancel
      </Button>

      <Button
        variant="primary"
        onClick={handleAddFollowUp}
        style={{ flex: "1 1 auto" }}
      >
        Save Changes
      </Button>
    </div>
  }
>
  <div
    className="follow-modal-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }}
  >

    {/* INFO BOXES */}
    <InfoBox
      label="Today's Date"
      value={new Date().toISOString().split("T")[0]}
    />

    <InfoBox
      label="Created By"
      value={user?.email || user?.name || 'N/A'}
    />

    {/* DATE */}
    <FormGroup label="Next Follow-up Date">
      <Input
        type="date"
        min={todayDate}
        value={followData.nextFollowUpDate}
        onChange={(e) =>
          setFollowData({
            ...followData,
            nextFollowUpDate: e.target.value
          })
        }
      />
    </FormGroup>

    {/* REMARKS */}
    <div style={{ gridColumn: "span 2" }}>
      <FormGroup label="Remarks">
        <textarea
          value={followData.note}
          onChange={(e) =>
            setFollowData({ ...followData, note: e.target.value })
          }
          placeholder="Write remarks..."
          style={{
            width: "100%",
            minHeight: 110,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: theme.radiusMd,
            padding: 12,
            fontSize: 14,
            color: theme.textPrimary,
            background: theme.inputBg,
            outline: "none",
            resize: "vertical"
          }}
        />
      </FormGroup>
    </div>
  </div>

  {/* 🔥 RESPONSIVE BREAKPOINT */}
  <style>{`
    @media (max-width: 768px) {
      .follow-modal-grid {
        grid-template-columns: 1fr !important;
      }

      .follow-modal-grid > div {
        grid-column: span 1 !important;
      }
    }
  `}</style>
</Modal>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
          
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (min-width: 769px) {
          .grid-responsive {
            grid-template-columns: 2fr 1fr !important;
          }
          
          .details-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 640px) {
          h1 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeadDetailsPage;


/* COMPONENTS */
const Detail = ({ label, value, full }) => (
  <div style={{ gridColumn: full ? "span 2" : "auto" }}>
    <div style={{ fontSize: 12, color: theme.textPrimary }}>{label}</div>
    <div style={{ fontWeight: 500  , color: theme.textPrimary }}>{value || "-"}</div>
  </div>
);

const Row = ({ label, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ fontSize: 12, color: theme.textPrimary }}>{label}</span>
    <span style={{ fontSize: 13, color: theme.textPrimary }}>{children}</span>
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: theme.cardBorder }} />
);

const InfoBox = ({ label, value }) => (
  <div style={{
    border: `1px solid ${theme.cardBorder}`,
    padding: 12,
    background: theme.pageBg
  }}>
    <div style={{ fontSize: 12, color: theme.textPrimary }}>{label}</div>
    <div style={{ fontWeight: 500  , color: theme.textPrimary }}>{value || "-"}</div>
  </div>
);