export const injectedDndSearchModal = `
   (function() {
    const removeAds = () => {
      const adSelectors = [
        'iframe[id*="google_ads"]',
        'iframe[src*="googlesyndication"]',
        '[id^="r89-"]',
        '[class*="r89-"]',
        '[id*="billboard"]',
        '[id*="ad"]',
        '.adsbygoogle',
        '.ad',
        '.ads',
        '[id*="Ad"]',
        '[class*="Ad"]',
      ];
      adSelectors.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => el.remove())
      );

      // Kill Google Ads containers
      document.querySelectorAll('div[id^="google_ads_iframe"]').forEach(el => el.remove());
      document.querySelectorAll('[data-google-query-id]').forEach(el => el.remove());
    };

    const removeLayout = () => {
      const layoutSelectors = [
        'header',
        'nav',
        'footer',
        '#sidebar',
        '.colg',
        '.cold',
        '.menu',
        '#top',
        '.navbar',
        '#topbar',
      ];
      layoutSelectors.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => el.remove())
      );

      // const main = document.querySelector('.colc, #contenu, main');
      // if (main) {
      //   main.style.width = '100%';
      //   main.style.margin = '0';
      //   main.style.padding = '16px';
      //   main.style.fontSize = '16px';
      //   main.style.lineHeight = '1.6';
      // }
      //
      // document.body.style.background = '#fff';
      // document.documentElement.style.background = '#fff';
      document.cookie = '';
    };

    // Block ad scripts before they load
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
      const el = originalCreateElement.call(document, tagName, options);
      if (tagName.toLowerCase() === 'script') {
        const setSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
        Object.defineProperty(el, 'src', {
          set(value) {
            if (
              /googlesyndication|doubleclick|adservice|adsystem|r89|consent|cookie/i.test(value)
            ) {
              el.type = 'javascript/blocked';
              el.remove();
              return;
            }
            setSrc.call(el, value);
          },
        });
      }
      return el;
    };

    // Run initial cleanup
    removeAds();
    removeLayout();

    // Keep cleaning forever (every 1s)
    setInterval(() => {
      removeAds();
      removeLayout();
    }, 1000);

    // Observe for dynamic DOM changes
    const observer = new MutationObserver(() => {
      removeAds();
      removeLayout();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  })();
  true;
  `;

export const makeHighlightScript = (rawQuery: string) => {
    const escapeForRegExp = (s: string) =>
        s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escaped = escapeForRegExp(rawQuery);
    // embed safely as JS string literal using JSON.stringify
    const qLiteral = JSON.stringify(escaped);

    return `
    (function(){
      try {
        // Remove existing highlights (unwrap mark[data-highlight])
        document.querySelectorAll('mark[data-highlight]').forEach(function(mark){
          try {
            var parent = mark.parentNode;
            while(mark.firstChild) parent.insertBefore(mark.firstChild, mark);
            parent.removeChild(mark);
          } catch(e){}
        });

        // Build regex from the query
        var pattern = ${qLiteral};
        if(!pattern || pattern.length === 0) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'HIGHLIGHT_COUNT', count: 0 }));
          return;
        }
        var regex = new RegExp(pattern, 'gi');

        // Walk text nodes only and skip script/style/textarea/input/iframe and existing marks
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function(node){
            if(!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            var parent = node.parentNode;
            if(!parent) return NodeFilter.FILTER_REJECT;
            var name = parent.nodeName && parent.nodeName.toLowerCase();
            var skip = ['script','style','noscript','iframe','textarea','input'];
            if(skip.indexOf(name) !== -1) return NodeFilter.FILTER_REJECT;
            // don't search inside existing highlights
            if(parent.closest && parent.closest('mark[data-highlight]')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        }, false);

        var textNodes = [];
        while(walker.nextNode()) textNodes.push(walker.currentNode);

        textNodes.forEach(function(textNode){
          var text = textNode.nodeValue;
          regex.lastIndex = 0;
          var match;
          var lastIndex = 0;
          var frag = document.createDocumentFragment();
          var has = false;
          while((match = regex.exec(text)) !== null){
            has = true;
            var before = text.slice(lastIndex, match.index);
            if(before.length) frag.appendChild(document.createTextNode(before));
            var mark = document.createElement('mark');
            mark.setAttribute('data-highlight', 'true');
            // minimal styling to avoid layout shift as much as possible
            mark.style.background = 'yellow';
            mark.style.padding = '0.05em';
            mark.style.borderRadius = '0.15em';
            mark.appendChild(document.createTextNode(match[0]));
            frag.appendChild(mark);
            lastIndex = regex.lastIndex;
          }
          if(has){
            var after = text.slice(lastIndex);
            if(after.length) frag.appendChild(document.createTextNode(after));
            try { textNode.parentNode.replaceChild(frag, textNode); } catch(e){}
          }
        });

        // Collect marks and scroll to first
        var marks = Array.from(document.querySelectorAll('mark[data-highlight]'));
        window.__marks = marks;
        window.__currentIndex = 0;
        if(marks.length > 0){
          marks.forEach(function(m){ try { m.style.background = 'yellow'; } catch(e){} });
          try {
            var first = marks[0];
            first.style.background = 'orange';
            first.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch(e){}
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'HIGHLIGHT_COUNT', count: marks.length }));
      } catch(e){
        // If anything goes wrong, report zero to RN
        try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'HIGHLIGHT_COUNT', count: 0 })); } catch(e){}
      }
    })();
    true;
    `;
};
