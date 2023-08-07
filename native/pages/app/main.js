const detectIsInstalled = () => {
  if (typeof window !== 'undefined') {
    // For iOS
    if (window.navigator['standalone']) return true;

    // For Android
    if (window.matchMedia('(display-mode: standalone)').matches) return true;

    if (window.localStorage.getItem('pwa')?.toLocaleLowerCase() === 'true') return true;
  }

  return false;
};

const element = {
  isInstalled: document.querySelector('#is-installed'),
  displayMode: document.querySelector('#display-mode'),
};

console.log(element.isInstalled);

element.isInstalled.innerText = detectIsInstalled().toString();

console.log('detectIsInstalled', detectIsInstalled());

window.addEventListener('DOMContentLoaded', () => {
  let displayMode = 'browser tab';
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }

  element.displayMode.innerText = displayMode;
  // Log launch display mode to analytics
  console.log('DISPLAY_MODE_LAUNCH:', displayMode);
});
