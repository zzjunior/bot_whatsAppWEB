const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

(async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

        await page.goto('https://web.whatsapp.com/');

        // login no zap

        // ler planilha
        const workbook = xlsx.readFile('teste.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const contacts = xlsx.utils.sheet_to_json(worksheet, { header: ['name', 'number'] }); 
        // nome na coluna A e número na coluna B

        // Aguarda o campo de busca de contatos
        await page.waitForSelector('.to2l77zo[data-tab="3"]', { timeout: 30000 }); // Exemplo de seletor para o campo de busca de contatos

        // checa cada contato na lista coletando o dado
        for (const contact of contacts) {
            const contactNumber = contact.number; 
            // número na coluna B da planilha

            // Busca o contato pelo número na barra de busca do WhatsApp usando os dados da coluna B
            const searchSelector = '.to2l77zo[data-tab="3"';
            await page.waitForSelector(searchSelector);
            await page.type(searchSelector, contactNumber); // Digita o número na barra de busca
            await page.keyboard.press('Enter'); // Pressiona Enter para iniciar a busca

            try {
                // Aguarda o contato aparecer na lista de resultados
                const contactSelector = `span[title='${contact.name || contact.number}']._11JPr`;
                await page.waitForSelector(contactSelector, { timeout: 5000 }); // Aumentei para 5 segundos

                // Clica no contato encontrado
                await page.click(contactSelector);
                await page.waitForSelector("._199zF");

                const messageBoxSelector = 'div[title="Digite uma mensagem"][contenteditable="true"]';
                const editor = await page.$(messageBoxSelector);
                await editor.focus();

                const amountOfMessages = 5;
                const delayBetweenMessages = 3000; 
                // tempo entre as mensagens em milissegundos

                for (let i = 0; i < amountOfMessages; i++) {
                    await page.evaluate(() => {
                        const message = "teste";
                        document.execCommand('insertText', false, message);
                    });

                    const sendButtonSelector = 'button[aria-label="Enviar"]';
                    await page.click(sendButtonSelector);
                    await delay(delayBetweenMessages); 
                    // Espera o tempo entre as mensagens
                    console.log(`Mensagem ${i + 1} enviada para ${contactNumber}`);
                }
            } catch (err) {
                console.error(`Contato não encontrado para ${contactNumber}. Pulando para o próximo.`);
            }
            
            // Limpa o campo de busca para o próximo número
            await page.click(searchSelector, { clickCount: 3 });
            await page.keyboard.press('Backspace');
        }

        await browser.close();
    } catch (e) {
        console.error("error mine", e);
    }
})();

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}


