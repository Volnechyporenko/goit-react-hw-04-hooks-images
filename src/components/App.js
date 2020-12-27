import { useState, useEffect } from 'react';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import s from './App.module.css';

const API_URL = {
  url: 'https://pixabay.com/api/',
  key: 'key=19554713-985e885829a4f41904dd25c99',
  perPage: 12,
};

const STATUSES = {
  resolved: 'resolved',
  pending: 'pending',
  notFound: 'notFound',
  error: 'error',
  idle: 'idle',
};

const App = () => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(STATUSES.idle);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState({});

  const { pending, resolved, notFound, error } = STATUSES;

  useEffect(() => {
    if (query) {
      setStatus(pending);
      fetch(
        `${API_URL.url}?${API_URL.key}&q=${query}&image_type=photo&per_page=${API_URL.perPage}&page=${page}`,
      )
        .then(responce => {
          if (responce.ok) {
            return responce.json();
          }
          return Promise.reject(new Error('Нет картинок'));
        })
        .then(data => {
          setImages(images.concat(data.hits));
          setStatus(data.totalHits > 0 ? resolved : notFound);
        })
        .catch(e => setStatus(error));
    }
  }, [query, page]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, [images]);

  const closeModal = () => {
    setShowModal(false);
  };

  const onImageClick = image => {
    setModalImage(image);
    setShowModal(true);
  };

  const onSubmit = query => {
    if (!query) {
      return;
    }
    setQuery(query);
    setImages([]);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={onSubmit} />
      {(status === resolved || status === pending) && (
        <>
          <ImageGallery images={images} onImageClick={onImageClick} />
          {status === pending ? <Loader /> : <Button onClick={onLoadMore} />}
        </>
      )}
      {status === notFound && <div>Images not found</div>}
      {showModal && (
        <Modal onClose={closeModal}>
          <img
            className={s.modalImage}
            src={modalImage.largeImageURL}
            alt={modalImage.tags}
          />
          <button className={s.closeButton} onClick={closeModal}>
            X
          </button>
        </Modal>
      )}
    </div>
  );
};

export default App;
