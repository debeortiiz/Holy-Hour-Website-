/**
 * language.js – Persistent language selection for Holy Hour Website
 *
 * Behavior:
 *  • On every page load the script determines the current language from the
 *    URL path (e.g. /es/about.html → "es", /about.html → "en").
 *  • If the URL already contains a language prefix the user's preference is
 *    saved to localStorage so that direct navigation to any language is
 *    always respected.
 *  • When the current page is English (root) but a non-English preference
 *    has been saved the user is transparently redirected to the equivalent
 *    page in their preferred language (if it exists).
 *  • Clicking any language-switcher button immediately persists that choice
 *    so the very next page load uses the new preference.
 *  • No infinite redirects: after a redirect the saved language equals the
 *    current language, so the redirect check is a no-op.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'holyHourLang';
    var LANGS = ['en', 'es', 'de', 'it', 'fr', 'pt', 'he', 'ar', 'am', 'hi', 'zh', 'ja', 'ko', 'sw'];

    /** Return the language code embedded in the current URL path, or 'en'. */
    function getCurrentLang() {
        var parts = window.location.pathname.split('/').filter(Boolean);
        for (var i = 0; i < parts.length; i++) {
            if (LANGS.indexOf(parts[i]) !== -1) {
                return parts[i];
            }
        }
        return 'en';
    }

    /** Return the HTML filename of the current page (e.g. 'about.html'). */
    function getPageName() {
        var last = window.location.pathname.split('/').pop();
        return (last && last.indexOf('.html') !== -1) ? last : 'index.html';
    }

    /**
     * Return the portion of the path that precedes any language prefix or
     * page file – this is the site root on the server (e.g. '/Holy-Hour-Website-/').
     */
    function getSiteRoot() {
        var parts = window.location.pathname.split('/').filter(Boolean);
        var rootParts = [];
        for (var i = 0; i < parts.length; i++) {
            if (LANGS.indexOf(parts[i]) !== -1 || parts[i].indexOf('.html') !== -1) {
                break;
            }
            rootParts.push(parts[i]);
        }
        return '/' + (rootParts.length ? rootParts.join('/') + '/' : '');
    }

    /** Build an absolute path for the given language and page. */
    function buildUrl(lang, page) {
        var root = getSiteRoot();
        return lang === 'en' ? root + page : root + lang + '/' + page;
    }

    /** Derive the language a switcher link points to from its text or href. */
    function getLangFromLink(link) {
        // Primary: use the visible label (EN, ES, DE …)
        var text = link.textContent.trim().toLowerCase();
        if (LANGS.indexOf(text) !== -1) {
            return text;
        }
        // Fallback: inspect the href for a known language segment
        var href = link.getAttribute('href') || '';
        for (var i = 0; i < LANGS.length; i++) {
            if (LANGS[i] === 'en') { continue; }
            if (new RegExp('(?:^|/)' + LANGS[i] + '/').test(href)) {
                return LANGS[i];
            }
        }
        // A link that goes up to the root (../page.html) from a subdirectory
        // or a bare page.html from the root both resolve to English.
        return 'en';
    }

    // ── Main logic ──────────────────────────────────────────────────────────

    var currentLang = getCurrentLang();
    var savedLang   = localStorage.getItem(STORAGE_KEY);

    if (currentLang !== 'en') {
        // The URL contains an explicit language prefix – honour it and save.
        localStorage.setItem(STORAGE_KEY, currentLang);

    } else if (savedLang && savedLang !== 'en' && LANGS.indexOf(savedLang) !== -1) {
        // User is on an English page but has a non-English preference.
        // Redirect to the equivalent page in the preferred language.
        var page      = getPageName();
        var targetUrl = buildUrl(savedLang, page);
        var currentUrl = window.location.pathname;

        // Guard: never redirect to the same path (avoids any edge-case loops).
        if (targetUrl !== currentUrl) {
            if (typeof fetch !== 'undefined') {
                // Verify the target exists before redirecting (graceful fallback).
                fetch(targetUrl, { method: 'HEAD' })
                    .then(function (resp) {
                        if (resp.ok) {
                            window.location.replace(targetUrl);
                        }
                        // If not found: stay on the current page silently.
                    })
                    .catch(function () {
                        // Network error or CORS – stay on current page.
                    });
            } else {
                // Older browsers without fetch – redirect directly.
                window.location.replace(targetUrl);
            }
        }
    }

    // ── Language-switcher click handlers ────────────────────────────────────

    document.addEventListener('DOMContentLoaded', function () {
        var switcher = document.querySelector('.language-switcher');
        if (!switcher) { return; }

        var links = switcher.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                var lang = getLangFromLink(this);
                if (lang) {
                    localStorage.setItem(STORAGE_KEY, lang);
                }
            });
        }
    });

}());
