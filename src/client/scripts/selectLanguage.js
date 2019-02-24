const selectLanguageContainer       = document.getElementById( "select-language-container" );
const selectLanguage                = document.getElementById( "select-language" );
const translateButton               = document.getElementById( "translate-button" );
const selectLanguageNotification    = document.getElementById( "select-language-notification" );
const selectLanguageNotifText       = document.getElementById( "select-language-notification-text" );
const uploadedFileTitle             = document.getElementById( "uploaded-file-title" );
const selectLanguageBackBtn         = document.getElementById( "select-language-back-btn" );


translateButton.addEventListener( "click", () => {
    const language = selectLanguage.options[ selectLanguage.selectedIndex ].value;

    if ( ! language ) {

        selectLanguageNotification.classList.add( "error" );

        selectLanguageNotifText.innerText = "No language selected.";

        return console.error( "No language selected." )
    }

    ipcRenderer.send( "file:translate", language );

    selectLanguageContainer.style.display   = "none";
    loadingContainer.style.display          = "block";
});


selectLanguage.addEventListener( "focus", () => {
    selectLanguageNotification.classList.remove( "error" );

    selectLanguageNotifText.innerText = "Valid JSON file provided";
});


selectLanguageBackBtn.addEventListener( "click", () => {
    selectLanguageContainer.style.display   = "none";
    uploadFileContainer.style.display       = "block";
});


/** Electron listeners */

ipcRenderer.on( "file:title", (event, fileTitle) => {
    uploadedFileTitle.innerText = fileTitle;
});