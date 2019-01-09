
const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver');

const fs = require( "fs" );




const translate = async(string, language) => {

    const capabilities = Capabilities.chrome();

    capabilities.set( 'chromeOptions',{

        'args': ['--headless', '--no-sandbox', 'window-size=1024,768' , '--disable-gpu', "--remote-debugging-port=4300"]

    });


    let driver = await new Builder().forBrowser( 'chrome' ).withCapabilities( capabilities ).build();

    await driver.get('https://translate.google.com/?hl=en&tab=TT');

    await driver.wait( until.titleIs( 'Google Translate' ), 2000 );

    await driver.wait( until.elementLocated( By.id( 'source' ) ), 2000 );

    const element = await driver.findElement( By.id( "source" ) );

    await element.sendKeys( string, Key.RETURN );

    await driver.wait( until.elementLocated( By.className( "tl-more" ) ), 2000 );

    const openLanguagesBtn = await driver.findElement( By.className( "tl-more" ) );

    await openLanguagesBtn.click();

    await driver.wait( until.elementLocated( By.xpath( `//div[contains(@class, "language-list-unfiltered-langs-tl_list")]//div[contains(@class, "language_list_item_wrapper-${ language }")]` ) ), 3000 );

    const hungarianLangBtn = await driver.findElement( By.xpath( `//div[contains(@class, "language-list-unfiltered-langs-tl_list")]//div[contains(@class, "language_list_item_wrapper-${ language }")]` ) );

    await hungarianLangBtn.click();

    await driver.wait( until.elementLocated( By.className( "translation" ) ), 2000 );

    const res = await driver.findElement( By.className( "translation" ) );

    const text = await res.getText();

    console.log( text );

    await driver.quit();

    return text;

};




function getStringToTranslate() {

    const stringsObj = JSON.parse( fs.readFileSync( "strings.json", "utf8" ) );
    let strings = [];


    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            strings.push( '"' + stringsObj[ key ] + '"' );
        }
    }

    return strings.join( ", " );

}



const string = getStringToTranslate();
const language = "ro";


translate( string, language ).then( res => {

    const stringsObj = JSON.parse( fs.readFileSync( "strings.json", "utf8" ) );


    const translatedStrings = res.replace( /['"]+/g, '' ).split( ',' );

    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            stringsObj[ key ] = translatedStrings[ Object.keys( stringsObj ).indexOf( key ) ];
        }
    }

    fs.writeFileSync( 'translatedStrings.json', JSON.stringify( stringsObj, null, 4 ) );

    console.log( stringsObj );

});




