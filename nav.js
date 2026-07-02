(function() {
  const masthead = document.querySelector('.masthead');
  const isSubdir = masthead.dataset.base === '../';
  const base = isSubdir ? '../' : '';
  const page = masthead.dataset.page || '';

  fetch(base + 'nav.html')
    .then(r => r.text())
    .then(html => {
      masthead.innerHTML = html.replace(/\{base\}/g, base);

      // Mark active page
      masthead.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === page) link.classList.add('active');
      });

      // Burger menu
      masthead.querySelector('.burger-btn').addEventListener('click', () => {
        masthead.querySelector('.burger-menu').classList.toggle('open');
      });

      // Scroll collapse
      window.addEventListener('scroll', () => {
        masthead.classList.toggle('collapsed', window.scrollY > 80);
        const bm = masthead.querySelector('.burger-menu');
        if (bm) bm.classList.remove('open');
      });

      // Click outside close
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.burger-btn') && !e.target.closest('.burger-menu')) {
          const bm = masthead.querySelector('.burger-menu');
          if (bm) bm.classList.remove('open');
        }
      });
    });
})();
