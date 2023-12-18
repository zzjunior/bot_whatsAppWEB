# Disparador de mensagens no WhatsApp - Puppeteer | Node.js

O código automatiza o envio de mensagens [somente para contatos salvos](  "Sem contatos salvos ele não vai achar os números!") no WhatsApp usado, é preciso ter o Puppeteer e Node.js já pré instalados na sua máquina, o `Puppeteer` é uma ferramenta de automação de navegador.

### Trechos mais importantes do Código!

**Configuração e abertura do WhatsApp Web**

- Usando o Puppeteer abre o navegador, acessa a página do WhatsApp Web.
- Após ler o QRcode os comandos de disparo já iniciam.
- Até o momento existem dois arquivos que realizam dois tipos de disparos, os arquivos `enviando_contato.js` e `enviando_planilha.js`.

### `enviando_contato.js`

1. ###### Busca por contatos


   - Aqui é realizada uma busca no WhatsApp pelos números descritos no arquivo, que pode ser modificados aqui:

   ```javascript
           const contactName = "Amor💕";
           await page.click(`span[title='${contactName}']`);
           await page.waitForSelector("._11JPr");
   ```

   - É possível também alterar a quantidade e estilo da mensagem ao seu desejo, usando o `awaitpage.evaluate` que aqui fica dentro de um `for` para que o envio da mesma mensagem se repita uma determinada quantidade de vezes no `amountOfMessages`:

```node.js
constamountOfMessages=5;        for (leti=0; i
```


### `enviando_planilha.js`

1. **Leitura da Planilha**

   - Utiliza a biblioteca `xlsx` para ler uma planilhas de contatos que você desejar disparar, desde que eles estejam salvos no seu WhatsApp. Você pode importar a biblioteca desta forma:
     `const xlsx = require('xlsx');`
   - E desta forma você consegui ler os contatos de uma planilha e programar o disparador para enviar mensagens em sequencia para os contatos descritos nela:

   ```javascript
           // ler planilha        constworkbook=xlsx.readFile('teste.xlsx');        constworksheet=workbook.Sheets[workbook.SheetNames[0]];        constcontacts=xlsx.utils.sheet_to_json(worksheet, { header: ['name', 'number'] });    // nome na coluna A e número na coluna B
   ```
2. ###### Preparação e envio das mensagens

   Após isso subir planilha e atualizar o local dela no `constworkbook` o bot pode ser iniciado, ele seguirá a sequencia do outro arquivo, mas vai seguir estas etapas buscando os contatos da planilha:


   ```javascript
   // Aguarda o campo de busca de contatos        awaitpage.waitForSelector('.to2l77zo[data-tab="3"]', { timeout: 30000 }); // Exemplo de seletor para o campo de busca de contatos        // checa cada contato na lista coletando o dado        for (constcontactofcontacts) {            constcontactNumber=contact.number;            // número na coluna B da planilha            // Busca o contato pelo número na barra de busca do WhatsApp usando os dados da coluna B            constsearchSelector='.to2l77zo[data-tab="3"';            awaitpage.waitForSelector(searchSelector);            awaitpage.type(searchSelector, contactNumber); // Digita o número na barra de busca            awaitpage.keyboard.press('Enter'); // Pressiona Enter para iniciar a busca            try {                // Aguarda o contato aparecer na lista de resultados                constcontactSelector=span[title='${contact.name||contact.number}']._11JPr;                awaitpage.waitForSelector(contactSelector, { timeout: 5000 }); // Aumentei para 5 segundos                // Clica no contato encontrado                awaitpage.click(contactSelector);                awaitpage.waitForSelector("._199zF");                constmessageBoxSelector='div[title="Digite uma mensagem"][contenteditable="true"]';                consteditor=awaitpage.$(messageBoxSelector);                awaiteditor.focus();                constamountOfMessages=5;                constdelayBetweenMessages=3000;                // tempo entre as mensagens em milissegundos                for (leti=0; i
   ```

   - Procura o contato pelo número, inserindo o número de telefone na barra de pesquisa.
   - Ao encontrar, clica no contato para abrir a janela de chat.
   - Digita uma mensagem predefinida no campo de mensagem.
   - Clica no botão de enviar.
   - Espera um tempo entre as mensagens (3 segundos).

## Observações

- **`Puppeteer`**: Vai simula interações humanas de navegação usando chromium.
- **`xlsx`**: Biblioteca para leitura e escrita de arquivos Excel no `Node.js`.
- **Existem Alertas?** Sim, são exibidos no terminal mensagens informativas após cada envio de mensagem.
