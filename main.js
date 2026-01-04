// Varibles
let welcome = document.querySelector(".welcome")
let btnStart = document.getElementById("btnStart");
let iconHead = document.querySelectorAll(".icon")
let btnBuilder = document.getElementById("builder");
let btnTakeQuiz = document.getElementById("takeQuiz");
let sectionBuilder = document.querySelector(".section-builder");
let sectionTakeQuiz = document.querySelector(".section-take-quiz");
let errorBuilder = document.getElementById('errorBuilder');
let whyErorr = document.getElementById('whyWrong');
let parentCardSow = document.getElementById('parentCardSow')
let btnAddQuiz = document.querySelector(".add-Question");
let parentCards = document.querySelector('.paren-cards');/* want now */
let contentAnswer = document.querySelector('.answer-content');
let inputAnswer = document.querySelectorAll('.answer-input');
let btnAddAnswer = parentCards.querySelectorAll('.add-option');
let saveToLocalStorage = document.getElementById('saved');
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
let massegeResult = document.getElementById('massegeResult');
let finishPag = document.querySelector('.finishPage');
function show(target, show = true) {
    target.style.display = show ? 'block' : 'none';
}
/* -------------------------------------
Auto Save
------------------------------------- */
let arrCards = [];
/* -------------------------------------
Repeater
------------------------------------- */
let parentId = 1;

function repeatQuiz() {
    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', `parent-${parentId}`)

    // head card 
    let divh = document.createElement('div');
    divh.classList.add('head-card');
    divh.innerHTML = `
        <p>QUESTION <span class="counter-quiz">: ${parentId}</span></p>
        <i selector="parent-${parentId}" clss="delete" class="fas fa-trash"></i>
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

    parentId++;
}
function repeatAnswer(parentId) {
    let answerContainer = document.querySelector(`#parent-${parentId} .answer-content`);
    let index = answerContainer.children.length + 1;

    let ansInput = document.createElement('div');
    ansInput.classList.add('answer-input');
    ansInput.id = `option-${parentId}-${index}`

    let radioInput = document.createElement('input');
    radioInput.type = 'radio'
    radioInput.style = `cursor: pointer;`
    radioInput.classList.add('radio');
    radioInput.setAttribute('name', `option_${parentId}`)

    let answerInput = document.createElement('input');
    answerInput.type = "text";
    answerInput.classList.add('answer');
    answerInput.setAttribute('placeholder', `option ${index}`)

    let answerI = document.createElement('i');
    answerI.className = 'fa-solid fa-xmark';
    answerI.setAttribute('selector', `option-${index}`)

    ansInput.appendChild(radioInput);
    ansInput.appendChild(answerInput);
    // ansInput.appendChild(answerI);

    ansInput.innerHTML += `
        <i class="fa-solid fa-xmark" onclick="deleteItem('option-${parentId}-${index}')"></i>
    `;

    answerContainer.appendChild(ansInput);

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
    let allExam = JSON.parse(localStorage.getItem('exam'));

    if (!localStorage.getItem('exam'))
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
                show(finishPag, true);
                btnTakeQuiz.style.display = 'none'
                btnBuilder.style.display = 'none'
                /* result and degree */
                resultDegree.innerHTML = degreeResult;
                let degreeInHtml = allExam.length;

                degree.innerHTML = degreeInHtml
                if (degreeResult === degreeInHtml || degreeResult >= (.85 * degreeInHtml)) {
                    massegeResult.innerHTML = 'Excellent';
                    massegeResult.style.color = 'green';
                    resultDegree.style.color = 'green';
                } else if (degreeResult > (degreeInHtml / 2) && degreeResult < (.85 * degreeInHtml)) {
                    massegeResult.innerHTML = 'Good';
                    massegeResult.style.color = 'orange';
                    resultDegree.style.color = 'orange';
                } else if (degreeResult === (degreeInHtml / 2)) {
                    massegeResult.innerHTML = 'Acceptable';
                    massegeResult.style.color = '#c2c23b';
                    resultDegree.style.color = '#c2c23b';
                } else {
                    massegeResult.innerHTML = 'Fails';
                    massegeResult.style.color = 'red';
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
function showDataInBuilder() {
    let allExam = JSON.parse(localStorage.getItem('exam'));
    if (!localStorage.getItem('exam'))
        return;

    allExam.forEach(function (el, id) {
        console.log(el)
        // question
        let card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', `parent-${parentId}`)
        // head card 
        let divh = document.createElement('div');
        divh.classList.add('head-card');
        divh.innerHTML = `
        <p>QUESTION <span class="counter-quiz">: ${parentId}</span></p>
        <i selector="parent-${parentId}" clss="delete" class="fas fa-trash"></i>
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
        ;



        // Add To card
        card.appendChild(divh);
        card.appendChild(divQuest);
        card.appendChild(ansCont);
        inputQuest.value = el.text;/*  target   */

        // ========================
        // Answer
        // ========================
        el.options.forEach(function (e, i) {
            let index = ansCont.children.length + 1;
            let ansInput = document.createElement('div');
            ansInput.classList.add('answer-input');
            ansInput.id = `option-${parentId}-${index}`
            let radioInput = document.createElement('input');
            radioInput.type = 'radio'
            radioInput.style = `cursor: pointer;`
            radioInput.classList.add('radio');
            radioInput.checked = e == el.correctAnswer;
            radioInput.setAttribute('name', `option_${parentId}`)
            let answerInput = document.createElement('input');
            answerInput.type = "text";
            answerInput.classList.add('answer');
            answerInput.setAttribute('placeholder', `option ${index}`)

            ansInput.appendChild(radioInput);


            let answerI = document.createElement('i');
            answerI.className = 'fa-solid fa-xmark';
            answerI.setAttribute('selector', `option-${parentId}-${index}`);
            answerI.onclick = function () {
                deleteItem(`option-${parentId}-${index}`);
            };

            ansInput.appendChild(answerInput);

            ansInput.appendChild(answerI);
            ansCont.appendChild(ansInput);

            answerInput.value = e


            console.log(answerInput.value = e)
        })

        let addOption = document.createElement('div');
        addOption.classList.add('add-option');

        addOption.setAttribute('parent-id', parentId);

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
        parentId++
    })
    saveToLocalStorage.style.display = 'block';

}
/* -------------------------------------
Events
------------------------------------- */
btnStart.addEventListener('click', function () {
    takeQuiz.classList.add('active');
    show(welcome, false)
    show(sectionTakeQuiz, true)
    moveElement.style.display = 'flex';
    finishPag.style.display = 'none';
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
btnTakeQuiz.addEventListener('click', function () {
    this.classList.add('active');
    btnBuilder.classList.remove('active');

    show(welcome, false);
    show(sectionTakeQuiz, true);

    show(sectionBuilder, false);
    finishPag.style.display = 'none';
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
btnBuilder.addEventListener('click', function () {
    btnTakeQuiz.classList.remove('active');
    this.classList.add('active');
    show(welcome, false);
    show(sectionBuilder, true)
    show(sectionTakeQuiz, false)
    show(moveElement, false)
    finishPag.style.display = 'none';

})
btnAddQuiz.addEventListener('click', function () {
    repeatQuiz();
    btnAddAnswer = parentCards.querySelectorAll('.add-option');

    window.scrollBy({
        top: 600,
        behavior: "smooth"
    })
    let answers = document.querySelectorAll('.question-content input');
    answers[answers.length - 1].focus();
    show(saveToLocalStorage, true)
})
// ----------------------
// btn save
// ----------------------
saveToLocalStorage.addEventListener('click', function (e) {
    let arrCards = [];
    document.querySelectorAll(`.paren-cards .card`).forEach(function (card) {
        arrCards.push(collectData(card)) // Push object for question
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
        whyErorr.innerHTML = 'Aquestion must have at least 2 options.';
        window.scrollBy({
            top: -99999,
            behavior: "smooth"
        })
        return;
    } else if (hasDuplicate) {
        errorBuilder.style.display = 'block';
        whyErorr.innerHTML = 'Each question must have at least 2 options.';
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        return;
    } else if (notCorrect) {
        errorBuilder.style.display = 'block';
        whyErorr.innerHTML = 'Choise Correct Answer.';
        window.scrollBy({
            top: -99999,
            behavior: "smooth"
        })
        return;
    } else if (hasEmpty) {
        errorBuilder.style.display = 'block';
        whyErorr.innerHTML = 'you have option is empty';
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
})
// Add Lister to add option
document.addEventListener('click', function (e) {
    const target = e.target.closest('[parent-id]');
    if (!target) return;

    const parentId = target.getAttribute('parent-id');
    repeatAnswer(parentId)
    let answers = this.querySelectorAll('.answer');
    answers[answers.length - 1].focus();
    window.scrollBy({

        behavior: "smooth"
    })
});
// Add Lister to Delete Item
document.addEventListener('click', function (e) {
    const target = e.target.closest('[selector]');
    if (!target) return;

    const selector = target.getAttribute('selector');
    deleteItem(selector)

    // Check if no cards hide save to local storage
});
document.getElementById('reset-all').addEventListener('click', function (e) {
    document.querySelector('.paren-cards').innerHTML = '';
    parentId = 1;
    localStorage.clear()
    show(saveToLocalStorage, false)
    errorBuilder.style.display = 'none';
})
getFromlocalStorage();
showDataInBuilder();


// function corectAnswer() {
//     let divWrong = document.createElement('div');
//     divWrong.classList.add('wrong')
//     divWrong.innerHTML = `<i class="fa-solid fa-xmark" style="color: red;"></i>`
//     let inputWrong = document.createElement('input');

//     let divRight = document.createElement('div');
//     divRight.classList.add('right')
//     divRight.innerHTML = `<i class="fa fa-arrow-right" style="color: green;"></i>`

//     knowCorrectAnswer.appendChild(divWrong);
//     knowCorrectAnswer.appendChild(divRight);

// }
// corectAnswer()
