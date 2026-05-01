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
import { useToast } from "../../components/UI/Toast";

const InquiryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followModal, setFollowModal] = useState(false);

  const [followData, setFollowData] = useState({
    nextFollowUpDate: "",
    note: ""
  });

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const res = await api.get(`/auth/universities/${id}`);
        const data = res.data?.university || res.data;
        setInquiry(data);
      } catch (err) {
        console.error(err);
        toast.error('Error', 'Failed to fetch inquiry');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id, toast]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!inquiry) return <div style={{ padding: 20 }}>No inquiry found</div>;
  const todayDate = new Date().toISOString().split("T")[0];

  const handleAddFollowUp = async () => {
    try {
      const newFollow = {
        date: new Date().toISOString(),
        note: followData.note,
        nextFollowUpDate: followData.nextFollowUpDate,
        createdBy: localStorage.getItem("user_email") || "system",
      };

      const res = await api.post(`/auth/universities/${id}/followups`, newFollow);
      const updatedInquiry = res.data?.university || {
        ...inquiry,
        followUps: [...(inquiry.followUps || []), newFollow]
      };
      setInquiry(updatedInquiry);
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
          { label: "Inquiries", path: "/inquiries" },
          { label: inquiry.university_name },
        ]}
      />

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        <h1 style={{
          fontSize: theme.fontSizeH1,
          fontWeight: theme.fontWeightBold,
          color: theme.textPrimary
        }}>
          Inquiry Details
        </h1>

        <Button variant="primary" onClick={() => navigate("/inquiries")}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 20
      }} className="grid-cols-1 md:grid-cols-[2fr_1fr]">

        {/* LEFT */}
        <Card>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            color: theme.textPrimary,
            marginBottom: 16
          }}>
            <Detail label="University/Organization" value={inquiry.university_name} />
            <Detail label="Email" value={inquiry.university_email} />
            <Detail label="Contact Person" value={inquiry.contact_person_name} />
            <Detail label="Phone" value={inquiry.primary_contact} />
            <Detail label="Designation" value={inquiry.designation} />
            <Detail label="Institution Type" value={inquiry.institution_type} />
            <Detail label="Country" value={inquiry.country} />
            <Detail label="State" value={inquiry.state} />
            <Detail label="City" value={inquiry.city} />
            <Detail label="Website" value={inquiry.university_website} />
          </div>
        </Card>

        {/* RIGHT */}
        <Card>
          <h3 style={{
            fontSize: theme.fontSizeH3,
            fontWeight: theme.fontWeightSemiBold,
            marginBottom: 16,
            color: theme.textPrimary
          }}>
            Quick Info
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row label="Status">
              <Badge variant={getStatusVariant(inquiry.status)}>
                {inquiry.status}
              </Badge>
            </Row>

            <Row label="Priority">
              <Badge variant={getPriorityVariant(inquiry.priority)}>
                {inquiry.priority}
              </Badge>
            </Row>

            <Divider />

            <Row label="Created">
              {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "-"}
            </Row>

            <Row label="Updated">
              {inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : "-"}
            </Row>

            <Divider />

            <Row label="Follow-ups">
              <span style={{ color: theme.primary, fontWeight: 600 }}>
                {inquiry.followUps?.length || 0}
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
          <h3 style={{ fontSize: theme.fontSizeH3, color: theme.textPrimary }}>Follow-up Timeline</h3>

          <Button variant="primary" onClick={() => setFollowModal(true)}>
            Add Follow-up
          </Button>
        </div>

        {(inquiry.followUps || []).length > 0 ? (
          (inquiry.followUps || []).map((f, i) => (
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
          ))
        ) : (
          <div style={{ padding: 20, textAlign: "center", color: theme.textLight }}>
            No follow-ups yet
          </div>
        )}
      </Card>

      <Modal
        isOpen={followModal}
        onClose={() => setFollowModal(false)}
        title="Add Follow-up"
        size="md"
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              flexWrap: "wrap"
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
              Save Follow-up
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
            value={localStorage.getItem("user_email") || "N/A"}
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
    </div>
  );
};

export default InquiryDetailsPage;


/* COMPONENTS */
const Detail = ({ label, value, full }) => (
  <div style={{ gridColumn: full ? "span 2" : "auto" }}>
    <div style={{ fontSize: 12, color: theme.textPrimary }}>{label}</div>
    <div style={{ fontWeight: 500, color: theme.textPrimary }}>{value || "-"}</div>
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
    <div style={{ fontWeight: 500, color: theme.textPrimary }}>{value || "-"}</div>
  </div>
);
