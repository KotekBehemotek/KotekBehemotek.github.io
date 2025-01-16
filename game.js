import GAME from '/tetrisEngine.js';

document.addEventListener('DOMContentLoaded', () => {

    const game = new GAME(0);

    const elements = {
        body: document.body,
        flexBoxes: {
            mainFlex: document.getElementById('mainFlex'),
            scoreFlex: document.getElementById('scoreFlex')
        },
        scoreIndicators: {
            score0: document.getElementById('score0'),
            score1: document.getElementById('score1')
        }
    }

    let matrixIndex = 0;

    function controls(ev) {
        const key = ev.key;

        switch (key) {
            case ' ':
                if (game.matrices.get(matrixIndex).gameOn) {
                    if (game.matrices.get(matrixIndex).paused) {
                        game.resume(matrixIndex);
                    } else {
                        game.pause(matrixIndex);
                    }
                } else {
                    game.start(matrixIndex);
                }
                break;
            case 'ArrowDown':
                game.drop(matrixIndex);
                break;
            case 'ArrowRight':
                game.moveRight(matrixIndex);
                break;
            case 'ArrowLeft':
                game.moveLeft(matrixIndex);
                break;
            case 'ArrowUp':
                game.rotate(matrixIndex);
                break;
            case 'a':
                matrixIndex = 1 - matrixIndex;
                break;
        }
    }

    function prepareControls() {
        document.addEventListener('keydown', ev => controls(ev));
    }

    function prepareGame(matricesParams) {
        game.addMatrixDefault(
            matricesParams.shapesInLine,
            matricesParams.speed,
            matricesParams.height,
            matricesParams.width,
            matricesParams.targetElement,
            {
                rowRemovedFunction: function (rowsRemoved) {
                    elements.scoreIndicators.score0.innerText = rowsRemoved;
                },
                gameOverFunction: function () {
                    elements.scoreIndicators.score0.innerText = '0';
                }
            }
        );

        game.generateMatrixDefault();

        const newMatrix = document.createElement('div');

        newMatrix.setAttribute('id', 'matrix_1');
        elements.flexBoxes.mainFlex.appendChild(newMatrix);

        for (let i = 0, l = matricesParams.height; i < l; i++) {
            for (let j = 0, le = matricesParams.width; j < le; j++) {
                const computedID = `pixel_${i}/${j}_1`,
                    pixelElement = document.createElement('div');

                pixelElement.setAttribute('id', computedID);
                pixelElement.innerText = '[]';
                newMatrix.appendChild(pixelElement);
            }
        }

        game.addMatrixCustom(
            matricesParams.shapesInLine,
            matricesParams.speed,
            matricesParams.height,
            matricesParams.width,
            matricesParams.idInHTML,
            matricesParams.targetElement,
            matricesParams.pixelClasses,
            {
                rowRemovedFunction: function (rowsRemoved) {
                    elements.scoreIndicators.score1.innerText = rowsRemoved;
                },
                gameOverFunction: function () {
                    elements.scoreIndicators.score1.innerText = '0';
                }
            }
        );
    }

    let matrixParams = {
        shapesInLine: 1,
        speed: 500,
        height: 20,
        width: 10,
        idInHTML: 'matrix_1',
        targetElement: elements.flexBoxes.mainFlex,
        pixelClasses: {
            pixelClassALL: 'pixelALL_1',
            pixelClassON: 'pixelON_1',
            pixelClassOFF: 'pixelOFF_1',
            pixelClassDED: 'pixelDED_1'
        }
    }

    prepareControls();
    prepareGame(matrixParams);

});