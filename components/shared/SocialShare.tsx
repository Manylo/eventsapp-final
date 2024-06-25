// components/shared/SocialShare.tsx
"use client";

import React from 'react';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  console.log("Share URL:", url); // Ajoute ceci pour vérifier l'URL
  return (
    <div className="social-share-buttons">
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default SocialShare;
