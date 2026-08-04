let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();

  deferredPrompt = e;

  console.log("PWA Install Available");
const btn = document.getElementById("installBtn");

if (btn) {

  btn.style.display = "inline-block";

}

});
window.addEventListener("appinstalled", () => {

  const btn = document.getElementById("installBtn");

  if (btn) {

    btn.style.display = "none";

  }

  console.log("Peppy Fashion App Installed");

});

window.installPeppyApp = async function () {

  if (!deferredPrompt) {

    alert("Install option is not available yet.");

    return;

  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;
const btn = document.getElementById("installBtn");

if (btn) {

  btn.style.display = "none";

}
  deferredPrompt = null;

};