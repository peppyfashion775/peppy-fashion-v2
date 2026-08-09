/* =========================================================
   PEPPY FASHION - PWA INSTALL SYSTEM
   ========================================================= */

let deferredPrompt = null;
let installBtn = null;


/* =========================================================
   CHECK IF APP IS ALREADY INSTALLED
   ========================================================= */

function isAppInstalled() {

    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
    );

}


/* =========================================================
   CREATE INSTALL BUTTON
   ========================================================= */

function createInstallButton() {

    if (installBtn) {
        return;
    }

    installBtn = document.createElement("button");

    installBtn.id = "installBtn";
    installBtn.className = "install-btn";

    installBtn.innerHTML = "📲 Install Peppy App";

    installBtn.style.display = "none";

    installBtn.addEventListener("click", installPeppyApp);

    document.body.appendChild(installBtn);

}


/* =========================================================
   SHOW INSTALL BUTTON
   ========================================================= */

function showInstallButton() {

    if (!installBtn) {
        createInstallButton();
    }

    if (isAppInstalled()) {
        hideInstallButton();
        return;
    }

    installBtn.style.display = "block";

}


/* =========================================================
   HIDE INSTALL BUTTON
   ========================================================= */

function hideInstallButton() {

    if (installBtn) {
        installBtn.style.display = "none";
    }

}


/* =========================================================
   INSTALL APP
   ========================================================= */

async function installPeppyApp() {

    if (!deferredPrompt) {

        alert(
            "To install Peppy Fashion:\n\n" +
            "Android Chrome:\n" +
            "Tap ⋮ Menu → Install app\n\n" +
            "If 'Install app' is not available, choose 'Add to Home screen'."
        );

        return;

    }

    deferredPrompt.prompt();

    try {

        const result = await deferredPrompt.userChoice;

        console.log(
            "Peppy Fashion Install Result:",
            result.outcome
        );

    } catch (error) {

        console.log(
            "Install prompt error:",
            error
        );

    }

    deferredPrompt = null;

    hideInstallButton();

}


/* =========================================================
   BEFORE INSTALL PROMPT
   ========================================================= */

window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        console.log(
            "Peppy Fashion PWA installation is available."
        );

        event.preventDefault();

        deferredPrompt = event;

        showInstallButton();

    }
);


/* =========================================================
   APP INSTALLED
   ========================================================= */

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "Peppy Fashion has been installed."
        );

        deferredPrompt = null;

        hideInstallButton();

    }
);


/* =========================================================
   DISPLAY MODE CHANGE
   ========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        createInstallButton();

        if (isAppInstalled()) {
            hideInstallButton();
        }

    }
);


/* =========================================================
   SERVICE WORKER REGISTRATION
   ========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register("sw.js")
                .then(function (registration) {

                    console.log(
                        "Peppy Fashion Service Worker registered:",
                        registration.scope
                    );

                })
                .catch(function (error) {

                    console.log(
                        "Service Worker registration failed:",
                        error
                    );

                });

        }
    );

}


/* =========================================================
   GLOBAL INSTALL FUNCTION
   ========================================================= */

window.installPeppyApp = installPeppyApp;