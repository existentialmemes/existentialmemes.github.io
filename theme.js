/* ============================================================
   theme.js — глобальная тема для сайта
   Подключать на КАЖДОЙ странице в <head>:
   <script src="/theme.js"></script>
   ============================================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var html = document.documentElement;

    /* ---------- 1. Определяем тему ДО отрисовки ---------- */
    function getInitialTheme() {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

        if (saved === 'dark' || saved === 'light') return saved;

        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
    }

    applyTheme(getInitialTheme());

    /* ---------- 2. Реакция на смену системной темы ---------- */
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function (e) {
            var saved = null;
            try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
            if (saved === 'dark' || saved === 'light') return;
            applyTheme(e.matches ? 'dark' : 'light');
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    /* ---------- 3. Кнопка-переключатель ---------- */
    function bindToggle() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';

            html.classList.add('theme-transition');
            setTimeout(function () {
                html.classList.remove('theme-transition');
            }, 400);

            applyTheme(next);
            try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindToggle);
    } else {
        bindToggle();
    }
})();