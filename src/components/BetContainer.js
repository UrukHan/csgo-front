import React from 'react';
import styles from './BetContainer.module.css';

function BetContainer({ logo, data, dataMark }) {

    return (
        <div className={styles.BetContainer}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.betCoefficientContainer}>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['1'].winBase1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['1'].winBase1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['1'].winBase2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['1'].winBase2 || '-'}`}
                    </p>
                </div>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['1'].win1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['1'].win1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers}  ${dataMark['1'].draw === 1 ? styles.highlighted : ''}`}>
                        {`${data[1].draw || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers}  ${dataMark['1'].win2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['1'].win2 || '-'}`}
                    </p>
                </div>
            </div>
            <div className={styles.betCoefficientContainer}>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].winBase1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['2'].winBase1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].winBase2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['2'].winBase2 || '-'}`}
                    </p>
                </div>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].win1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['2'].win1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].draw === 1 ? styles.highlighted : ''}`}>
                        {`${data['2'].draw || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].win2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['2'].win2 || '-'}`}
                    </p>
                </div>
            </div>
            <div className={styles.betCoefficientContainer}>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].winBase1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['3'].winBase1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].winBase2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['3'].winBase2 || '-'}`}
                    </p>
                </div>
                <div className={styles.betCoefficientNumbersContainer}>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].win1 === 1 ? styles.highlighted : ''}`}>
                        {`${data['3'].win1 || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].draw === 1 ? styles.highlighted : ''}`}>
                        {`${data['3'].draw || '-'}`}
                    </p>
                    <p className={`${styles.coefficientNumbers} ${dataMark['2'].win2 === 1 ? styles.highlighted : ''}`}>
                        {`${data['3'].win2 || '-'}`}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BetContainer;