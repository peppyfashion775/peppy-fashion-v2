/* ==========================================
   PEPPY FASHION
   PWA INSTALL SYSTEM V2
========================================== */

(function () {

    "use strict";


    /* ==========================================
       VARIABLES
    ========================================== */

    let deferredInstallPrompt = null;

    const INSTALL_BUTTON_ID =
        "peppyInstallAppBtn";


    /* ==========================================
       CREATE INSTALL BUTTON
    ========================================== */

    function createInstallButton() {

        /*
           Do not create another button
           if one already exists.
        */

        if (
            document.getElementById(
                INSTALL_BUTTON_ID
            )
        ) {
            return;
        }


        const button =
            document.createElement("button");

        button.id =
            INSTALL_BUTTON_ID;

        button.type =
            "button";

        button.className =
            "install-btn";

        button.innerHTML =
            "📲 Install Peppy App";


        button.setAttribute(
            "aria-label",
            "Install Peppy Fashion App"
        );


        /*
           Initially hidden.
           It will appear when the browser
           confirms installation is available.
        */

        button.style.display =
            "none";


        button.addEventListener(
            "click",
            installApp
        );


        /*
           Put the button in the header
           if possible.
        */

        const navbar =
            document.querySelector(
                ".navbar"
            );


        if (navbar) {

            navbar.appendChild(
                button
            );

            return;

        }


        /*
           Fallback:
           put it at the top of the body.
        */

        if (document.body) {

            document.body.prepend(
                button
            );

        }

    }


    /* ==========================================
       SHOW INSTALL BUTTON
    ========================================== */

    function showInstallButton() {

        const button =
            document.getElementById(
                INSTALL_BUTTON_ID
            );


        if (!button) return;


        /*
           If the app is already installed,
           don't show the button.
        */

        if (isAppInstalled()) {

            button.style.display =
                "none";

            return;

        }


        button.style.display =
            "inline-flex";

    }


    /* ==========================================
       HIDE INSTALL BUTTON
    ========================================== */

    function hideInstallButton() {

        const button =
            document.getElementById(
                INSTALL_BUTTON_ID
            );


        if (!button) return;


        button.style.display =
            "none";

    }


    /* ==========================================
       INSTALL APP
    ========================================== */

    async function installApp() {

        /*
           Browser does not currently provide
           an installation prompt.
        */

        if (!deferredInstallPrompt) {

            showInstallInstructions();

            return;

        }


        try {

            /*
               Show native installation prompt.
            */

            await deferredInstallPrompt.prompt();


            /*
               Wait for user's choice.
            */

            const result =
                await deferredInstallPrompt.userChoice;


            if (
                result &&
                result.outcome === "accepted"
            ) {

                console.log(
                    "Peppy Fashion app installation accepted."
                );

            } else {

                console.log(
                    "Peppy Fashion app installation dismissed."
                );

            }

        }

        catch (error) {

            console.error(
                "PWA installation error:",
                error
            );

        }


        /*
           Prompt can only be used once.
        */

        deferredInstallPrompt =
            null;


        hideInstallButton();

    }


    /* ==========================================
       INSTALL INSTRUCTIONS
    ========================================== */

    function showInstallInstructions() {

        /*
           iPhone / iPad
        */

        if (
            /iPhone|iPad|iPod/i.test(
                navigator.userAgent
            )
        ) {

            alert(
                "To install Peppy Fashion on iPhone/iPad:\n\n" +
                "1. Tap the Share button in Safari.\n" +
                "2. Select 'Add to Home Screen'.\n" +
                "3. Tap 'Add'."
            );

            return;

        }


        /*
           Android / other browsers
        */

        alert(
            "Peppy Fashion cannot show the installation " +
            "prompt right now.\n\n" +
            "If your browser supports installation, " +
            "open the browser menu and select " +
            "'Install app' or 'Add to Home screen'."
        );

    }


    /* ==========================================
       CHECK IF APP IS ALREADY INSTALLED
    ========================================== */

    function isAppInstalled() {

        /*
           Standalone mode
           Android / Chrome / Edge etc.
        */

        const standalone =
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches;


        /*
           iOS standalone mode
        */

        const iosStandalone =
            window.navigator &&
            window.navigator.standalone === true;


        return (
            standalone ||
            iosStandalone
        );

    }


    /* ==========================================
       BEFORE INSTALL PROMPT
    ========================================== */

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            console.log(
                "Peppy Fashion installation available."
            );


            /*
               Stop browser from automatically
               showing its own prompt.
            */

            event.preventDefault();


            /*
               Save the event so our button
               can trigger it later.
            */

            deferredInstallPrompt =
                event;


            showInstallButton();

        }
    );


    /* ==========================================
       APP INSTALLED
    ========================================== */

    window.addEventListener(
        "appinstalled",
        function () {

            console.log(
                "Peppy Fashion installed successfully."
            );


            deferredInstallPrompt =
                null;


            hideInstallButton();

        }
    );


    /* ==========================================
       SERVICE WORKER
    ========================================== */

    function registerServiceWorker() {

        if (
            !("serviceWorker" in navigator)
        ) {

            console.warn(
                "Service Worker is not supported."
            );

            return;

        }


        /*
           Register from the project root.

           This matches:
           /peppy-fashion-v2/sw.js
        */

        navigator.serviceWorker
            .register(
                "sw.js",
                {
                    scope:
                        "./"
                }
            )

            .then(
                function (registration) {

                    console.log(
                        "Peppy Fashion Service Worker registered:",
                        registration.scope
                    );

                }
            )

            .catch(
                function (error) {

                    console.error(
                        "Service Worker registration failed:",
                        error
                    );

                }
            );

    }


    /* ==========================================
       START PWA SYSTEM
    ========================================== */

    function initializePWA() {

        createInstallButton();


        /*
           If already installed,
           keep button hidden.
        */

        if (isAppInstalled()) {

            hideInstallButton();

        }


        /*
           Register service worker.
        */

        registerServiceWorker();

    }


    /* ==========================================
       DOM READY
    ========================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePWA
        );

    } else {

        initializePWA();

    }


    /* ==========================================
       GLOBAL INSTALL FUNCTION
    ========================================== */

    window.installPeppyApp =
        installApp;


})();