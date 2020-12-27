import LoaderComponent from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import s from './Loader.module.css';

const Loader = () => {
  return (
    <div className={s.container}>
      <LoaderComponent type="Audio" color="#D21F3C" height={40} width={140} />
    </div>
  );
};

export default Loader;
