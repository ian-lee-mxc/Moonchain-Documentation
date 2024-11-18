import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBackground)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
            >
              Moonchain Documentation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={''}
      description="We're helping Ethereum implement Beam Chain over the next 5 years and utilizing BeamSnarks as the main algorithm to simplify and redesign Ethereum's consensus layer. <head />"
    >
      <HomepageHeader />
    </Layout>
  );
}

export default Home;
