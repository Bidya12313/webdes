const QUESTIONS_COUNT = 10; 
let currentLevel = "";

// Початок тесту
document.getElementById("start-test").addEventListener("click", () => {
  const userName = document.getElementById("name").value;
  const userGroup = document.getElementById("group").value;

  if (userName && userGroup) {
    document.getElementById(
      "user-info"
    ).innerText = `${userName} (${userGroup}) - HTML Test`;
    document.getElementById("welcome-section").style.display = "none";
    document.getElementById("level-section").style.display = "block";
  } else {
    alert("Please enter your name and group.");
  }
});

// Обирання рівню тесту
document.querySelectorAll(".level-btn").forEach((levelButton) => {
  levelButton.addEventListener("click", (e) => {
    currentLevel = e.target.dataset.level;
    document.getElementById("level-section").style.display = "none";
    loadQuestions(currentLevel);
  });
});

// Завантаження питань відповідно до вибраного рівня
async function loadQuestions(level) {
  const levelFiles = {
    easy: "easy-level.JSON",
    middle: "middle-level.JSON",
    hard: "hard-level.JSON",
  };

  try {
    const response = await fetch(levelFiles[level]);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const questions = data.questions;

    // Обрізаємо 10 випадкових питань
    const randomQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, QUESTIONS_COUNT);

    renderQuestions(randomQuestions);
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// Відображення питань
function renderQuestions(questions) {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    let questionHTML = `<div class="question" id="question-${q.id}"><p>${
      index + 1
    }. ${q.question}</p>`;

    if (q.type === "radio") {
      q.options.forEach((option, i) => {
        questionHTML += `
          <label>
            <input type="radio" name="q${q.id}" value="${i}">   
            ${option}
          </label><br>
        `;
      });
    } else if (q.type === "checkbox") {
      q.options.forEach((option, i) => {
        questionHTML += `
          <label>
            <input type="checkbox" name="q${q.id}" value="${i}">
            ${option}
          </label><br>
        `;
      });
    } else if (q.type === "dropdown") {
      questionHTML += `<select name="q${q.id}">`;
      q.options.forEach((option, i) => {
        questionHTML += `<option value="${i}">${option}</option>`;
      });
      questionHTML += `</select>`;
    } else if (q.type === "drag-and-drop") {
      questionHTML += `<div class="drag-drop-container">`;

      // Отримуємо елементи для перетягування
      const dragItems = Object.keys(q.pairs).map( 
        (key, index) =>
          `<div class="drag-item" id="drag${q.id}-${index}" draggable="true" data-key="${key}">${key}</div>`
      );

      questionHTML += `<div class="drag-items">${dragItems.join("")}</div>`;
      questionHTML += `<div class="drop-items">`;

      Object.values(q.pairs).forEach((value) => {
        questionHTML += `
      <div class="drop-row">
        <div class="drop-definition">${value}</div>
        <div class="drop-item" data-value="${value}"></div>
      </div>
    `;
      });

      questionHTML += `</div>`;
      questionHTML += `</div>`;
    } else if (q.type === "text") {
      questionHTML += `
    <label for="q${q.id}">
      <input type="text" id="q${q.id}" name="q${q.id}" placeholder="${
        q.placeholder || "Enter your answer here..."
      }">
    </label>
    `;
    }
    questionHTML += `</div>`;
    container.innerHTML += questionHTML;
  });

  document.getElementById("test-section").style.display = "block";

  questions.forEach((q) => {
    if (q.type === "drag-and-drop") {
      const questionContainer = document.getElementById(`question-${q.id}`);
      initializeDragAndDrop(questionContainer);
    }
  });
  
  // Обробка результату після натискання кнопки Submit
  document.getElementById("test-form").addEventListener("submit", (e) => {
    e.preventDefault();
    calculateScore(questions);
  });
}

// Ініціалізація drag-and-drop
function initializeDragAndDrop(questionContainer) {
  const dragItems = questionContainer.querySelectorAll(".drag-item");
  const dropItems = questionContainer.querySelectorAll(".drop-item");
  const originalContainer = questionContainer.querySelector(".drag-items");

  dragItems.forEach((drag) => {
    drag.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("id", e.target.id);
      e.dataTransfer.setData("question-id", questionContainer.id);
    });
  });

  dropItems.forEach((drop) => {
    drop.addEventListener("dragover", (e) => {
      e.preventDefault(); 
    });

    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("id"); 
      const draggedQuestionId = e.dataTransfer.getData("question-id"); 
      const draggedElement = document.getElementById(draggedId);

      if (draggedQuestionId !== questionContainer.id) {
        alert("You can't drop this item here! It belongs to a different question.");
        return;
      }

      if (!e.target.hasChildNodes() && draggedElement) {
        e.target.appendChild(draggedElement);
        e.target.setAttribute("data-matched", draggedElement.dataset.key); 
        if (!originalContainer.hasChildNodes()) {
           addPlaceholder(originalContainer);;
        }
      }
    });
  });
  
  // Якщо елемент потрібно повернути в список
  originalContainer.addEventListener("dragover", (e) => {
    e.preventDefault(); 
  });

  originalContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("id");
    const draggedQuestionId = e.dataTransfer.getData("question-id"); 
    const draggedElement = document.getElementById(draggedId); 

    removePlaceholder(originalContainer);
    if (draggedQuestionId !== questionContainer.id) {
      alert("You can't drop this item here! It belongs to a different question.");
      return;
    }
    
    if (draggedElement) {
      originalContainer.appendChild(draggedElement);
      const previousDrop = Array.from(dropItems).find(
        (drop) => drop.firstChild && drop.firstChild.id === draggedId
      );

      if (previousDrop) {
        previousDrop.removeAttribute("data-matched"); 
      }
    }
  });
  
  function addPlaceholder(container) {
    container.classList.add("empty-placeholder");
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = "Drag items here";
    container.appendChild(placeholder);
  }

  function removePlaceholder(container) {
    container.classList.remove("empty-placeholder");
    const placeholder = container.querySelector(".placeholder");
    if (placeholder) {
      container.removeChild(placeholder);
    }
  }
}

// Підрахунок результатів
function calculateScore(questions) {
  let score = 0;

  questions.forEach((q) => {
    if (q.type === "radio") {
      const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (selected && q.correct.includes(parseInt(selected.value))) {
        score += 1;
      }
    } else if (q.type === "checkbox") {
      const selected = document.querySelectorAll(`input[name="q${q.id}"]:checked`);
      const userAnswers = Array.from(selected).map((input) =>
        parseInt(input.value)
      );
      if (JSON.stringify(userAnswers.sort()) === JSON.stringify(q.correct.sort())) {
        score += 1;
      }
    } else if (q.type === "dropdown") {
      const selected = document.querySelector(`select[name="q${q.id}"]`).value;
      if (q.correct.includes(parseInt(selected))) {
        score += 1;
      }
    } else if (q.type === "drag-and-drop") {
      const dropItems = document.querySelectorAll(`.drop-item`);
      let isCorrect = true;

      dropItems.forEach((drop) => {
        const expectedValue = drop.getAttribute("data-value");
        const matchedKey = drop.getAttribute("data-matched");

        if (matchedKey !== expectedValue) {
          isCorrect = false;
        }
      });

      if (isCorrect) {
        score += 1;
      }
    } else if (q.type === "text") {
      const userInput = document
        .querySelector(`input[name="q${q.id}"]`)
        .value.trim();
      if (q.correct.includes(userInput)) {
        score += 1; 
      }
    }
  });

  document.getElementById("test-section").style.display = "none";
  document.getElementById("results-section").style.display = "block";
  document.getElementById("score").innerText = `Your score: ${score} / ${QUESTIONS_COUNT}`;
}
