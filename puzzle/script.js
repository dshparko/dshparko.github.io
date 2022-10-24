const container = document.createElement("div");
container.classList.add("container");
document.body.prepend(container);

function createRandomArray(size) {
  return [...Array(size * size).keys()].sort(() => Math.random() - 0.5);
}

function createField(size, fieldSize) {
  let arr = createRandomArray(size);
  let count = 0;

  const field = document.createElement("div");
  field.classList.add("field");
  field.style.width = `${fieldSize}px`;
  field.style.height = `${fieldSize}px`;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      cell.innerHTML = arr[count];
      const newSize = fieldSize / size;
      const top = `${newSize * i}px`;
      const left = `${newSize * j}px`;

      cell.style.top = top;
      cell.style.left = left;
      cell.style.width = `${newSize}px`;
      cell.style.height = `${newSize}px`;

      field.append(cell);
      count++;
    }
  }
  const fieldBlock = document.createElement("div");
  fieldBlock.classList.add("field-block");
  field.append(fieldBlock);

  return field;
}

function addFieldInPage(size, fieldSize) {
  let field = document.querySelector(".field");

  if (field) {
    container.innerHTML = "";
    container.append(createField(size, fieldSize));
  } else {
    container.append(createField(size, fieldSize));
  }

  const cells = document.querySelectorAll(".cell");

  cells.forEach((item) => {
    if (item.innerHTML === "0") {
      item.classList.add("empty-cell");
      item.innerHTML = "";
    }

    if (!item.classList.contains("empty-cell")) {
      item.style.outline = "1px solid black";
    }
  });

  return size;
}

addFieldInPage(4, 700);

function findChildEmptyCeil(size) {
  const cells = document.querySelectorAll(".cell");
  const cell = document.querySelector(".empty-cell");

  const fieldArr = [];
  let arr = [];

  for (let i = 0; i < cells.length; i++) {
    arr.push(cells[i]);
    if (arr.length === size) {
      fieldArr.push(arr);
      arr = [];
    }
  }

  let prevChild = null,
    nextChild = null,
    upChild = null,
    downChild = null;
  let a = fieldArr,
    n = (m = size);

  function isValidPos(i, j, n, m) {
    return i < 0 || j < 0 || i > n - 1 || j > m - 1 ? 0 : 1;
  }

  for (let i = 0; i < fieldArr.length; i++) {
    for (let j = 0; j < fieldArr[i].length; j++) {
      if (a[i][j] == cell) {
        if (isValidPos(i, j + 1, n, m)) {
          nextChild = a[i][j + 1];
        }
        if (isValidPos(i + 1, j, n, m)) {
          downChild = a[i + 1][j];
        }
        if (isValidPos(i - 1, j, n, m)) {
          upChild = a[i - 1][j];
        }
        if (isValidPos(i, j - 1, n, m)) {
          prevChild = a[i][j - 1];
        }
      }
    }
  }
  return {
    prevChild,
    nextChild,
    upChild,
    downChild,
  };
}
let seconds = 0;
let minutes = 0;
// Timer Function
chronometer = setInterval(function () {
  ++seconds;
  if (seconds < 10) time.textContent = `Time ${minutes}:0${seconds} `;
  if (seconds >= 10 && seconds < 60)
    time.textContent = `Time ${minutes}:${seconds} `;
  if (seconds == 60) {
    ++minutes;
    seconds = 0;
    time.textContent = `Time ${minutes}:00`;
  }
}, 1000);
container.addEventListener("click", funMovingCell);

function funMovingCell(EO) {
  //  const timeCount = document.querySelector(".time span");

  const cells = document.querySelectorAll(".cell");
  const movesCount = document.querySelector(".moves span");
  let isClicked = true;
  let { prevChild, nextChild, upChild, downChild } = findChildEmptyCeil(
    Math.pow(cells.length, 0.5)
  );

  let cell = document.querySelector(".empty-cell"),
    cellTop = cell.offsetTop;
  cellLeft = cell.offsetLeft;
  let elEvent = EO.target,
    elTop = elEvent.offsetTop;
  elLeft = elEvent.offsetLeft;
  let count = +movesCount.innerHTML;

  if (
    elEvent == prevChild ||
    elEvent == nextChild ||
    elEvent == upChild ||
    (elEvent == downChild && isClicked)
  ) {
    movesCount.innerHTML = ++count;
    isClicked = false;

    elEvent.style.top = cellTop + "px";
    elEvent.style.left = cellLeft + "px";
    elEvent.style.transition = ".5s";

    cell.style.top = elTop + "px";
    cell.style.left = elLeft + "px";

    elEvent.addEventListener("transitionend", funTransitionEnd);
    function funTransitionEnd(e) {
      let clonedCell = cell.cloneNode(true);
      let clonedElEvent = elEvent.cloneNode(true);

      elEvent.parentElement.replaceChild(clonedCell, elEvent);
      cell.parentElement.replaceChild(clonedElEvent, cell);

      if (gameOver()) {
        gameOverPopap();
        saveIsEnabled();
      } else {
        saveIsDisabled();
      }
      isClicked = true;
      elEvent.removeEventListener("transitionend", funTransitionEnd);
    }
  }
}

const menu = document.createElement("div");
const shuffle = document.createElement("div");
(stop = document.createElement("div")),
  (save = document.createElement("div")),
  (sound = document.createElement("div"));

menu.classList.add("menu");
shuffle.classList.add("shuffle");
stop.classList.add("stop");
save.classList.add("save");
sound.classList.add("sound");

menu.prepend(save);
menu.prepend(stop);
menu.prepend(shuffle);
menu.prepend(sound);

document.body.prepend(menu);

shuffle.innerHTML = "Shuffle and restart";
stop.innerHTML = "Stop";
save.innerHTML = "Save";
sound.innerHTML = "Sound";

const movesAndTime = document.createElement("div");
const moves = document.createElement("div"),
  time = document.createElement("div");

movesAndTime.classList.add("movesAndTime");
moves.classList.add("moves");
time.classList.add("time");

movesAndTime.prepend(time);
movesAndTime.prepend(moves);

document.body.prepend(movesAndTime);

moves.innerHTML = "Moves:<span>0</span>";
time.innerHTML = "Time:<span>00:00</span>";

const otherSize = document.createElement("div");
otherSize.classList.add("other-size");

document.body.prepend(otherSize);

otherSize.innerHTML = `Other size:  <span>3&times;3</span>  <span class="other-size_active">4&times;4</span>  <span>5&times;5</span>  <span>6&times;6</span>  <span>7&times;7</span>  <span>8&times;8</span>`;

const sizes = document.querySelectorAll(".other-size span");

shuffle.addEventListener("click", () => {
  const field = document.querySelector(".field");
  const cells = document.querySelectorAll(".cell");
  const size = Math.pow(cells.length, 0.5);
  let cellWidth = field.offsetWidth;
  const movesCount = document.querySelector(".moves span");
  movesCount.innerHTML = 0;
  addFieldInPage(size, cellWidth);
  saveIsDisabled();
  //clearInterval(chronometer);
});
const on = true;
sound.addEventListener("click", () => {
  audio = document.createElement('audio');
  audio.src = 'sounds/moving.mp3';
  
  audio.currentTime = 0;
  audio.play();
  alert("dsfgdfs");
});

sizes.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const field = document.querySelector(".field");
    const movesCount = document.querySelector(".moves span");
    if (!item.classList.contains(".other-size_active")) {
      let answer = confirm("Are you sure to resize and restart?");
      if (answer) {
        let activeEl = document.querySelector(".other-size_active");
        activeEl.classList.remove("other-size_active");
        item.classList.add("other-size_active");

        movesCount.innerHTML = 0;
        if (item.innerHTML[0] === "3") {
          addFieldInPage(3, field.offsetWidth);
        } else if (item.innerHTML[0] === "4") {
          addFieldInPage(4, field.offsetWidth);
        } else if (item.innerHTML[0] === "5") {
          addFieldInPage(5, field.offsetWidth);
        } else if (item.innerHTML[0] === "6") {
          addFieldInPage(6, field.offsetWidth);
        } else if (item.innerHTML[0] === "7") {
          addFieldInPage(7, field.offsetWidth);
        } else if (item.innerHTML[0] === "8") {
          addFieldInPage(8, field.offsetWidth);
        }
      }
    }
    saveIsDisabled();
  });
});

function gameOver() {
  const cells = document.querySelectorAll(".cell");

  let winValues = "";

  switch (cells.length) {
    case 9:
      winValues = "123456780";
      break;
    case 16:
      winValues = "1234567891011121314150";
      break;
    case 25:
      winValues = "1234567891011121314151617181920212223240";
      break;
    case 36:
      winValues =
        "12345678910111213141516171819202122232425262728293031323334350";
      break;
    case 49:
      winValues =
        "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647480";
      break;
    case 64:
      winValues =
        "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162630";
      break;
  }
  let cellsValues = "";

  cells.forEach((item) => {
    if (item.innerHTML === "") {
      cellsValues += "0";
    } else {
      cellsValues += `${item.innerHTML}`;
    }
  });

  return winValues === cellsValues ? true : false;
}

function gameOverPopap() {
  const backgroundPopap = document.createElement("div");
  const popap = document.createElement("div");
  const closePopap = document.createElement("div");
  backgroundPopap.classList.add("background-popap");
  popap.classList.add("popap");
  closePopap.classList.add("close-popap");

  backgroundPopap.append(popap);
  backgroundPopap.append(closePopap);
  document.body.prepend(backgroundPopap);

  const countMoves = document.querySelector(".moves span").innerHTML;
  const currTime = document.querySelector(".time span").innerHTML;

  popap.innerHTML = `
    Hooray!<br> 
    You solved the puzzle 
    in <span class="count-moves">${currTime}</span> and <span class="curr-time">${countMoves}</span> moves!
    `;
  closePopap.innerHTML = "&times;";
}

function saveIsEnabled() {
  const save = document.querySelector(".save");
  save.classList.add("save-active");

  const backgroundPopap = document.querySelector(".background-popap");
  backgroundPopap.addEventListener("click", funBackgroundPopapClose);
  function funBackgroundPopapClose(e) {
    e.preventDefault();
    e.currentTarget.remove();
    backgroundPopap.removeEventListener("click", funBackgroundPopapClose);

    const fieldBlock = document.querySelector(".field-block");
    fieldBlock.style.display = "block";
  }
}

function saveIsDisabled() {
  const save = document.querySelector(".save");
  if (save.classList.contains("save-active")) {
    save.classList.remove("save-active");
  }
}

save.addEventListener("click", (e) => {
  if (save.classList.contains("save-active")) {
    const fieldBlock = document.querySelector(".field-block");
    fieldBlock.style.display = "none";
    saveIsDisabled();
  }
});
