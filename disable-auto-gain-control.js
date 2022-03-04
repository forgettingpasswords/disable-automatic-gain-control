// Customised port of disable-autogain-control-extension for Qutebrowser

const doDisabling = () => {
  const AUTO_GAIN = 'autoGainControl';
  const TRAITS_TO_DISABLE = [AUTO_GAIN];
  const PATCHES = [
    [navigator, ['getUserMedia', 'mozGetUserMedia', 'webkitGetUserMedia']],
    [navigator.mediaDevices, ['getUserMedia']],
    [MediaStreamTrack.prototype, ['applyConstraints']]
  ];

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

const installDisableAutoGainControl = () => {
  if (window.DISABLED_AUTO_GAIN) return;

  const script = document.createElement('script');
  script.textContent = '(' + doDisabling + ')();';

  (document.head || document.documentElement).appendChild(script);
  script.remove();

  window.DISABLED_AUTO_GAIN = true;
};

installDisableAutoGainControl();
