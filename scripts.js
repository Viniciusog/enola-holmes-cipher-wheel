var inputIndexE = document.getElementById("ie-index");
inputIndexE.oninput = onInputIndex;
var inputKeywordE = document.getElementById("ie-keyword");
inputKeywordE.oninput = onInputKeyword;
var inputMessageE = document.getElementById("ie-message");
var inputResultE = document.getElementById("ie-result");
var buttonEncodeE = document.getElementById("button-e");

var inputIndexD = document.getElementById("id-index");
var inputKeywordD = document.getElementById("id-keyword");
var inputMessageD = document.getElementById("id-message");
var inputResultD = document.getElementById("id-result");
var buttonEncodeD = document.getElementById("button-d");

// Array das letras normais
var outerWheel = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'
,'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'];
let c = 'C';

// Array das letras codificadas
var innerWheel = [];    

// Gera a "roda" interna (Array interno)
for (let i = 0; i < outerWheel.length; i++) {
    var obj = {"letter": 'ç', "pos": 25}
    obj.letter = outerWheel[i];
    obj.pos = i;
    innerWheel[i] = obj;
}

let encodedMessage = [];

/**
 * CODIFICAÇÃO DA MENSAGEM
 */
function onEncode() {
    var message = inputMessageE.value.toUpperCase();
    let index = inputIndexE.value.toUpperCase();
    let keyword = inputKeywordE.value.toUpperCase();

    let valid = 1;
    verification(index, keyword, message, valid);
    if (!valid) {
        return;
    }

    let arrayMessage = [];
    let arrayKeyword = [];

    generateArrayMessageAndKeyword(message, keyword, arrayMessage, arrayKeyword);

    let ascii1 = index.charCodeAt(0);
    // Agora vamos ter que realizar a conversão utilizando o index e a keyword
    for (let i = 0; i < arrayKeyword.length; i++) {
        /* Realiza a rotação da "roda" interna */
        rotation(index, arrayKeyword[i]);
        console.log("inner wheel\n");
        for (let k = 0; k < innerWheel.length; k++) {
            console.log(innerWheel[k]);
        }

        /* Realiza a conversão da mensagem para os caracteres codificados */
        // queremos saber em qual posição do array está esse char da mensagem
        // Para isso, vamos pegar o valor ascii do primeiro char (posição 0) e também o valor ascii do char da mensagem
        // Assim, saberemos a diferença de posições entre o primeiro elemento do array e o char que estamos procurando.
        let asciiCharMsg = arrayMessage[i].charCodeAt(0);
        let asciiOuter0 = outerWheel[0].charCodeAt(0);
        let diffAscii = asciiCharMsg - asciiOuter0;

        let position = diffAscii;
        if (diffAscii < 0) {
            position = 25 + (diffAscii + 1);
        }
        let codedChar = innerWheel[position].letter;
        encodedMessage[i] = codedChar; 
    }

    // Precisamos do indexEncodedMessage pois o resultado dentro do vetor encodedMessage está sem espaços
    // e queremos mostrar para o usuário a mensagem codificada com os espaços.
    let stringEncoded = "";
    let indexEncodedMessage = 0;
    for (let i = 0; i < message.length; i++) {
        if (message.charAt(i) != ' ') {
            stringEncoded += encodedMessage[indexEncodedMessage];
            indexEncodedMessage++;
        } else {    
            stringEncoded += ' ';
        }
    }
    console.log("String encoded: " + stringEncoded);

    inputResultE.value = stringEncoded.toLowerCase();
}

/**
 * DECODIFICAÇÃO DA MENSAGEM
 */
function onDecode() {
    let message = inputMessageD.value.toUpperCase();
    let keyword = inputKeywordD.value.toUpperCase();
    let index = inputIndexD.value.toUpperCase();

    let valid = 1;
    verification(index, keyword, message, valid);
    if (!valid) {
        return;
    }

    let arrayKeyword = [];
    let arrayMessage = [];

    generateArrayMessageAndKeyword(message, keyword, arrayMessage, arrayKeyword);

    let decodedMessage = [];
    for (let i = 0; i < arrayMessage.length; i++) {
        // Temos que realizar a rotação para o index e também o char respectivo da keyword
        rotation(index, arrayKeyword[i]);

        // Toda vez que realizar a rotação, precisamos saber qual letra está na posição 0 do array interno
        // pois com isso iremos conseguir encontrar a posição da letra codificada, dentro do array interno.
        // Sabendo a posição da letra codificada no array interno, basta pegar a letra na mesma posição 
        // no array externo
        let charPosition0 = innerWheel[0].letter;
        let ascii1 = innerWheel[0].letter.charCodeAt(0);
        let ascii2 = arrayMessage[i].charCodeAt(0);

        let diff = ascii2 - ascii1;
        let position = diff;
        if (diff < 0) {
            position = 25 + (diff + 1);
        }
        let decodedChar = outerWheel[position];
        decodedMessage[i] = decodedChar;
    }

    console.log("Decoded message: ", decodedMessage);

    let indexDecodedMsg = 0;
    let decodedStringMsg = "";

    for (let i = 0; i < message.length; i++) {
        if (message.charAt(i) != ' ') {
            decodedStringMsg += decodedMessage[indexDecodedMsg];
            indexDecodedMsg++;
        } else {
            decodedStringMsg += " ";
        }
    }
    inputResultD.value = decodedStringMsg;
}

/**
 * A partir de uma mensagem normal e uma keyword, gera o array da mensagem e também o array de keyword
 */
function generateArrayMessageAndKeyword(message, keyword, arrayMessage, arrayKeyword) {
    let currentIndexArrays = 0;
    let indexKeyword = 0;

    // Dada a nossa mensagem, vamos repetir a keyword para ocupar todo o espaço da mensagem
    for (let i = 0; i < message.length; i++) {
        let charMessage = message.charAt(i);
        if (charMessage != ' ') {
            arrayMessage[currentIndexArrays] = charMessage;
            arrayKeyword[currentIndexArrays] = keyword.charAt(indexKeyword);
            indexKeyword++;
            currentIndexArrays++;
            if (indexKeyword >= keyword.length) {
                indexKeyword = 0;
            }
        }
    }
}

/**
 * Realiza a rotação da "roda" interna (Vetor interno)
 */
function rotation(char1, char2) {
    let ascii1 = char1.charCodeAt(0);
    let ascii2 = char2.charCodeAt(0);
    let diff = ascii1 - ascii2;
    console.log("Diff: " + diff);

    for (let i = 0; i < outerWheel.length; i++) {
        var obj = {"letter": 'A', pos: '25'};
        obj.letter = outerWheel[i];
        obj.pos = i;

        let nextPos = (i + diff);
        if (nextPos > 25) {
            nextPos = (nextPos % 25) - 1;
        } else if (nextPos < 0) {
            nextPos = 25 + (nextPos + 1);
        }
        innerWheel[nextPos] = obj;
    }
}

function onShuffleD() {
    onShuffle(inputResultD);
}

/**
 * Embaralha palavras de uma frase (string)
 */
function onShuffle(inputResult) {
    let message = inputResult.value;
    console.log("onShuffle message: " + message);
    inputResult.value = "";

    let arrayWords = [];
    let word = "";

    for (let i = 0; i < message.length; i++) {
        let charMsg = message.charAt(i);
        if (charMsg != " ") {
            word += charMsg;
        } else if (word != "") {
            arrayWords.push(word);
            word = "";
        }
    }

    // Como não tem caractere de espaço depois da última palavra, então iremos adicionar ela agora.
    arrayWords.push(word);

    console.log("on shuffle array word: ", arrayWords);

    let resultArrayWords = [];

    while (arrayWords.length > 0) {
        let aleatoryIndex = Math.floor(Math.random() * arrayWords.length);
        let aleatoryWord = arrayWords[aleatoryIndex];
        console.log("Aleatory word: " + aleatoryWord);
        arrayWords.splice(aleatoryIndex, 1);
        resultArrayWords.push(aleatoryWord);
    }

    let stringResultShuffled = "";
    for (let i = 0; i < resultArrayWords.length; i++) {
        stringResultShuffled += resultArrayWords[i];
        if (i < resultArrayWords.length - 1) {
            stringResultShuffled += " ";
        }
    }

    inputResult.value = stringResultShuffled;
}

/**
 * Realiza a validação dos campos necessários para decodificar/codificar
 */
function verification(index, keyword, message, valid) {
    if (index == "") {
        alert("Index is required!");
        valid = 0;
    } else if (keyword == "") {
        alert("Keyword is required!");
        valid = 0;
    } /* else if (message == "") {
        alert("Message is required!");
        valid = 0;
    } */
}

function onInputIndex() {
    inputIndexD.value = inputIndexE.value;
}

function onInputKeyword() {
    inputKeywordD.value = inputKeywordE.value;
}