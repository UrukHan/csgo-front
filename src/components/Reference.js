import React, { useState, useEffect } from 'react';
import styles from './Reference.module.css';
import supportOne from '../images/support_1.jpg';
import supportTwo from '../images/support_2.jpg';
import supportThree from '../images/support_3.jpg';
import supportFour from '../images/support_4.jpg';
import supportFive from '../images/support_5.jpg';
import supportSix from '../images/support_6.jpg';
import supportSeven from '../images/support_7.jpg';
import supportEight from '../images/support_8.jpg';
import {useTranslation} from "react-i18next";

function Reference() {
    const { t } = useTranslation();

    const textFirst = t("help1")
    const textTwo = t("help2")

    const sequence = [
        {src: supportOne, duration: 1000, text: textFirst},
        {src: supportTwo, duration: 1000, text: textFirst},
        {src: supportThree, duration: 3000, text: textFirst},
        {src: supportOne, duration: 1000, text: textFirst},
        {src: supportTwo, duration: 1000, text: textFirst},
        {src: supportThree, duration: 3000, text: textFirst},
        {src: supportOne, duration: 1000, text: textFirst},
        {src: supportTwo, duration: 1000, text: textFirst},
        {src: supportThree, duration: 3000, text: textFirst},
        {src: supportOne, duration: 1000, text: textFirst},
        {src: supportTwo, duration: 1000, text: textFirst},
        {src: supportThree, duration: 3000, text: textFirst},
        {src: supportFour, duration: 1000, text: textTwo},
        {src: supportFive, duration: 1000, text: textTwo},
        {src: supportSix, duration: 3000, text: textTwo},
        {src: supportSeven, duration: 3000, text: textTwo},
        {src: supportEight, duration: 3000, text: textTwo},
        {src: supportFour, duration: 1000, text: textTwo},
        {src: supportFive, duration: 1000, text: textTwo},
        {src: supportSix, duration: 3000, text: textTwo},
        {src: supportSeven, duration: 3000, text: textTwo},
        {src: supportEight, duration: 3000, text: textTwo},
    ];

    const [index, setIndex] = useState(0);
    const [image, setImage] = useState(sequence[0].src);
    const [text, setText] = useState(sequence[0].text);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIndex((index + 1) % sequence.length);
        }, sequence[index].duration);

        setImage(sequence[index].src);
        setText(sequence[index].text);

        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className={styles['container-reference']}>
            <div className={styles['image-container']}>
                <img src={image} alt="support image" className={styles['image']}/>
            </div>
            <div className={styles['text-container']}>
                {text.split('\n').map((item, key) => {
                    return <React.Fragment key={key}>{item}<br /></React.Fragment>
                })}
            </div>
        </div>
    );
}

export default Reference;