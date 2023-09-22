import styles from '../styles/LoadingScreen.module.css';
import { useEffect, useRef } from 'react';

export default function LoadingScreen({ doneLoading = false, musicHandler={musicHandler}, tvVideoRef, monitorVideoRef }) {
  const loadingScreen = useRef();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'Space' && doneLoading) {
        loadingScreen.current.classList.add(styles.dissapear);

        // Play the music
        musicHandler.current.handlePlay();

        // Play the videos
        tvVideoRef.current.play();
        monitorVideoRef.current.play();

        // set a 1s timeout to allow the animation to finish
        setTimeout(() => {
          loadingScreen.current.style.display = 'none';
        }, 1000);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [doneLoading]);

  return (
    <div className={styles.wrapper} ref={loadingScreen}>
      <p>LOADING...</p>

      {doneLoading && <p>press SPACE to enter the experience</p>}
    </div>
  );
}