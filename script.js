/* =========================================================
   4LF4 — GLOBAL WEBSITE JAVASCRIPT
   Shared by every page
   ========================================================= */

(() => {
    "use strict";

    const THEME_KEY = "4lf4-theme";
    const body = document.body;

    if (!body) return;

    const themeToggle = document.getElementById("themeToggle");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    /* =====================================================
       THEME
       ===================================================== */

    function systemTheme() {
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
    }

    function savedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        return saved === "light" || saved === "dark"
            ? saved
            : systemTheme();
    }

    function applyTheme(theme) {
        body.dataset.theme = theme;

        if (themeToggle) {
            const light = theme === "light";

            themeToggle.textContent = light ? "☾" : "☼";
            themeToggle.setAttribute(
                "aria-label",
                light ? "Switch to dark mode" : "Switch to light mode"
            );
            themeToggle.title = light
                ? "Switch to dark mode"
                : "Switch to light mode";
        }

        if (themeColor) {
            themeColor.content = theme === "light"
                ? "#f5f7fb"
                : "#07090d";
        }
    }

    applyTheme(savedTheme());

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = body.dataset.theme === "dark"
                ? "light"
                : "dark";

            localStorage.setItem(THEME_KEY, nextTheme);
            applyTheme(nextTheme);
        });
    }

    /* Follow OS changes only until the visitor chooses manually. */
    if (window.matchMedia) {
        const media = window.matchMedia("(prefers-color-scheme: light)");
        const handleSystemChange = event => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(event.matches ? "light" : "dark");
            }
        };

        if (media.addEventListener) {
            media.addEventListener("change", handleSystemChange);
        } else if (media.addListener) {
            media.addListener(handleSystemChange);
        }
    }

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const open = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute(
                "aria-label",
                open ? "Close navigation" : "Open navigation"
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            });
        });

        document.addEventListener("click", event => {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            }
        });
    }

    /* =====================================================
       ACTIVE PAGE
       ===================================================== */

    const currentPage = body.dataset.page;

    if (currentPage && navLinks) {
        navLinks.querySelectorAll("a[data-page]").forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === currentPage
            );
        });
    }

    /* =====================================================
       REVEAL ANIMATIONS
       ===================================================== */

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("visible"));
    }

    /* =====================================================
       FOOTER YEAR
       ===================================================== */

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
})();
