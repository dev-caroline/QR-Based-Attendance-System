import './Loader.css';

const Loader = ({ size = 'medium', text = '' }) => {
    const sizeClass = size === 'small' ? 'loader-small' : size === 'large' ? 'loader-large' : '';
    
    return (
        <div className="loader-container">
            <div className={`loader ${sizeClass}`}></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
