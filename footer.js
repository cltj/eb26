(function() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  const base = footer.dataset.base || '';
  fetch(base + 'footer.html')
    .then(r => r.text())
    .then(html => {
      footer.innerHTML = html;
    });
})();
