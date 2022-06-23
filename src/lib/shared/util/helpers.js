import React from "react";
import Responsive, { useMediaQuery } from "react-responsive";

/* ---------------- STRING FORMATTING ---------------- */

const newlineRegex = /(\r\n|\r|\n)/g;
export const nl2br = (text) => {
  if (typeof text === "number") {
    return text;
  }

  if (typeof text !== "string") {
    return "";
  }

  return text.split(newlineRegex).map((line, index) => {
    if (line.match(newlineRegex)) {
      // eslint-disable-next-line
      return React.createElement("br", { key: index });
    }

    return line;
  });
};

export const millisecondsToHours = (milliseconds) =>
  milliseconds / 1000 / 60 / 60;

export const translateCurrency = (price, currencyCode, locales = "de-DE") => {
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currencyCode,
  }).format(price);
};

export const shouldRedirectToMeinRezept = () => {
  return process.env.REACT_APP_MEINREZEPT_REDIRECT;
};

/* ---------------- JS ESSENTIAL HELPER FUNCTIONS ---------------- */

// http://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
  let timeout;
  return function queueFunc(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const arraysHaveEqualValuesDeep = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((aEl) => b.includes(aEl));
};

export const deepEqualityCheck = (a, b) => {
  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    return a.every((aEl, aIdx) => deepEqualityCheck(aEl, b[aIdx]));
  }

  // if its about scalar types, just fall back to basic equality checking
  if (
    typeof a !== "object" ||
    (a === null && b === null) ||
    (a === undefined && b === undefined)
  ) {
    return a === b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  const aPropertyNames = a === null ? [] : Object.getOwnPropertyNames(a);
  const bPropertyNames = b === null ? [] : Object.getOwnPropertyNames(b);
  if (aPropertyNames.length !== bPropertyNames.length) {
    return false;
  }

  return aPropertyNames.every((aPropertyName) =>
    deepEqualityCheck(a[aPropertyName], b[aPropertyName])
  );
};

export function findMinimumInArrayOfObjects(arr, accessor) {
  let min = Infinity;
  let res = null;
  arr.forEach((el) => {
    const testedVal = accessor(el);
    if (testedVal < min) {
      min = testedVal;
      res = el;
    }
  });
  return res;
}

export function round(number, places) {
  return +`${Math.round(+`${number}e+${places}`)}e-${places}`;
}

export function isNumber(n) {
  return /^-?\d?\.?(?:\d+?e[+-])?\d+$/.test(n);
}

export function isStringInteger(s) {
  return /^\d+$/.test(s);
}

export function isTime(s) {
  return /^\d{1,2}(?::\d{2})?$/.test(s);
}

export function isPLZ(v) {
  return v.length === 5 && isStringInteger(v);
}

export function findPLZ(v) {
  const res = /[\d]{5}/.exec(v);
  return res ? res[0] : "";
}

export function isHouseNumber(v) {
  const singleHouseNumberRegex = /\d+[a-zA-Z]*/;
  const singleHouseNumberStr = singleHouseNumberRegex.source;
  return new RegExp(
    `^${singleHouseNumberStr}(?:-${singleHouseNumberStr})?$`
  ).test(v);
}

export function isPotentialAddress(v) {
  return /^.* \d+.*(?:,[^,]+)+$/.test(v);
}

// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.
export const generateUniqueID = () => Math.random().toString(36).substr(2, 9);

/* ---------------- RESPONSIVENESS ---------------- */

export const MobileBreakpoint = 768;

export const TabletBreakpoint = 1024;

export const SmallDesktopBreakpoint = 1280;

export const useIsMobile = () => {
  return useMediaQuery({ query: `(max-width: ${MobileBreakpoint - 1}px)` });
};

export const useIsTablet = () => {
  return useMediaQuery({ query: `(max-width: ${TabletBreakpoint - 1}px)` });
};

export const IsScreenMD =
  typeof window !== "undefined" && window.innerWidth > MobileBreakpoint - 1;

export const IsScreenLG =
  typeof window !== "undefined" && window.innerWidth > TabletBreakpoint - 1;

export const isScreenXL =
  typeof window !== "undefined" &&
  window.innerWidth > SmallDesktopBreakpoint - 1;

export const desktopOnlyFunction = (fn, isMobile) => {
  return isMobile ? null : fn;
};

/* eslint-enable react/jsx-filename-extension,react/jsx-props-no-spreading */

/* ---------------- DOM MANIPULATION ---------------- */

export const addClassToBody = (cl) => {
  document.body.classList.add(cl);
};

export const removeClassFromBody = (cl) => {
  document.body.classList.remove(cl);
};

export const applyModalManipulationsToBody = () => {
  // welcome to safari
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.position = "fixed";
  document.body.style.width = "100vw";

  // allows us to check if the body style & scroll pos was change because of the safari modal workaround
  document.body.classList.add("layover-open");
};

export const revertModalManipulationOnBody = ({
  overrideScroll = false,
  scrollCallback = null,
} = {}) => {
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.classList.remove("layover-open");
  if (overrideScroll) {
    if (scrollCallback) {
      scrollCallback();
    }
  } else {
    const scrollY = document.body.style.top;
    window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
  }
  document.body.style.top = "";
};

export const performActionWithoutTransitions = (callback) => {
  addClassToBody("no-transition");
  callback();
  setTimeout(() => {
    removeClassFromBody("no-transition");
  }, 1);
};

export const getNavHeight = () => {
  const nav = document.querySelector("nav");
  return nav ? nav.clientHeight : 0;
};

export const scroll = (x, y, smooth = false) => {
  window.scrollTo({ left: x, top: y, behavior: smooth ? "smooth" : "auto" });
};

export const jumpBelowNav = (pos, smooth = false) => {
  scroll(0, pos - getNavHeight(), smooth);
};

export const getPageOffset = (el) => {
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = el.getBoundingClientRect();
  return elemRect.top - bodyRect.top;
};

export const jumpToFirstElement = (
  elArr,
  { navIsFixed, smooth } = { navIsFixed: false, smooth: false }
) => {
  if (!Array.isArray(elArr) || !elArr.length) {
    return;
  }
  let earliestPosition = Infinity;
  elArr.forEach((el) => {
    const top = getPageOffset(el);
    if (top < earliestPosition) {
      earliestPosition = top;
    }
  });
  if (earliestPosition < Infinity) {
    if (navIsFixed) {
      jumpBelowNav(earliestPosition, !!smooth);
    } else {
      scroll(0, earliestPosition, !!smooth);
    }
  }
};

export const disablePageScroll = () => {
  addClassToBody("overflow-hidden");
};

export const enablePageScroll = () => {
  removeClassFromBody("overflow-hidden");
};

export const wrapDOMElement = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

export const CallbackOnEnter = (callback) => (e) => {
  e.persist();
  if (e.key === "Enter" && !e.shiftKey && typeof callback === "function") {
    callback(e);
  }
};
