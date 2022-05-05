import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import getLineHeight from 'line-height';

const resizeEvent = 'autosize:resized';

function TextareaAutosize({ className, rows, maxRows, onResize, ...props }) {
  const [maxHeight, setMaxHeight] = useState('');

  const textareaRef = useRef();

  /* INIT LISTENERS */

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    autosize(textarea);

    return () => {
      autosize.destroy(textarea);
    };
  }, [onResize]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    textarea.addEventListener(resizeEvent, onResize);

    return () => {
      textarea.removeEventListener(resizeEvent, onResize);
    };
  }, [onResize]);

  /* INIT STYLE */

  useLayoutEffect(() => {
    if (typeof maxRows !== 'number') {
      setMaxHeight('');
      return;
    }
    const lineHeight = getLineHeight(textareaRef.current);
    setMaxHeight(`${maxRows * lineHeight}px`);
  }, [maxRows]);

  /* UPDATE ON RERENDER / VALUE CHANGE */

  useLayoutEffect(() => {
    autosize.update(textareaRef.current);
  });

  return (
    <textarea
      ref={textareaRef}
      className={className}
      style={{ maxHeight }}
      rows={rows}
      {...props}
    />
  );
}

TextareaAutosize.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  onResize: PropTypes.func,
};

TextareaAutosize.defaultProps = {
  className: '',
  rows: undefined,
  maxRows: undefined,
  onResize: null,
};

export default TextareaAutosize;
