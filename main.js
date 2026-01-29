// Varibles
let welcome = document.querySelector(".welcome")
let btnStart = document.getElementById("btnStart");
let btnBuilder = document.getElementById("builder");
let goToBuilder = document.getElementById("goToBuilder");
let btnTakeQuiz = document.getElementById("takeQuiz");
let sectionBuilder = document.querySelector(".section-builder");
let sectionTakeQuiz = document.querySelector(".section-take-quiz");
let errorBuilder = document.getElementById('errorBuilder');
let errorMessage = document.getElementById('errorMessage');
let btnAddQuestion = document.querySelector(".add-Question");
let parentCards = document.querySelector('.parent-cards');/* want now */
let btnAddAnswer = parentCards.querySelectorAll('.add-option');
let btnSaveToLocalStorage = document.getElementById('saved');
let counterQuestion = document.getElementById('counterQuestion')
let moveElement = document.getElementById('moveElement');
let next = document.getElementById('next');
let previous = document.getElementById('previous');
let finish = document.getElementById('finish');
let knowCorrectAnswer = document.getElementById('showCorrectAnswer');
let questNow = document.getElementById('questNow');
let resultDegree = document.getElementById('result');
let degree = document.getElementById('degree');
let retake = document.getElementById('retake');
let messageResult = document.getElementById('messageResult');
let finishPage = document.querySelector('.finishPage');
let notFound = document.getElementById('ifNoQuest');

function show(target, show = true) {
    target.style.display = show ? 'block' : 'none';
}

function generateId(prefix = 'id') {
    return `${prefix}-${(Date.now() * Math.random() * 1000).toString(36).substring(2, 9)}`;
}

/* -------------------------------------
Auto Save
------------------------------------- */
let arrCards = [];

/* -------------------------------------
Repeater
------------------------------------- */

function repeatQuestion() {
    let parentId = generateId('parent');
    let card = document.createElement('div');
    card.id = parentId;
    card.classList.add('card');

    // head card
    let divh = document.createElement('div');
    divh.classList.add('head-card');
    divh.innerHTML = `
        <div class="d-flex gap-10 flex-center">
            <i class="fa-solid fa-grip-vertical card-drag-handle"></i>
            <p>QUESTION <span class="counter-quiz">(${card.id.split('-').pop()})</span></p>
        </div>
        <i selector="${card.id}" clss="delete" class="fas fa-trash"></i>
    `;

    // start question
    let divQuest = document.createElement('div');
    divQuest.classList.add('question-content');
    let inputQuest = document.createElement('input');
    inputQuest.type = "text";
    inputQuest.currectAnswer = "select";

    divQuest.appendChild(inputQuest);

    // start answer
    let ansCont = document.createElement('div');
    ansCont.classList.add('answer-content');

    let ansP = document.createElement('p');
    ansP.classList.add('answer-top');
    ansP.innerText = 'ANSWERS'

    let spanA = document.createElement('span');
    spanA.innerText = '(selext dot dor correct answer)';
    ansP.appendChild(spanA);

    let addOption = document.createElement('div');
    addOption.classList.add('add-option');

    addOption.setAttribute('parent-id', parentId);

    let addOptionI = document.createElement('i');
    addOptionI.className = 'fas fa-plus';

    let addOptionSpan = document.createElement('span');
    addOptionSpan.innerText = 'Add Option';

    addOption.appendChild(addOptionI);
    addOption.appendChild(addOptionSpan);
    // Add To card
    card.appendChild(divh);
    card.appendChild(divQuest);
    card.appendChild(ansCont);
    card.appendChild(addOption);
    // Add card to parent
    parentCards.appendChild(card);

    // Reinitialize sortable after adding new question
    initQuestionSortable();
}

function addAnswer(parentId) {
    let optionId = generateId('option');
    let answerContainer = document.querySelector(`#${parentId} .answer-content`);
    let index = answerContainer.children.length + 1;
    let ansInput = document.createElement('div');
    ansInput.classList.add('answer-input');
    ansInput.id = optionId

    ansInput.innerHTML += `
        <div class="d-flex gap-10 flex-grow">
            <div class="flex-center gap-10">
                <i class="fa-solid fa-grip-vertical drag-handle"></i>
                <input type="radio" class="radio" name="${parentId.replace('-', '_')}">
            </div>
            <input type="text" class="answer" placeholder="option ${index}">
        </div>
        <i class="fa-solid fa-xmark" selector="${ansInput.id}"></i>
    `;

    answerContainer.appendChild(ansInput);

    // Make last option input focused
    let lastOptionInput = answerContainer.lastElementChild.querySelector('.answer');
    if (lastOptionInput) lastOptionInput.focus();

    // Make the answer content sortable and scroll to the bottom of the page
    Sortable.create(answerContainer, {
        handle: '.drag-handle',
        animation: 150,
        group: parentId,
        scroll: true
    })
}

function deleteItem(selector) {
    document.getElementById(selector).remove();
}

function collectData(card) {
    let result = {
        text: "",
        options: [],
        correctAnswer: null
    }
    // question select
    result.text = card.querySelector('.question-content input').value;
    // answer select
    card.querySelectorAll('.answer-input .answer').forEach(function (el) {
        result.options.push(el.value)
    })
    // select correctAnswer
    card.querySelectorAll('.radio')
        .forEach(function (el, id) {
            if (el.checked) {
                result.correctAnswer = result.options[id]
            }
        })
    return result;
}

// get from local storage
function getFromlocalStorage() {
    let countMove = 0;
    let countQuestion = 1;
    degreeResult = 0;
    questNow.innerHTML = countQuestion;
    let allExam = JSON.parse(localStorage.getItem('exam')) || [];
    if (!allExam.length)
        return;
    allExam.forEach(function (el, id) {
        // question
        let divCard = document.createElement('div');
        divCard.classList.add('cards')
        let divQuest = document.createElement('div');
        divQuest.classList.add('getQuest')
        let inpuQ = document.createElement('input');
        inpuQ.type = 'text';
        inpuQ.name = '';
        inpuQ.setAttribute('readonly', true)
        divQuest.appendChild(inpuQ);
        divCard.appendChild(divQuest);
        sectionTakeQuiz.appendChild(divCard);
        inpuQ.value = el.text;
        // answer
        el.options.forEach(function (e, i) {
            let divAns = document.createElement('div');
            divAns.classList.add('getAns')
            divAns.innerHTML = `
            <input type="radio" class="radioAns" name="ans${id}" id="" >`
            let inpuA = document.createElement('input');
            inpuA.type = 'text';
            inpuA.name = '';
            inpuA.classList.add('veiwAnswer')
            inpuA.readOnly = true;
            divAns.appendChild(inpuA)
            divCard.appendChild(divAns);
            sectionTakeQuiz.appendChild(divCard);
            inpuA.value = e
            inpuA.addEventListener('click', function () {
                divAns.firstElementChild.click();
            })
            // ==============================
            // result
            // ==============================
            finish.addEventListener('click', function () {
                if (divAns.firstElementChild.checked) {
                    if (divAns.lastChild.value !== el.correctAnswer) {

                        let divQuistion = document.createElement('div');
                        divQuistion.classList.add('q');

                        let divWrong = document.createElement('div');
                        divWrong.classList.add('wrong')
                        divWrong.innerHTML = `<i class="fa-solid fa-xmark" style="color: red;"></i>`
                        let wrongContent = document.createElement('div');
                        divWrong.appendChild(wrongContent);
                        let divRight = document.createElement('div');
                        divRight.classList.add('right')
                        divRight.innerHTML = `<i class="fa fa-arrow-right" style="color: green;"></i>`
                        let rightContent = document.createElement('div');

                        knowCorrectAnswer.appendChild(divQuistion)
                        divRight.appendChild(rightContent);
                        knowCorrectAnswer.appendChild(divWrong);
                        knowCorrectAnswer.appendChild(divRight);
                        divQuistion.innerHTML = `Question : ${id + 1}-${el.text}`;
                        wrongContent.innerHTML = divAns.lastChild.value;
                        rightContent.innerHTML = el.correctAnswer
                        knowCorrectAnswer.style.display = 'block';
                    }
                }
                if (divAns.firstElementChild.checked)
                    if (divAns.lastChild.value === el.correctAnswer)
                        degreeResult++;

                show(welcome, false);
                show(sectionBuilder, false);
                show(sectionTakeQuiz, false);
                show(moveElement, false);
                show(finishPage, true);
                btnTakeQuiz.style.display = 'none'
                btnBuilder.style.display = 'none'
                /* result and degree */
                resultDegree.innerHTML = degreeResult;
                let degreeInHtml = allExam.length;

                degree.innerHTML = degreeInHtml
                if (degreeResult === degreeInHtml || degreeResult >= (.85 * degreeInHtml)) {
                    messageResult.innerHTML = 'Excellent';
                    messageResult.style.color = 'green';
                    resultDegree.style.color = 'green';
                } else if (degreeResult > (degreeInHtml / 2) && degreeResult < (.85 * degreeInHtml)) {
                    messageResult.innerHTML = 'Good';
                    messageResult.style.color = 'orange';
                    resultDegree.style.color = 'orange';
                } else if (degreeResult === (degreeInHtml / 2)) {
                    messageResult.innerHTML = 'Acceptable';
                    messageResult.style.color = '#c2c23b';
                    resultDegree.style.color = '#c2c23b';
                } else {
                    messageResult.innerHTML = 'Fails';
                    messageResult.style.color = 'red';
                    resultDegree.style.color = 'red';
                }
            })
        })
        // correctAnswer
    })
    // moveElement
    let cardsExam = document.querySelectorAll('.cards');
    cardsExam.forEach(function (card, index) {
        if (index !== 0)
            card.style.display = 'none';
    })
    if (cardsExam.length === 1) {
        next.style.display = 'none';
        finish.style.display = 'block';
    }
    previous.disabled = true
    next.addEventListener('click', function () {
        cardsExam[countMove].style.display = 'none';
        cardsExam[countMove + 1].style.display = 'block';
        countMove++;
        countQuestion++;
        questNow.innerHTML = countQuestion;
        if (countMove === cardsExam.length - 1) {
            next.style.display = 'none';
            finish.style.display = 'block';
            previous.disabled = false
        }
    })
    previous.addEventListener('click', function () {
        next.style.display = 'block';
        finish.style.display = 'none';
        cardsExam[countMove].style.display = 'none';
        cardsExam[countMove - 1].style.display = 'block';
        countMove--;
        countQuestion--;
        questNow.innerHTML = countQuestion;
        if (countMove === 0)
            previous.disabled = true
    })
    retake.addEventListener('click', function () {
        location.reload();
    });
}

// Show data in builder
function showDataInBuilder() {
    let allExam = JSON.parse(localStorage.getItem('exam')) || [];
    if (!allExam.length) {
        notFound.style.display = 'flex';
        return;
    }

    notFound.style.display = 'none';
    allExam.forEach(function (el, id) {
        // question
        let card = document.createElement('div');
        card.classList.add('card');
        card.id = generateId('parent');

        // head card
        let divh = document.createElement('div');
        divh.classList.add('head-card');
        divh.innerHTML = `
            <div class="d-flex gap-10 flex-center">
                <i class="fa-solid fa-grip-vertical card-drag-handle"></i>
                <p>QUESTION <span class="counter-quiz">(${card.id.split('-').pop()})</span></p>
            </div>
            <i selector="${card.id}" clss="delete" class="fas fa-trash"></i>
        `;

        // start question
        let divQuest = document.createElement('div');
        divQuest.classList.add('question-content');
        let inputQuest = document.createElement('input');
        inputQuest.type = "text";
        inputQuest.currectAnswer = "select";
        divQuest.appendChild(inputQuest);

        // start answer
        let ansCont = document.createElement('div');
        ansCont.classList.add('answer-content');
        let ansP = document.createElement('p');
        ansP.classList.add('answer-top');
        ansP.innerText = 'ANSWERS'
        let spanA = document.createElement('span');
        spanA.innerText = '(selext dot dor correct answer)';
        ansP.appendChild(spanA);

        // Add To card
        card.appendChild(divh);
        card.appendChild(divQuest);
        card.appendChild(ansCont);
        inputQuest.value = el.text;

        // ========================
        // Answer
        // ========================
        el.options.forEach(function (e, i) {
            let index = ansCont.children.length + 1;
            let ansInput = document.createElement('div');
            ansInput.classList.add('answer-input');
            ansInput.id = generateId('option');
            let radioInput = document.createElement('input');
            radioInput.type = 'radio'
            radioInput.style = `cursor: pointer;`
            radioInput.classList.add('radio');
            radioInput.checked = e == el.correctAnswer;
            radioInput.setAttribute('name', `option_${card.id}`)
            let answerInput = document.createElement('input');
            answerInput.type = "text";
            answerInput.classList.add('answer');
            answerInput.setAttribute('placeholder', `option ${index}`)

            ansInput.appendChild(radioInput);
            let answerI = document.createElement('i');
            answerI.className = 'fa-solid fa-xmark';
            answerI.setAttribute('selector', ansInput.id);
            answerI.onclick = function () {
                deleteItem(ansInput.id);
            };
            ansInput.appendChild(answerInput);
            ansInput.appendChild(answerI);
            ansCont.appendChild(ansInput);
            answerInput.value = e
        })
        let addOption = document.createElement('div');
        addOption.classList.add('add-option');
        addOption.setAttribute('parent-id', card.id);

        let addOptionI = document.createElement('i');
        addOptionI.className = 'fas fa-plus';

        let addOptionSpan = document.createElement('span');
        addOptionSpan.innerText = 'Add Option';

        addOption.appendChild(addOptionI);
        addOption.appendChild(addOptionSpan);

        card.appendChild(addOption);
        // Add card to parent
        parentCards.appendChild(card);
        // sectionBuilder.appendChild(parentCards);
    })
    btnSaveToLocalStorage.style.display = 'block';

    // Initialize sortable for questions
    initQuestionSortable();
}

/* -------------------------------------
Events
------------------------------------- */
// Add Event Listener to Start button
btnStart.addEventListener('click', function () {
    takeQuiz.classList.add('active');
    show(welcome, false)
    show(sectionTakeQuiz, true)
    moveElement.style.display = 'flex';
    finishPage.style.display = 'none';
    getFromlocalStorage();
    let cardsExam = sectionTakeQuiz.querySelectorAll('.cards');
    if (cardsExam.length === 0) {
        counterQuestion.style.display = 'none';
        moveElement.style.display = 'none';
    } else {
        counterQuestion.style.display = 'flex';
        moveElement.style.display = 'flex';
    }
});

// Add Event Listener to Take Quiz button
btnTakeQuiz.addEventListener('click', function () {
    this.classList.add('active');
    btnBuilder.classList.remove('active');

    show(welcome, false);
    show(sectionTakeQuiz, true);

    show(sectionBuilder, false);
    finishPage.style.display = 'none';
    getFromlocalStorage();
    let cardsExam = sectionTakeQuiz.querySelectorAll('.cards');
    if (cardsExam.length === 0) {
        counterQuestion.style.display = 'none';
        moveElement.style.display = 'none';
    } else {
        counterQuestion.style.display = 'flex';
        moveElement.style.display = 'flex';
    }
})

// Variable to store sortable instance
let questionSortable = null;

// Function to initialize sortable for questions
function initQuestionSortable() {
    // Destroy existing instance if it exists
    if (questionSortable) {
        questionSortable.destroy();
    }

    // Create new sortable instance
    questionSortable = Sortable.create(parentCards, {
        handle: '.card-drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        scroll: true
    });
}

// Add Event Listener to Builder buttons
btnBuilder.addEventListener('click', function() {
    btnTakeQuiz.classList.remove('active');
    this.classList.add('active');
    show(welcome, false);
    show(sectionBuilder, true)
    show(sectionTakeQuiz, false)
    show(moveElement, false)
    finishPage.style.display = 'none';

    // Initialize sortable for questions
    initQuestionSortable();
})

// Add Event Listener to Go to Builder button
goToBuilder.addEventListener('click', function() {
    btnBuilder.click();
});

// Add Event Listener to Add Question button
btnAddQuestion.addEventListener('click', function () {
    repeatQuestion();

    // Scroll to the bottom of the page
    window.scrollTo({
        top: document.body.scrollHeight - window.innerHeight,
        behavior: "smooth"
    })

    // Focus on the last question
    let optionInput = parentCards.lastElementChild.querySelector('.question-content input');
    if (optionInput) optionInput.focus();

    // Show save button
    show(btnSaveToLocalStorage, true);
});

/* -------------------------------------
Save Quiz To Local Storage
------------------------------------- */
btnSaveToLocalStorage.addEventListener('click', function (e) {
    let arrCards = [];
    document.querySelectorAll(`.parent-cards .card`).forEach(function (card) {
        arrCards.push(collectData(card))
    })

    let hasError = arrCards.some(function (el) { return el.options.length < 2 });
    let notCorrect = arrCards.some(function (el) { return el.correctAnswer === null })

    let hasEmpty = arrCards.some(el =>
        el.options.some(opt => !opt || opt.trim() === "") ||
        !el.text || el.text.trim() === ""
    );

    let hasDuplicate = arrCards.some(item => {
        let values = item.options.map(v => v.trim()).filter(v => v !== '');
        return new Set(values).size !== values.length;
    });

    if (hasError) {
        errorBuilder.style.display = 'block';
        errorMessage.textContent = 'Aquestion must have at least 2 options.';
        window.scrollBy({
            top: -99999,
            behavior: "smooth"
        })
        return;
    } else if (hasDuplicate) {
        errorBuilder.style.display = 'block';
        errorMessage.textContent = 'Each question must have at least 2 options.';
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        return;
    } else if (notCorrect) {
        errorBuilder.style.display = 'block';
        errorMessage.textContent = 'Choise Correct Answer.';
        window.scrollBy({
            top: -99999,
            behavior: "smooth"
        })
        return;
    } else if (hasEmpty) {
        errorBuilder.style.display = 'block';
        errorMessage.textContent = 'you have option is empty';
        window.scrollBy({
            top: -99999,
            behavior: "smooth"
        })
        return;
    } else {
        errorBuilder.style.display = 'none';
        localStorage.setItem('exam', JSON.stringify(arrCards));
    }
    // Save to local Storage
    location.reload();
});

// Add Lister to add option
document.addEventListener('click', function (e) {
    const target = e.target.closest('[parent-id]');
    if (!target) return;

    const parentId = target.getAttribute('parent-id');
    addAnswer(parentId)

    // Scroll to the bottom of the page
    window.scrollTo({
        top: document.body.scrollHeight - window.innerHeight,
        behavior: "smooth"
    })
});

// Add Lister to Delete Item
document.addEventListener('click', function (e) {
    const target = e.target.closest('[selector]');
    if (!target) return;
    deleteItem(target.getAttribute('selector'))
});

// Add Event Listener to Reset All button
document.getElementById('reset-all').addEventListener('click', function (e) {
    document.querySelector('.parent-cards').innerHTML = '';
    parentId = 1;
    localStorage.clear()
    show(btnSaveToLocalStorage, false)
    errorBuilder.style.display = 'none';
});

// Get data from local storage and show data in builder
getFromlocalStorage();
showDataInBuilder();