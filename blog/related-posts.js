/* ── PLAN FOR ME EVENTS — AUTO "KEEP READING" ──
   Reads blog/index.html live and builds the Keep Reading
   section on any blog post automatically. No manual wiring
   needed when a new post is published — just add it to
   index.html like usual and it starts showing up here too. */
(function () {
  var grid = document.querySelector('.related-grid');
  if (!grid) return;

  var currentFile = location.pathname.split('/').pop();
  var catEl = document.querySelector('.post-cat');
  var currentCat = catEl
    ? catEl.textContent.trim().toLowerCase().replace(/\s+/g, '-')
    : null;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  fetch('index.html')
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var cards = Array.prototype.slice.call(doc.querySelectorAll('.blog-card'));

      var posts = cards
        .map(function (card) {
          var img = card.querySelector('.bc-img-wrap img');
          var badge = card.querySelector('.bc-cat-badge');
          var title = card.querySelector('.bc-title');
          return {
            href: card.getAttribute('href'),
            cat: card.getAttribute('data-cat'),
            img: img ? img.getAttribute('src') : null,
            badgeText: badge ? badge.textContent.trim() : '',
            title: title ? title.textContent.trim() : ''
          };
        })
        .filter(function (p) { return p.href && p.href !== currentFile; });

      var sameCat = posts.filter(function (p) { return p.cat === currentCat; });
      var otherCat = posts.filter(function (p) { return p.cat !== currentCat; });

      var picks = shuffle(sameCat).concat(shuffle(otherCat)).slice(0, 3);
      if (!picks.length) return;

      grid.innerHTML = picks
        .map(function (p) {
          var imgHtml = p.img
            ? '<img src="' + p.img + '" alt="' + p.title.replace(/"/g, '&quot;') + '" loading="lazy">'
            : '';
          return (
            '<a href="' + p.href + '" class="related-card">' +
              '<div class="related-card-img">' + imgHtml + '</div>' +
              '<span class="related-card-cat">' + p.badgeText + '</span>' +
              '<span class="related-card-title">' + p.title + '</span>' +
            '</a>'
          );
        })
        .join('');
    })
    .catch(function () {
      /* fetch failed (e.g. offline preview) — leave whatever was already
         in the grid rather than showing a broken section */
    });
})();
