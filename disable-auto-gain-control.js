// ==UserScript==
// @name         disable-auto-gain-control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  patches getUserMedia and family of functions to disable automatic gain control for audio input
// @author       toms.ozols5@gmail.com
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const doDisabling = () => {
  const TRAITS_TO_DISABLE = ['autoGainControl', 'googAutoGainControl', 'googAutoGainControl2'];
  const PATCHES = [
    [navigator, ['getUserMedia', 'mozGetUserMedia', 'webkitGetUserMedia']], // Legacy APIs
    [navigator.mediaDevices, ['getUserMedia']], // Actual API
    [MediaStreamTrack.prototype, ['applyConstraints']] // Sneaky API for post-updates
  ];

  // TODO: Haven't covered some possible legacy options: constraint.optional/mandatory
  // If in doubt - refer to the chrome extension
  const setConstraint = (constraintObj, name) => {
    const config = constraintObj.advanced
          && constraintObj.advanced.find(option => name in option)
          || constraintObj;

    config[name] = false;
  };

  const autoGainConstraint = (constraints) => {
    if (!constraints || !constraints.audio) return;

    if (typeof constraints.audio !== 'object') {
      constraints.audio = {};
    }

    TRAITS_TO_DISABLE.forEach(key => {
      setConstraint(constraints.audio, key);
    });
  };

  const patchWithConstraints = (objie, functionName) => {
    const original = objie[functionName];
    const getUserMediaPatched = (constraints, ...rest) => {
      autoGainConstraint(constraints);
      return original.call(objie, constraints, ...rest);
    };

    objie[functionName] = getUserMediaPatched;
  };

  PATCHES.forEach(([globalObject, functionNames]) =>
    functionNames.forEach((name) =>
      patchWithConstraints(globalObject, name)
    )
  );
};

if (!window.DISABLED_AUTO_GAIN) {
  doDisabling();
  window.DISABLED_AUTO_GAIN = true;
}
