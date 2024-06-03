import React from 'react';
import styles from './Docs.module.css';

function UseAgreementPage() {

    return (
        <div className={styles['page']}>
            <iframe
                src="/pdfs/UseAgreementRu.pdf"
                style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
        </div>
    );
}

export default UseAgreementPage;