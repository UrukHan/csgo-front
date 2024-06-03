import React from 'react';
import styles from './Docs.module.css';

function PrivacyPolicy() {

    return (
        <div className={styles['page']}>
            <iframe
                src="/pdfs/PrivacyPolicyRu.pdf"
                style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
        </div>
    );
}

export default PrivacyPolicy;