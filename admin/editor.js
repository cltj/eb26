// State
let chapters = [];
let documents = [];
let links = [];
let tags = [];
let chapterCounter = 0;

// --- CHAPTERS ---

function addChapter() {
  chapterCounter++;
  const id = chapterCounter;
  chapters.push({ id, title: '', blocks: [] });
  renderChapters();
}

function removeChapter(id) {
  chapters = chapters.filter(c => c.id !== id);
  renumberChapters();
  renderChapters();
}

function renumberChapters() {
  // Numbers are derived from array position, no need to renumber IDs
}

function renderChapters() {
  const container = document.getElementById('chaptersContainer');
  container.innerHTML = '';

  chapters.forEach((chapter, index) => {
    const num = index + 1;
    const el = document.createElement('div');
    el.className = 'chapter-block';
    el.innerHTML = `
      <div class="chapter-header">
        <span class="chapter-number-badge">${num}</span>
        <input type="text" class="chapter-title-input" placeholder="Chapter title..."
          value="${escapeAttr(chapter.title)}"
          oninput="updateChapterTitle(${chapter.id}, this.value)">
        <button class="btn-remove" onclick="removeChapter(${chapter.id})" title="Remove chapter">&times;</button>
      </div>
      <div class="chapter-body">
        <div class="chapter-blocks" id="chapterBlocks_${chapter.id}">
          ${renderBlocks(chapter)}
        </div>
        <div class="block-toolbar">
          <button class="btn-block" onclick="addBlock(${chapter.id}, 'text')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            Text
          </button>
          <button class="btn-block" onclick="addBlock(${chapter.id}, 'image')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Picture
          </button>
          <button class="btn-block" onclick="addBlock(${chapter.id}, 'highlight')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M3 6l3-3 3 3"/><line x1="6" y1="3" x2="6" y2="10"/></svg>
            Highlight / Quote
          </button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

function updateChapterTitle(id, value) {
  const chapter = chapters.find(c => c.id === id);
  if (chapter) chapter.title = value;
}

// --- BLOCKS ---

function addBlock(chapterId, type) {
  const chapter = chapters.find(c => c.id === chapterId);
  if (!chapter) return;

  const blockId = Date.now() + Math.random();
  chapter.blocks.push({ id: blockId, type, content: '', caption: '', cite: '' });
  renderChapters();

  // Focus the new block
  setTimeout(() => {
    const el = document.querySelector(`[data-block-id="${blockId}"] textarea`);
    if (el) el.focus();
  }, 50);
}

function removeBlock(chapterId, blockId) {
  const chapter = chapters.find(c => c.id === chapterId);
  if (chapter) {
    chapter.blocks = chapter.blocks.filter(b => b.id !== blockId);
    renderChapters();
  }
}

function updateBlock(chapterId, blockId, field, value) {
  const chapter = chapters.find(c => c.id === chapterId);
  if (!chapter) return;
  const block = chapter.blocks.find(b => b.id === blockId);
  if (block) block[field] = value;
}

function renderBlocks(chapter) {
  return chapter.blocks.map(block => {
    let inner = '';

    if (block.type === 'text') {
      inner = `
        <div class="content-block-header">
          <span>Text</span>
          <button class="btn-remove" onclick="removeBlock(${chapter.id}, ${block.id})">&times;</button>
        </div>
        <div class="content-block-body">
          <textarea placeholder="Write paragraph text..."
            oninput="updateBlock(${chapter.id}, ${block.id}, 'content', this.value)">${escapeHTML(block.content)}</textarea>
        </div>`;
    } else if (block.type === 'image') {
      inner = `
        <div class="content-block-header">
          <span>Picture</span>
          <button class="btn-remove" onclick="removeBlock(${chapter.id}, ${block.id})">&times;</button>
        </div>
        <div class="content-block-body">
          <div class="image-upload">
            <input type="file" accept="image/*"
              onchange="handleBlockImage(this, ${chapter.id}, ${block.id})">
            <div class="image-upload-placeholder ${block.content ? 'has-image' : ''}"
              id="blockImg_${block.id}"
              ${block.content ? `style="background-image:url(${block.content})"` : ''}>
              <span>${block.content ? 'Change image' : 'Click or drag to upload'}</span>
            </div>
          </div>
          <input type="text" class="input-caption" placeholder="Image caption..."
            value="${escapeAttr(block.caption)}"
            oninput="updateBlock(${chapter.id}, ${block.id}, 'caption', this.value)">
        </div>`;
    } else if (block.type === 'highlight') {
      inner = `
        <div class="content-block-header">
          <span>Highlight / Quote</span>
          <button class="btn-remove" onclick="removeBlock(${chapter.id}, ${block.id})">&times;</button>
        </div>
        <div class="content-block-body block-type-highlight">
          <textarea placeholder="Enter quote or highlight text..."
            oninput="updateBlock(${chapter.id}, ${block.id}, 'content', this.value)">${escapeHTML(block.content)}</textarea>
        </div>
        <div style="padding: 0 12px 12px;">
          <input type="text" placeholder="Source / attribution (optional)"
            value="${escapeAttr(block.cite)}"
            oninput="updateBlock(${chapter.id}, ${block.id}, 'cite', this.value)"
            style="font-size:0.85rem; font-style:italic;">
        </div>`;
    }

    return `<div class="content-block" data-block-id="${block.id}">${inner}</div>`;
  }).join('');
}

// --- DOCUMENTS ---

function addDocument() {
  documents.push({ id: Date.now(), name: '', size: '' });
  renderDocuments();
}

function removeDocument(id) {
  documents = documents.filter(d => d.id !== id);
  renderDocuments();
}

function updateDocument(id, field, value) {
  const doc = documents.find(d => d.id === id);
  if (doc) doc[field] = value;
}

function renderDocuments() {
  const container = document.getElementById('documentsContainer');
  container.innerHTML = documents.map(doc => `
    <div class="doc-row">
      <input type="text" placeholder="File name (e.g. report.pdf)"
        value="${escapeAttr(doc.name)}"
        oninput="updateDocument(${doc.id}, 'name', this.value)">
      <input type="text" placeholder="Size"
        value="${escapeAttr(doc.size)}"
        oninput="updateDocument(${doc.id}, 'size', this.value)">
      <button class="btn-remove" onclick="removeDocument(${doc.id})">&times;</button>
    </div>
  `).join('');
}

// --- LINKS ---

function addLink() {
  links.push({ id: Date.now(), title: '', url: '' });
  renderLinks();
}

function removeLink(id) {
  links = links.filter(l => l.id !== id);
  renderLinks();
}

function updateLink(id, field, value) {
  const link = links.find(l => l.id === id);
  if (link) link[field] = value;
}

function renderLinks() {
  const container = document.getElementById('linksContainer');
  container.innerHTML = links.map(link => `
    <div class="link-row">
      <input type="text" placeholder="Link title"
        value="${escapeAttr(link.title)}"
        oninput="updateLink(${link.id}, 'title', this.value)">
      <input type="url" placeholder="https://..."
        value="${escapeAttr(link.url)}"
        oninput="updateLink(${link.id}, 'url', this.value)">
      <button class="btn-remove" onclick="removeLink(${link.id})">&times;</button>
    </div>
  `).join('');
}

// --- TAGS ---

function addTag() {
  const input = document.getElementById('tagInput');
  const value = input.value.trim();
  if (value && !tags.includes(value)) {
    tags.push(value);
    input.value = '';
    renderTags();
  }
}

function removeTag(index) {
  tags.splice(index, 1);
  renderTags();
}

function renderTags() {
  const container = document.getElementById('tagsDisplay');
  container.innerHTML = tags.map((tag, i) => `
    <span class="tag-pill">
      ${escapeHTML(tag)}
      <button class="btn-remove" onclick="removeTag(${i})">&times;</button>
    </span>
  `).join('');
}

// --- IMAGE HANDLING ---

function handleImageUpload(input, previewId, dataId) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById(previewId);
    preview.style.backgroundImage = `url(${e.target.result})`;
    preview.classList.add('has-image');
    preview.querySelector('span').textContent = 'Change image';
    document.getElementById(dataId).value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleBlockImage(input, chapterId, blockId) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    updateBlock(chapterId, blockId, 'content', e.target.result);
    const preview = document.getElementById(`blockImg_${blockId}`);
    if (preview) {
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.classList.add('has-image');
      preview.querySelector('span').textContent = 'Change image';
    }
  };
  reader.readAsDataURL(file);
}

// --- GENERATE HTML ---

function generatePostHTML() {
  const title = document.getElementById('postTitle').value || 'Untitled Post';
  const author = document.getElementById('postAuthor').value || 'Author';
  const dateVal = document.getElementById('postDate').value;
  const readTime = document.getElementById('postReadTime').value || '5 min read';
  const category = document.getElementById('postCategory').value || 'Update';
  const heroCaption = document.getElementById('heroCaption').value || '';
  const ingress = document.getElementById('postIngress').value || '';

  const dateFormatted = dateVal
    ? new Date(dateVal).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Date TBD';
  const timeFormatted = dateVal
    ? new Date(dateVal).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC'
    : '';

  let chaptersHTML = '';
  chapters.forEach((chapter, index) => {
    const num = index + 1;
    let blocksHTML = '';

    chapter.blocks.forEach(block => {
      if (block.type === 'text') {
        const paragraphs = block.content.split('\n\n').filter(p => p.trim());
        blocksHTML += paragraphs.map(p => `          <p>${escapeHTML(p.trim())}</p>\n`).join('\n');
      } else if (block.type === 'image') {
        blocksHTML += `
          <figure class="article-image">
            <img src="../images/IMAGE_FILENAME_HERE" alt="${escapeAttr(block.caption)}">
            <figcaption>${escapeHTML(block.caption)}</figcaption>
          </figure>\n`;
      } else if (block.type === 'highlight') {
        blocksHTML += `
          <blockquote>
            <p>"${escapeHTML(block.content)}"</p>
            ${block.cite ? `<cite>- ${escapeHTML(block.cite)}</cite>` : ''}
          </blockquote>\n`;
      }
    });

    chaptersHTML += `
        <div class="chapter" id="chapter-${num}">
          <h2><span class="chapter-number">${num}</span> ${escapeHTML(chapter.title)}</h2>
${blocksHTML}
        </div>\n`;
  });

  let docsHTML = '';
  if (documents.length > 0) {
    docsHTML = `
        <div class="chapter" id="documents">
          <h2>Related Documents</h2>
          <div class="article-files">
${documents.map(doc => {
  const ext = doc.name.split('.').pop().toUpperCase() || 'FILE';
  return `            <a href="../files/${escapeAttr(doc.name)}" class="article-file">
              <span class="file-icon">${ext}</span>
              <span class="file-info">
                <span class="file-name">${escapeHTML(doc.name)}</span>
                <span class="file-size">${escapeHTML(doc.size)}</span>
              </span>
            </a>`;
}).join('\n')}
          </div>
        </div>\n`;
  }

  let relatedLinksHTML = '';
  if (links.length > 0) {
    relatedLinksHTML = `
      <aside class="related-stories">
        <h2 class="related-title">Related</h2>
        <div class="related-list">
${links.map(link => `          <a href="${escapeAttr(link.url)}" class="related-item" target="_blank">
            <div class="related-info">
              <h3>${escapeHTML(link.title)}</h3>
            </div>
          </a>`).join('\n')}
        </div>
      </aside>\n`;
  }

  let tagsHTML = '';
  if (tags.length > 0) {
    tagsHTML = `
      <div class="article-tags">
        <span class="tags-label">Tags:</span>
${tags.map(t => `        <a href="#" class="tag">${escapeHTML(t)}</a>`).join('\n')}
      </div>\n`;
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const isoDate = dateVal ? new Date(dateVal).toISOString() : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)} - Placeholder</title>

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(ingress.substring(0, 200))}">
  <meta property="og:image" content="https://ppop.lol/images/IMAGE_FILENAME_HERE">
  <meta property="og:url" content="https://ppop.lol/posts/${slug}.html">
  <meta property="og:site_name" content="Placeholder">
  ${isoDate ? `<meta property="article:published_time" content="${isoDate}">` : ''}

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(ingress.substring(0, 200))}">
  <meta name="twitter:image" content="https://ppop.lol/images/IMAGE_FILENAME_HERE">

  <link rel="stylesheet" href="../style.css">
</head>
<body>

  <header class="masthead">
    <div class="container-wide">
      <div class="masthead-inner">
        <a href="../index.html" class="site-title">Placeholder</a>
        <p class="site-tagline">Investigating EB operations</p>
      </div>
      <nav class="nav">
        <a href="../index.html" class="nav-link">Home</a>
        <a href="../archive.html" class="nav-link">Archive</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <article class="article">

      <h1 class="article-title">${escapeHTML(title)}</h1>

      <div class="article-byline">
        <div class="byline-left">
          <div class="byline-info">
            <span class="byline-author">By <strong>${escapeHTML(author)}</strong></span>
            <time class="byline-date">${dateFormatted}${timeFormatted ? ' &middot; ' + timeFormatted : ''} &middot; ${escapeHTML(readTime)}</time>
          </div>
        </div>
        <div class="share-links byline-share">
          <a href="#" class="share-btn share-x" title="Share on X" onclick="window.open('https://x.com/intent/tweet?url='+encodeURIComponent(location.href)+'&text='+encodeURIComponent(document.title),'_blank','width=550,height=420');return false;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="share-btn share-facebook" title="Share on Facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank','width=550,height=420');return false;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="share-btn share-linkedin" title="Share on LinkedIn" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.href),'_blank','width=550,height=420');return false;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" class="share-btn share-email" title="Share via Email" onclick="location.href='mailto:?subject='+encodeURIComponent(document.title)+'&body='+encodeURIComponent(location.href);return false;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
          <button class="share-btn share-copy" title="Copy link" onclick="navigator.clipboard.writeText(location.href);this.classList.add('copied');setTimeout(()=>this.classList.remove('copied'),2000)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </div>
      <hr class="byline-divider">

      <figure class="article-hero">
        <img src="../images/IMAGE_FILENAME_HERE" alt="${escapeAttr(title)}">
        <figcaption>${escapeHTML(heroCaption)}</figcaption>
      </figure>

      <div class="article-body">
        <p class="lead">${escapeHTML(ingress)}</p>
${chaptersHTML}${docsHTML}
      </div>
${relatedLinksHTML}${tagsHTML}
    </article>

    <section class="comments-section" id="commentsSection">
      <h2 class="comments-title">Comments <span class="comments-count">0</span></h2>
      <div class="comments-list"></div>
      <div class="comment-form-wrapper">
        <h3 class="comment-form-title">Leave a Comment</h3>
        <p class="comment-notice">Your comment will appear after admin approval.</p>
        <form class="comment-form" onsubmit="handleComment(event)">
          <div class="form-row">
            <input type="text" name="name" placeholder="Name" required class="form-input">
            <input type="email" name="email" placeholder="Email (not published)" required class="form-input">
          </div>
          <textarea name="comment" placeholder="Write your comment..." required class="form-textarea" rows="4"></textarea>
          <button type="submit" class="form-submit">Submit Comment</button>
        </form>
        <div class="comment-success" id="commentSuccess" style="display:none;">
          Thank you. Your comment has been submitted for review.
        </div>
      </div>
    </section>

  </main>

  <button class="comment-fab" id="commentFab" onclick="toggleComments()" title="Comments">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span class="fab-count">0</span>
  </button>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Placeholder. All rights reserved.</p>
    </div>
  </footer>

  <script>
    function handleComment(e) {
      e.preventDefault();
      e.target.style.display = 'none';
      document.getElementById('commentSuccess').style.display = 'block';
    }
    function toggleComments() {
      document.getElementById('commentsSection').scrollIntoView({ behavior: 'smooth' });
    }
    const fab = document.getElementById('commentFab');
    const commentsSection = document.getElementById('commentsSection');
    window.addEventListener('scroll', () => {
      const rect = commentsSection.getBoundingClientRect();
      fab.classList.toggle('hidden', rect.top < window.innerHeight && rect.bottom > 0);
    });
  </script>

</body>
</html>`;
}

// --- PREVIEW ---

function generatePreview() {
  const html = generatePostHTML();
  const frame = document.getElementById('previewFrame');
  const output = document.getElementById('htmlOutput');
  const code = document.getElementById('htmlCode');

  frame.style.display = 'block';
  frame.innerHTML = '<iframe></iframe>';
  const iframe = frame.querySelector('iframe');
  iframe.srcdoc = html;

  output.style.display = 'block';
  code.value = html;
}

function copyHTML() {
  const code = document.getElementById('htmlCode');
  navigator.clipboard.writeText(code.value);
  showToast('HTML copied to clipboard');
}

// --- SAVE / PUBLISH ---

function saveDraft() {
  const data = gatherData();
  localStorage.setItem('postDraft', JSON.stringify(data));
  showToast('Draft saved');
}

function publishPost() {
  generatePreview();
  showToast('Post HTML generated. Copy the output and add it to your repo.');
}

function gatherData() {
  return {
    title: document.getElementById('postTitle').value,
    author: document.getElementById('postAuthor').value,
    date: document.getElementById('postDate').value,
    readTime: document.getElementById('postReadTime').value,
    category: document.getElementById('postCategory').value,
    heroCaption: document.getElementById('heroCaption').value,
    ingress: document.getElementById('postIngress').value,
    chapters,
    documents,
    links,
    tags
  };
}

function loadDraft() {
  const saved = localStorage.getItem('postDraft');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    document.getElementById('postTitle').value = data.title || '';
    document.getElementById('postAuthor').value = data.author || '';
    document.getElementById('postDate').value = data.date || '';
    document.getElementById('postReadTime').value = data.readTime || '';
    document.getElementById('postCategory').value = data.category || '';
    document.getElementById('heroCaption').value = data.heroCaption || '';
    document.getElementById('postIngress').value = data.ingress || '';
    chapters = data.chapters || [];
    documents = data.documents || [];
    links = data.links || [];
    tags = data.tags || [];
    chapterCounter = chapters.length ? Math.max(...chapters.map(c => c.id)) : 0;
    renderChapters();
    renderDocuments();
    renderLinks();
    renderTags();
  } catch (e) {
    // Ignore corrupt data
  }
}

// --- UTILS ---

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('postDate').value = now.toISOString().slice(0, 16);
  loadDraft();
});
