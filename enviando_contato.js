const puppeteer = require('puppeteer');

(async function main() {
    try{

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

        await page.goto('https://web.whatsapp.com/');


        await page.waitForSelector('.to2l77zo', { timeout: 30000 });
        await delay(5000);
        
        const contactName = "Amor💕";
        await page.click(`span[title='${contactName}']`);
        await page.waitForSelector("._11JPr");
        
        const editor = await page.$('div[title="Digite uma mensagem"][contenteditable="true"]');
        await editor.focus();
        
        const amountOfMessages = 5;
        
        for (let i = 0; i < amountOfMessages; i++) {
            await page.evaluate(() => {
                const message = "teste disparador - Oi amor Te amo";
                document.execCommand('insertText', false, message);
            });

            const sendButtonSelector = 'button[aria-label="Enviar"]';
            await page.click(sendButtonSelector);
            await delay(500);
        }




    } catch (e) {
        console.error("error mine", e);
    }
})();

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}