// components/shared/ClientSocialShare.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';
import { generateShareUrl } from '@/lib/utils';

interface ClientSocialShareProps {
  eventId: string;
  title: string;
}

const ClientSocialShare: React.FC<ClientSocialShareProps> = ({ eventId, title }) => {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(generateShareUrl(eventId));
  }, [eventId]);

  return (
    <div className="social-share-buttons flex gap-4"> {/* Add flex and gap classes here */}
      <FacebookShareButton url={shareUrl} title={title}>
        <FacebookIcon size={40} round /> {/* Increase size to 40 */}
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={40} round /> {/* Increase size to 40 */}
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={40} round /> {/* Increase size to 40 */}
      </LinkedinShareButton>
    </div>
  );
};

export default ClientSocialShare;
