let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    console.log("PWA Install Available");

    if (installBtn) {
        installBtn.style.display = "inline-block";
    }

});

window.installPeppyApp = async function () {

    if (!deferredPrompt) {

        alert(
            "If the install window does not appear, tap Chrome Menu (⋮) and choose 'Install app' or 'Add to Home screen'."
        );

        return;

    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log("Install Result:", outcome);

    deferredPrompt = null;

    if (installBtn) {
        installBtn.style.display = "none";
    }

};

window.addEventListener("appinstalled", () => {

    console.log("Peppy Fashion Installed");

    if (installBtn) {
        installBtn.style.display = "none";
    }

});