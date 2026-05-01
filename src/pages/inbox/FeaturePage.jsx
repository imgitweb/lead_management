import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';

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
          { label: title || 'Coming Soon' },
        ]}
      />
        <div className=" border border-[#e8e8e8] bg-white px-6 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>

         

          <h1 className="text-[clamp(2.5rem,4vw,4.5rem)] font-black leading-none tracking-[-0.05em] text-[#111]">
            Coming Soon
          </h1>

          <h2 className="mt-5 text-xl font-bold text-[#111] sm:text-2xl">
            This section is under development
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#555] sm:text-[15px] sm:leading-7">
            We are working on this feature and will bring it live soon. The layout, behavior, and navigation will stay inside the same theme once it is ready.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
           <Button variant="primary" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
    </div>
  );
};

export default FeaturePage;

