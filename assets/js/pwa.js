/* ==========================================
   PEPPY FASHION PWA
   APP INSTALL SYSTEM
========================================== */

let deferredInstallPrompt = null;


/* ==========================================
   CAPTURE INSTALL PROMPT
========================================== */

window.addEventListener("beforeinstallprompt", function (event) {

    // Prevent Chrome from showing its automatic prompt
    event.preventDefault();

    deferredInstallPrompt = event;

    console.log("Peppy Fashion install prompt available");

    showInstallButton();

});


/* ==========================================
   SHOW INSTALL BUTTON
========================================== */

function showInstallButton() {

    const installButton =
        document.getElementById("installAppBtn");

    const installSection =
        document.getElementById("appInstallSection");


    if (installButton) {

        installButton.style.display = "inline-flex";

    }


    if (installSection) {

        installSection.style.display = "block";

    }

}


/* ==========================================
   INSTALL APP
========================================== */

async function installPeppyApp() {

    if (!deferredInstallPrompt) {

        showInstallMessage(
            "Your browser does not currently offer app installation."
        );

        return;

    }


    try {

        deferredInstallPrompt.prompt();


        const result =
            await deferredInstallPrompt.userChoice;


        if (result.outcome === "accepted") {

            console.log(
                "Peppy Fashion app installation accepted."
            );

            showInstallMessage(
                "Peppy Fashion is being installed..."
            );

        } else {

            console.log(
                "Peppy Fashion app installation dismissed."
            );

        }


        deferredInstallPrompt = null;

    }

    catch (error) {

        console.error(
            "App installation error:",
            error
        );

        showInstallMessage(
            "Unable to start installation. Please try again."
        );

    }

}


/* ==========================================
   INSTALL MESSAGE
========================================== */

function showInstallMessage(message) {

    const messageElement =
        document.getElementById("installAppMessage");


    if (!messageElement) return;


    messageElement.textContent = message;

    messageElement.style.display = "block";

}


/* ==========================================
   APP INSTALLED
========================================== */

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "Peppy Fashion app installed successfully."
        );


        deferredInstallPrompt = null;


        const installButton =
            document.getElementById("installAppBtn");


        if (installButton) {

            installButton.style.display = "none";

        }


        showInstallMessage(
            "Peppy Fashion has been installed successfully!"
        );

    }
);


/* ==========================================
   CHECK IF ALREADY RUNNING AS APP
========================================== */

function isPeppyAppInstalled() {

    return (
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches
        ||
        window.navigator.standalone === true
    );

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const installButton =
            document.getElementById("installAppBtn");


        if (installButton) {

            installButton.addEventListener(
                "click",
                installPeppyApp
            );

        }


        /*
        If the website is already running
        as an installed app, hide the
        installation section.
        */

        if (isPeppyAppInstalled()) {

            const installSection =
                document.getElementById(
                    "appInstallSection"
                );


            if (installSection) {

                installSection.style.display = "none";

            }

        }

    }
);