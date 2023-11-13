import Select from 'react-select';
import styles from './Selector.module.css';

const selectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'var(--primary-color)',
        borderColor: state.isFocused ? 'rgba(33, 150, 243, 0.6)' : 'rgba(255, 255, 255, 0.2)',
        borderWidth: '1px',
        borderRadius: '4px',
        color: 'var(--gold-color)',
        boxShadow: 'none',
        '&:hover': {
            borderColor: 'rgba(33, 150, 243, 0.6)',
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: 'var(--gold-color)',
        lineHeight: 'normal',
    }),
    input: (base) => ({
        ...base,
        color: 'var(--light-test-color)',
        lineHeight: '100%',
        justifyContent: 'center',
        height: '1000%',
        alignItems: 'center',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: 'var(--white-color)',
        borderRadius: '4px',
        zIndex: 2,
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.4)',
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }),
    option: (base, { isSelected, isFocused }) => ({
        ...base,
        backgroundColor: isSelected
            ? 'var(--gold-color)'
            : isFocused
                ? '#424242'
                : 'var(--primary-color)',
        color: isSelected ? 'var(--primary-color)' : 'var(--gold-color)',
    }),
};

const TeamSelector = ({ label, options, onChange, teamClassName, teamImage, value }) => {
    return (
        <div className={`${styles['team-selection']} ${teamClassName}`}>
            <div className={styles['team-logo-container']}>
                <img src={teamImage} alt={label} className={styles['team-logo']} />
            </div>
            <div className={styles['select-container']}>
                <Select
                    options={options}
                    onChange={onChange}
                    className={styles['select']}
                    styles={selectStyles}
                    value={value}
                />
            </div>
        </div>
    );
};

export default TeamSelector;