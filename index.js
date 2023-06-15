document.addEventListener('DOMContentLoaded', function () {

    function playHitTone() {
        const audio = new AudioContext();
        const oscillator = audio.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.value = 440;

        oscillator.connect(audio.destination);
        oscillator.start();
        setTimeout(function () {
            oscillator.stop();
        }, 20);
    }

    function playRowTone(again) {
        const audio = new AudioContext();
        const oscillator = audio.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.value = 700;

        oscillator.connect(audio.destination);
        oscillator.start();
        setTimeout(function () {
            oscillator.stop();
            if (again) {
                playRowTone(false);
            }
        }, 20);
    }

    function playEndSequence(freq) {
        const audio = new AudioContext();
        const oscillator = audio.createOscillator();

        oscillator.type = 'triangle';
        oscillator.frequency.value = freq;

        oscillator.connect(audio.destination);
        oscillator.start();
        setTimeout(function () {
            oscillator.stop();
            if (freq >= 300) {
                playEndSequence(freq - 100);
            }
        }, 200);
    }

    const elements = {
        'nameBox': document.getElementById('nameBox'),

        'matrix': document.getElementById('matrix'),

        'cookieButton': document.getElementById('cookieButton'),
        'buttonPause': document.getElementById('buttonPause'),
        'buttonStop': document.getElementById('buttonStop'),

        'arrowUp': document.getElementById('arrowUp'),
        'arrowLeft': document.getElementById('arrowLeft'),
        'arrowDown': document.getElementById('arrowDown'),
        'arrowRight': document.getElementById('arrowRight'),

        'blocksCounter': document.getElementById('blocksCounter'),
        'rowsCounter': document.getElementById('rowsCounter'),

        'blocksNumber': document.getElementById('blocksNumber'),
        'rowsNumber': document.getElementById('rowsNumber'),
        'recordBlocksNumber': document.getElementById('recordBlocksNumber'),
        'recordRowsNumber': document.getElementById('recordRowsNumber'),

        'recordText': document.getElementsByClassName('recordText')
    };

    let gameOn = false;
    let gamePause = false;
    let cookiesSet = false;

    let gameMatrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    class Tetri {
        constructor(type) {  //    square                       z left                 line                     z right                   l right                       t                       l left
            this.shapes = [[0, 4, 0, 5, 1, 4, 1, 5], [0, 4, 0, 5, 1, 5, 1, 6], [0, 4, 1, 4, 2, 4, 3, 4], [0, 5, 0, 6, 1, 4, 1, 5], [0, 4, 0, 5, 1, 4, 2, 4], [0, 3, 0, 4, 0, 5, 1, 4], [0, 4, 0, 5, 1, 5, 2, 5]];
            this.type = type;
            this.currentMutation = 0;
            this.state = true;
            this.newTetri = true;
            this.locked = false;
            this.speed = 300;
            this.shape = this.shapes[this.type];
        }
    }

    function removeTetri() {
        const replacement = Number(!tetri.state);

        for (let i = 0; i < tetri.shape.length; i += 2) {
            gameMatrix[tetri.shape[i]][tetri.shape[i + 1]] = replacement;
        }
    }

    function addTetri(move) {
        for (let i = 0; i < tetri.shape.length; i += 2) {
            gameMatrix[tetri.shape[i]][tetri.shape[i + 1]] = 2;
        }

        annihilateRows(move);
    }

    function moveTetri() {
        verifyTetriVerticalPosition();
        verifyTetriVerticalCollision();
        removeTetri();

        for (let i = 0; i < tetri.shape.length; i += 2) {
            tetri.shape[i] += 1;
        }
        setTimeout(step, tetri.speed);
    }

    function moveTetriLeft() {
        if (verifyTetriPositionLeft()) {
            if (verifyTetriHorizontalCollision(-1)) {
                removeTetri();
                for (let i = 1; i < tetri.shape.length; i += 2) {
                    tetri.shape[i] -= 1;
                }
                addTetri(false);
            }
        }
    }

    function moveTetriRight() {
        if (verifyTetriPositionRight()) {
            if (verifyTetriHorizontalCollision(1)) {
                removeTetri();
                for (let i = 1; i < tetri.shape.length; i += 2) {
                    tetri.shape[i] += 1;
                }
                addTetri(false);
            }
        }
    }

    function rotateTetri() {
        const tab = [[2, 0, 1, -1, 0, 0, -1, -1], [-2, 0, -1, 1, 0, 0, 1, 1]];
        const tab2 = [[1, -1, 0, 0, -1, 1, -2, 2], [-1, 1, 0, 0, 1, -1, 2, -2]];
        const tab3 = [[0, 0, 0, -2, -2, 0, 0, 0], [0, 0, 0, 2, 2, 0, 0, 0]];
        const tab4 = [[1, 1, 2, 0, 0, 0, -1, -1], [1, -1, 0, -2, 0, 0, -1, 1], [-1, -1, -2, 0, 0, 0, 1, 1], [-1, 1, 0, 2, 0, 0, 1, -1]];
        const tab5 = [[-1, 1, 0, 0, 1, -1, -1, -1], [1, 1, 0, 0, -1, -1, -1, 1], [1, -1, 0, 0, -1, 1, 1, 1], [-1, -1, 0, 0, 1, 1, 1, -1]];
        const tab6 = [[0, 2, 1, 1, 0, 0, -1, -1], [2, 0, 1, -1, 0, 0, -1, 1], [0, -2, -1, -1, 0, 0, 1, 1], [-2, 0, -1, 1, 0, 0, 1, -1]];

        const mutations = [[0, 0, 0, 0, 0, 0, 0, 0], tab, tab2, tab3, tab4, tab5, tab6];

        let go = true;

        for (let i = 0; i < tetri.shape.length - 1; i += 2) {
            if (tetri.currentMutation < mutations[tetri.type].length) {
                if (tetri.shape[i] + mutations[tetri.type][tetri.currentMutation][i] >= gameMatrix.length
                    || tetri.shape[i + 1] + mutations[tetri.type][tetri.currentMutation][i + 1] >= gameMatrix.length / 2
                    || tetri.shape[i + 1] + mutations[tetri.type][tetri.currentMutation][i + 1] < 0
                    || gameMatrix[tetri.shape[i] + mutations[tetri.type][tetri.currentMutation][i]][tetri.shape[i + 1] + mutations[tetri.type][tetri.currentMutation][i + 1]] === 1) {
                    go = false;
                }
            }
        }

        if (go) {
            removeTetri();

            for (let i = 0; i < tetri.shape.length; i++) {
                if (tetri.currentMutation < mutations[tetri.type].length) {
                    tetri.shape[i] += mutations[tetri.type][tetri.currentMutation][i];
                } else {
                    tetri.shape[i] += mutations[tetri.type][0][i];
                    if (i === tetri.shape.length - 1) {
                        tetri.currentMutation = 0;
                    }
                }
            }

            tetri.currentMutation++;
            addTetri(false);
        } else {

        }
    }

    function verifyTetriVerticalCollision() {
        let collisionCounter = 0;

        for (let i = 0; i < tetri.shape.length; i += 2) {
            if (tetri.shape[i] + 1 < gameMatrix.length) {
                if (gameMatrix[tetri.shape[i] + 1][tetri.shape[i + 1]] !== 1) {
                    collisionCounter++;
                }
            }
        }

        if (tetri.newTetri && collisionCounter !== 4) {
            tetrisOver();
        }

        tetri.newTetri = false;
        tetri.state = collisionCounter === 4;
    }

    function verifyTetriHorizontalCollision(direction) {
        let collisionCounter = 0;

        for (let i = 1; i < tetri.shape.length; i += 2) {
            if (tetri.shape[i] + direction < gameMatrix.length / 2) {
                if (gameMatrix[tetri.shape[i - 1]][tetri.shape[i] + direction] !== 1) {
                    collisionCounter++;
                }
            }
        }

        return collisionCounter === 4;
    }

    function verifyTetriVerticalPosition() {
        for (let i = 0; i < tetri.shape.length; i += 2) {
            tetri.state = tetri.shape[i] < gameMatrix.length;
            if (!tetri.state) {
                break;
            }
        }
    }

    function verifyTetriPositionRight() {
        let go;

        for (let i = 1; i < tetri.shape.length; i += 2) {
            go = tetri.shape[i] < gameMatrix.length / 2 - 1;
            if (!go) {
                break;
            }
        }

        return go;
    }

    function verifyTetriPositionLeft() {
        let go;

        for (let i = 1; i < tetri.shape.length; i += 2) {
            go = tetri.shape[i] > 0;
            if (!go) {
                break;
            }
        }
        return go;
    }

    function blurButtons() {
        document.activeElement.blur();
    }

    function controls(event) {
        if (gameOn) {
            if (tetri.state && !tetri.locked && !gamePause) {
                if (event.key === 'ArrowLeft') {
                    moveTetriLeft();
                    highlightArrows(elements.arrowLeft);
                } else if (event.key === 'ArrowRight') {
                    moveTetriRight();
                    highlightArrows(elements.arrowRight);
                } else if (event.key === 'ArrowDown') {
                    speedUp();
                    highlightArrows(elements.arrowDown);
                } else if (event.key === 'ArrowUp') {
                    if (tetri.type !== 0) {
                        rotateTetri();
                    }
                    highlightArrows(elements.arrowUp);
                }
            }
            if (event.key === ' ') {
                pauseGame();
            }
            blurButtons();
        }
    }

    function enableCookieButton() {
        elements.cookieButton.style.opacity = '1';
    }

    function disableCookieButton() {
        elements.cookieButton.style.opacity = '0';
    }

    function colourCookieButton() {
        const cookieButtonStyle = elements.cookieButton.style;

        if (cookiesSet) {
            cookieButtonStyle.borderColor = 'gray';
            cookieButtonStyle.backgroundColor = 'aquamarine';
            cookieButtonStyle.color = 'black';
        } else {
            cookieButtonStyle.borderColor = 'aquamarine';
            cookieButtonStyle.backgroundColor = '#00000000';
            cookieButtonStyle.color = 'aquamarine';
        }
    }

    function disableButtons() {
        if (!gameOn) {
            elements.buttonPause.style.opacity = '0';
            elements.arrowUp.style.opacity = '0';
            elements.arrowDown.style.opacity = '0';
            elements.arrowLeft.style.opacity = '0';
            elements.arrowRight.style.opacity = '0';
        } else {
            elements.buttonPause.style.opacity = '1';
            elements.arrowUp.style.opacity = '1';
            elements.arrowDown.style.opacity = '1';
            elements.arrowLeft.style.opacity = '1';
            elements.arrowRight.style.opacity = '1';
        }
    }

    function highlightArrows(arrowElement) {
        const arrowElementStyle = arrowElement.style;

        arrowElementStyle.color = 'black';
        arrowElementStyle.borderColor = 'gray';
        arrowElementStyle.backgroundColor = 'aquamarine';
        setTimeout(function () {
            arrowElementStyle.color = 'aquamarine';
            arrowElementStyle.borderColor = 'aquamarine';
            arrowElementStyle.backgroundColor = 'black';
        }, 20);
    }

    function highlightPauseButton() {
        const pauseButtonStyle = elements.buttonPause.style;

        if (!gamePause) {
            pauseButtonStyle.color = 'aquamarine';
            pauseButtonStyle.borderColor = 'aquamarine';
            pauseButtonStyle.backgroundColor = 'black';
        } else {
            pauseButtonStyle.color = 'black';
            pauseButtonStyle.borderColor = 'gray';
            pauseButtonStyle.backgroundColor = 'aquamarine';
        }
    }

    function changeButtonText() {
        const stopButton = elements.buttonStop;

        if (gameOn) {
            stopButton.innerText = 'end';
        } else {
            stopButton.innerText = 'start';
        }
    }

    function pauseGame() {
        gamePause = !gamePause;

        highlightPauseButton();
        step();
    }

    function randomise(first) {
        const randomNumber = Math.floor(Math.random() * 7);

        if (first) {
            return randomNumber;
        } else {
            if (randomNumber !== tetri.type) {
                return randomNumber;
            } else {
                return randomise(false);
            }
        }

    }

    function startGame() {

        for (let i = 0; i < gameMatrix.length; i++) {
            for (let j = 0; j < gameMatrix[i].length; j++) {
                gameMatrix[i][j] = 0;
            }
        }

        gameOn = true;

        tetri = new Tetri(randomise(true));
        resetIndicators();
        step();
        disableCookieButton();
        changeButtonText();
        disableButtons();
    }

    document.addEventListener('keydown', (event => controls(event)));

    elements.cookieButton.addEventListener('click', function () {
        if (cookiesSet) {
            deleteCookies();
        } else {
            setCookies();
        }
        colourCookieButton();
    });
    elements.buttonPause.addEventListener('click', pauseGame);
    elements.buttonStop.addEventListener('click', function () {
        if (gameOn) {
            tetrisOver();
        } else {
            startGame();
        }
    });

    elements.arrowLeft.addEventListener('click', moveTetriLeft);
    elements.arrowRight.addEventListener('click', moveTetriRight);
    elements.arrowUp.addEventListener('click', rotateTetri);
    elements.arrowDown.addEventListener('click', speedUp);

    function setup() {
        for (let i = 0; i < gameMatrix.length; i++) {
            for (let j = 0; j < gameMatrix[i].length; j++) {
                elements.matrix.innerHTML += '<span class="tetri" id="' + 'tetri' + i + '' + j + '" style="grid-column: ' + (j + 1) + ' / ' + (j + 2) + '; grid-row: ' + (i + 1) + ' / ' + (i + 2) + '">[&nbsp &nbsp]</span>';
            }
        }

        searchForCookies();
        readCookies();
        changeButtonText();
        disableButtons();
    }

    function speedUp() {
        tetri.locked = true;
        tetri.speed = 50;
    }

    function display(move) {
        for (let i = 0; i < gameMatrix.length; i++) {
            for (let j = 0; j < gameMatrix[i].length; j++) {
                if (gameMatrix[i][j] === 1) {
                    document.getElementById('tetri' + i + '' + j).style.opacity = '1';
                    document.getElementById('tetri' + i + '' + j).style.color = 'aquamarine';
                } else if (gameMatrix[i][j] === 2) {
                    document.getElementById('tetri' + i + '' + j).style.opacity = '1';
                    document.getElementById('tetri' + i + '' + j).style.color = 'red';
                } else {
                    document.getElementById('tetri' + i + '' + j).style.opacity = '0';
                }
            }
        }
        if (move) {
            moveTetri();
        }
    }

    function tetrisOver() {
        if (gameOn) {
            gameOn = false;
            gamePause = false;

            if (cookiesSet) {
                setCookies();
            }

            enableCookieButton();
            changeButtonText();
            disableButtons();
            display(false);
            playEndSequence(500);
            highlightPauseButton();
        }
    }

    function incrementBlocks() {
        const blocksNumber = elements.blocksNumber;

        blocksNumber.innerText = (Number(blocksNumber.innerText) + 1).toString();
    }

    function incrementRows(numberOfRows) {
        const rowsNumber = elements.rowsNumber;

        rowsNumber.innerText = (Number(rowsNumber.innerText) + numberOfRows).toString();
    }

    function resetIndicators() {
        const blocksNumber = elements.blocksNumber;
        const rowsNumber = elements.rowsNumber;

        blocksNumber.innerText = '0';
        rowsNumber.innerText = '0';
    }

    function swipeRowsDown(rowsAnnihilated, maxIndex, move) {
        for (let i = maxIndex; i >= 0; i--) {
            if (i - rowsAnnihilated > 0) {
                gameMatrix[i] = gameMatrix[i - rowsAnnihilated];
            } else {
                gameMatrix[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
        }
        display(move);
    }

    function annihilateRows(move) {
        let rowsAnnihilated = 0;
        let maxIndex;

        for (let i = 0; i < gameMatrix.length; i++) {
            if (JSON.stringify(gameMatrix[i]) === JSON.stringify([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])) {
                gameMatrix[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                rowsAnnihilated++;
                maxIndex = i;
            }
        }

        if (rowsAnnihilated > 0) {
            incrementRows(rowsAnnihilated);
            swipeRowsDown(rowsAnnihilated, maxIndex, move);
            playRowTone(true);
        } else {
            display(move);
        }
    }

    function step() {
        if (gameOn && !gamePause) {
            if (!tetri.state) {
                tetri = new Tetri(randomise(false));
                playHitTone();
                incrementBlocks();
                setTimeout(step, tetri.speed);
            } else {
                addTetri(true);
            }
        }
    }

    function setCookies() {
        addRecordIndicators();
        cookiesSet = true;

        const recordBlocksText = elements.recordBlocksNumber.innerText;
        const recordRowsText = elements.recordRowsNumber.innerText;
        const blocksCounterText = elements.blocksNumber.innerText;
        const rowsCounterText = elements.rowsNumber.innerText;
        const playerName = elements.nameBox.value;
        const blocksRecord = function () {
            if (Number(blocksCounterText) > Number(recordBlocksText) || recordBlocksText === '') {
                return blocksCounterText;
            } else {
                return recordBlocksText;
            }
        }
        const rowsRecord = function () {
            if (Number(rowsCounterText) > Number(recordRowsText) || recordRowsText === '') {
                return rowsCounterText;
            } else {
                return recordRowsText;
            }
        }

        const expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        if (!gameOn) {
            if (playerName !== '') {
                document.cookie = 'playername=' + playerName + '; expires=' + expirationDate + '; path=/;';
            }
            if (blocksCounterText !== '0') {
                document.cookie = 'recordblocks=' + blocksRecord() + ';' + ' expires=' + expirationDate + '; path=/;';
                document.cookie = 'recordrows=' + rowsRecord() + ';' + ' expires=' + expirationDate + '; path=/;';
            }
        }
        readCookies();
    }

    function regexCookie(name) {
        return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    }

    function readCookies() {
        const nameCookieName = 'playername';
        const blocksCookieName = 'recordblocks';
        const rowsCookieName = 'recordrows';
        const nameCookie = regexCookie(nameCookieName);
        const blocksCookie = regexCookie(blocksCookieName);
        const rowsCookie = regexCookie(rowsCookieName);

        if (cookiesSet) {
            addRecordIndicators();

            if (nameCookie !== '') {
                elements.nameBox.value = nameCookie;
            }
            elements.recordBlocksNumber.innerText = blocksCookie;
            elements.recordRowsNumber.innerText = rowsCookie;
        }
    }

    function addRecordIndicators() {
        elements.recordText.item(0).style.display = 'inherit';
        elements.recordText.item(1).style.display = 'inherit';
        elements.recordBlocksNumber.style.display = 'inherit';
        elements.recordRowsNumber.style.display = 'inherit';
    }

    function removeRecordIndicators() {
        elements.recordText.item(0).style.display = 'none';
        elements.recordText.item(1).style.display = 'none';
        elements.recordBlocksNumber.style.display = 'none';
        elements.recordRowsNumber.style.display = 'none';
    }

    function deleteCookies() {
        removeRecordIndicators();
        
        // for Safari
        document.cookie = 'playername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/Webtris;';
        document.cookie = 'recordblocks=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/Webtris;';
        document.cookie = 'recordrows=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/Webtris;';

        // for Chrome
        document.cookie = 'playername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'recordblocks=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'recordrows=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        cookiesSet = false;
    }

    function searchForCookies() {
        if (document.cookie !== '') {
            cookiesSet = true;
        }
        colourCookieButton();
    }

    setup();
    let tetri;

});
