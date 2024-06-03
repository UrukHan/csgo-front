import React from 'react';
import styles from './Docs.module.css';

function TermsOfUsePage() {

    return (
        <div className={styles['page']}>
            <iframe
                src="/pdfs/TermsOfUseRu.pdf"
                style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
        </div>
    );
}

export default TermsOfUsePage;