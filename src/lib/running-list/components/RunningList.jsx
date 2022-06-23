import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/animation.css';

function RunningList({ children, className }) {
  const [animationWidth, setAnimationWidth] = useState(0);

  const [mounted, setMounted] = useState(false);

  const listContainerRef = useRef();

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, [setMounted]);

  useEffect(() => {
    function updateWidth() {
      setTimeout(() => {
        if (listContainerRef && listContainerRef.current) {
          setAnimationWidth(listContainerRef.current.offsetWidth);
        }
      }, 100);
    }
    if (listContainerRef && listContainerRef.current) {
      window.addEventListener('resize', updateWidth);
      listContainerRef.current.addEventListener('animationstart', updateWidth);
    }

    return () => window.removeEventListener('resize', updateWidth);
  }, [listContainerRef, mounted]);

  return (
    <div className={`running-list-wrapper ${className}`}>
      <ul
        style={{
          '--animation-width': `${animationWidth}px`,
          '--list-items': React.Children.count(children),
        }}
        ref={listContainerRef}
        className="running-list whitespace-nowrap inline-block font-bold text-white italic text-2xl list-reset leading-loose"
      >
        {children}
      </ul>
    </div>
  );
}

RunningList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

RunningList.defaultProps = {
  className: '',
};

export default RunningList;
