/* ==========================================
   PEPPY FASHION
   PWA INSTALL
========================================== */

let deferredPrompt = null;


/* ==========================================
   INSTALL PROMPT AVAILABLE
========================================== */

window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        event.preventDefault();

        deferredPrompt = event;

        const installButton =
            document.getElementById("installApp");

        if (installButton) {

            installButton.style.display = "";

        }

        console.log(
            "Peppy Fashion: Install available"
        );

    }
);


/* ==========================================
   INSTALL APP
========================================== */

async function installPeppyApp() {

    if (!deferredPrompt) {

        console.log(
            "Peppy Fashion: Install prompt not available"
        );

        return;

    }


    deferredPrompt.prompt();


    try {

        const result =
            await deferredPrompt.userChoice;

        console.log(
            "PWA install choice:",
            result.outcome
        );

    }

    catch (error) {

        console.error(
            "PWA install error:",
            error
        );

    }


    deferredPrompt = null;


    const installButton =
        document.getElementById("installApp");

    if (installButton) {

        installButton.style.display = "none";

    }

}


/* ==========================================
   MENU INSTALL BUTTON
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const installButton =
            document.getElementById("installApp");


        if (!installButton) {

            return;

        }


        installButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                installPeppyApp();

            }
        );

    }
);


/* ==========================================
   APP INSTALLED
========================================== */

window.addEventListener(
    "appinstalled",
    function () {

        deferredPrompt = null;


        const installButton =
            document.getElementById("installApp");


        if (installButton) {

            installButton.style.display = "none";

        }


        console.log(
            "Peppy Fashion App Installed"
        );

    }
);