(function() {
  const container = document.getElementById('commentsContainer');
  if (!container) return;

  const base = container.dataset.base || '';

  fetch(base + 'comments.html')
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;

      // Set comment count
      const comments = JSON.parse(container.dataset.comments || '[]');
      const countEl = container.querySelector('.comments-count');
      if (countEl && comments.length) countEl.textContent = comments.length;

      // Render comments
      const list = container.querySelector('.comments-list');
      comments.forEach(c => {
        list.appendChild(buildComment(c));
      });

      // Form submit
      const form = container.querySelector('.comment-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        container.querySelector('.comment-success').style.display = 'block';
      });

      // FAB
      const fab = document.getElementById('commentFab');
      const section = document.getElementById('commentsSection');
      if (fab && section) {
        fab.addEventListener('click', () => {
          section.scrollIntoView({ behavior: 'smooth' });
        });
        window.addEventListener('scroll', () => {
          const rect = section.getBoundingClientRect();
          fab.classList.toggle('hidden', rect.top < window.innerHeight && rect.bottom > 0);
        });
      }
    });

  function buildComment(c) {
    const div = document.createElement('div');
    div.className = 'comment' + (c.nested ? ' comment-nested' : '');
    div.innerHTML =
      '<div class="comment-header">' +
        '<span class="comment-author">' + esc(c.author) + '</span>' +
        '<span class="comment-role comment-role-' + esc(c.role) + '">' + esc(c.role) + '</span>' +
        '<time class="comment-date">' + esc(c.date) + '</time>' +
      '</div>' +
      '<p class="comment-body">' + esc(c.body) + '</p>' +
      '<div class="comment-reactions">' +
        '<button class="reaction-btn" data-emoji="thumbsup"><span class="reaction-icon">&#128077;</span><span class="reaction-count">' + (c.reactions && c.reactions.thumbsup || 0) + '</span></button>' +
        '<button class="reaction-btn" data-emoji="heart"><span class="reaction-icon">&#10084;&#65039;</span><span class="reaction-count">' + (c.reactions && c.reactions.heart || 0) + '</span></button>' +
        '<button class="reaction-btn" data-emoji="fire"><span class="reaction-icon">&#128293;</span><span class="reaction-count">' + (c.reactions && c.reactions.fire || 0) + '</span></button>' +
        '<button class="reaction-btn" data-emoji="eyes"><span class="reaction-icon">&#128064;</span><span class="reaction-count">' + (c.reactions && c.reactions.eyes || 0) + '</span></button>' +
      '</div>' +
      '<button class="comment-reply-btn">Reply</button>' +
      '<div class="comment-reply-form" style="display:none;">' +
        '<form>' +
          '<div class="form-row-3">' +
            '<input type="text" name="name" placeholder="Name" required class="form-input">' +
            '<input type="email" name="email" placeholder="Email (not published)" required class="form-input">' +
            '<select name="role" class="form-select" required>' +
              '<option value="reader">Reader</option>' +
              '<option value="owner">Owner</option>' +
            '</select>' +
          '</div>' +
          '<textarea name="comment" placeholder="Write your reply..." required class="form-textarea" rows="3"></textarea>' +
          '<div class="reply-actions">' +
            '<button type="submit" class="form-submit">Reply</button>' +
            '<button type="button" class="reply-cancel">Cancel</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    // Reaction buttons
    div.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (this.classList.contains('reacted')) return;
        this.classList.add('reacted');
        const count = this.querySelector('.reaction-count');
        count.textContent = parseInt(count.textContent || 0) + 1;
      });
    });

    // Reply toggle
    div.querySelector('.comment-reply-btn').addEventListener('click', function() {
      const rf = div.querySelector('.comment-reply-form');
      rf.style.display = rf.style.display === 'none' ? 'block' : 'none';
    });

    const cancelBtn = div.querySelector('.reply-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        div.querySelector('.comment-reply-form').style.display = 'none';
      });
    }

    const replyForm = div.querySelector('.comment-reply-form form');
    if (replyForm) {
      replyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        div.querySelector('.comment-reply-form').innerHTML =
          '<p style="color:#8b0000;font-size:0.85rem;margin-top:8px;">Reply submitted for review.</p>';
      });
    }

    // Nested replies
    if (c.replies && c.replies.length) {
      const repliesDiv = document.createElement('div');
      repliesDiv.className = 'comment-replies';
      c.replies.forEach(r => {
        r.nested = true;
        repliesDiv.appendChild(buildComment(r));
      });
      div.appendChild(repliesDiv);
    }

    return div;
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
})();
