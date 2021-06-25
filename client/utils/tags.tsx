/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { withPrefix } from 'gatsby';
import i18next from 'i18next';
import psl from 'psl';
import env from '../../config/env.json';

const { homeLocation } = env;

export const getheadTagComponents = () => {
  const socialImage =
    'https://cdn.freecodecamp.org/platform/universal/fcc_meta_1920X1080-indigo.png';

  const pathToBootstrap = withPrefix('/css/bootstrap.min.css');

  const headTags = [
    <link
      as='style'
      href={pathToBootstrap}
      key='bootstrap-min-preload'
      rel='preload'
    />,
    <link href={pathToBootstrap} key='bootstrap-min' rel='stylesheet' />,
    <meta content='freeCodeCamp.org' key='og:title' name='og:title' />,
    <meta
      content={i18next.t('metaTags:social-description')}
      key='og:description'
      name='og:description'
    />,
    <meta content={socialImage} key='og:image' property='og:image' />,
    <meta
      content='summary_large_image'
      key='twitter:card'
      name='twitter:card'
    />,
    <meta
      content={socialImage}
      key='twitter:image:src'
      name='twitter:image:src'
    />,
    <meta
      content='freeCodeCamp.org'
      key='twitter:title'
      name='twitter:title'
    />,
    <meta
      content={i18next.t('metaTags:social-description')}
      key='twitter:description'
      name='twitter:description'
    />,
    <meta
      content='$ilp.uphold.com/LJmbPn7WD4JB'
      key='monetization'
      name='monetization'
    />
  ];
  return injectConditionalTags(headTags, homeLocation);
};

// strips subpath and protocol

export const injectConditionalTags = (
  tagsArray: JSX.Element[],
  homeLocation: string
): any => {
  if (homeLocation.includes('localhost')) return tagsArray;

  const parsedHomeUrl = psl.parse(new URL(homeLocation).host);

  // inject gap all production languages except Chinese
  if (parsedHomeUrl.subdomain === 'www' && parsedHomeUrl.tld === 'org') {
    tagsArray.push(
      <script
        href={withPrefix('/misc/gap-org.js')}
        id='gap-org'
        key='gap-org'
        rel='stylesheet'
      />
    );
  }

  // inject gap for staging
  if (parsedHomeUrl.subdomain === 'www' && parsedHomeUrl.tld === 'dev') {
    tagsArray.push(
      <script
        id='gap-dev'
        key='gap-dev'
        rel='stylesheet'
        src={withPrefix('/misc/gap-dev.js')}
      />
    );
  }

  // inject cap and Chinese gap for production Chinese
  if (parsedHomeUrl.subdomain === 'chinese' && parsedHomeUrl.tld === 'org') {
    tagsArray.push(
      <scripts
        href={withPrefix('/misc/cap.js')}
        id='cap'
        key='cap'
        rel='stylesheet'
      />,
      <script
        href={withPrefix('/misc/gap-org-chinese.js')}
        id='gap-org-chinese'
        key='gap-org-chinese'
        rel='stylesheet'
      />
    );
  }
  return tagsArray;
};

export const getPostBodyComponents = (pathname: string | string[]) => {
  const scripts = [];
  const mathJaxScriptElement = (
    <script
      async={false}
      id='mathjax'
      key='mathjax'
      src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML'
      type='text/javascript'
    />
  );

  if (
    pathname.includes('/learn/coding-interview-prep/rosetta-code') ||
    pathname.includes('/learn/coding-interview-prep/project-euler')
  ) {
    scripts.push(mathJaxScriptElement);
  }

  return scripts.filter(Boolean);
};
