import clsx from 'clsx';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--light', styles.heroBanner)}>
            <div className="container">
                <img src='img/logo.svg' alt='logo' height={600} />
                <Heading as="h1" className="hero__title">
                    
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="/docs/quick-start">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    const googleStructuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Jelly SQL",
        "description": "Jelly SQL is a JavaScript library for querying the DOM using SQL syntax. Documentation will be available soon.",
        "url": "https://docs.jellysql.com",
        "image": "https://docs.jellysql.com/assets/logo.svg",
        "creator": {
            "@type": "Organization",
            "name": "Jelly SQL Team"
        },
        "operatingSystem": "Web",
        "applicationCategory": "Web Development Tool"
    };

    return (
        <Layout title={`${siteConfig.title}`} description="Jelly SQL is a JavaScript library for querying the DOM using SQL syntax">
            <HomepageHeader />

            <script type="application/ld+json">
                {JSON.stringify(googleStructuredData)}
            </script>

        </Layout>
    );
}
