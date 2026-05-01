import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { theme } from '../../theme/constants';

const FeaturePage = ({
  title,
  breadcrumb,
  description,
  badge,
  primaryActionLabel,
  primaryActionPath,
  secondaryActionLabel,
  secondaryActionPath,
  stats = [],
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/' },
          ...(breadcrumb || []),
          { label: title },
        ]}
      />

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          
          <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
            {title}
          </h1>
          
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {secondaryActionLabel && secondaryActionPath ? (
            <Button variant="ghost" onClick={() => navigate(secondaryActionPath)}>
              {secondaryActionLabel}
            </Button>
          ) : null}
          {primaryActionLabel && primaryActionPath ? (
            <Button variant="primary" onClick={() => navigate(primaryActionPath)}>
              {primaryActionLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {stats.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}>
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div style={{ fontSize: 12, color: theme.textLight, marginBottom: 8 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.textPrimary }}>
                {stat.value}
              </div>
              {stat.note ? (
                <div style={{ fontSize: 12, color: theme.textLight, marginTop: 6 }}>
                  {stat.note}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      <Card>
        {children || (
          <div style={{ padding: '20px 4px', color: theme.textLight }}>
            This page is ready for the new navigation structure.
          </div>
        )}
      </Card>
    </div>
  );
};

export default FeaturePage;
