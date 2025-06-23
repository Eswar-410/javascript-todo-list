let getDetails = document.getElementById('get-details');
let add = document.getElementById('add');
let todo = document.getElementById('todo-div');
let items = [];
let number = 1;
let todoData = JSON.parse(localStorage.getItem('todos')) || [];

todoData.forEach(({ content, timestamp }) => {
    getTime(timestamp);
    makeCard(content);
});


add.addEventListener('click', (event) => {
    event.stopPropagation();
    if (getDetails.value.length === 0) {
        alert('Please insert your details')
    }
    else if (add.textContent === 'update') {
        getTime();
        makeCard(getDetails.value)

        todoData.push({
            content: getDetails.value,
            timestamp: timeNow.textContent
        });

        localStorage.setItem('todos', JSON.stringify(todoData));

        getDetails.value = '';
        add.textContent = 'ADD';
        add.style.background = 'darkOrange';
        add.style.color = 'white';
    }
    else {
        getTime();
        makeCard(getDetails.value);
        todoData.push({
            content: getDetails.value,
            timestamp: timeNow.textContent
        });
        localStorage.setItem('todos', JSON.stringify(todoData));
        getDetails.value = '';
    }
})
function makeCard(content) {

    let div = document.createElement('div');
    div.className = 'append-item';
    div.dataset.id = number;
    number++;
    todo.appendChild(div);
    items.push(div);

    let subDiv = document.createElement('div');
    subDiv.className = 'segregate-content';
    let subDiv2 = document.createElement('div');
    subDiv2.className = 'add-options';

    let checkBox = document.createElement('input');
    checkBox.type = "checkBox";
    checkBox.className = 'check';

    div.appendChild(checkBox);
    div.appendChild(subDiv);
    div.appendChild(subDiv2)
    subDiv.appendChild(timeNow);

    let p = document.createElement('p');
    p.textContent = content;
    p.style.marginTop = '5px';
    subDiv.appendChild(p);

    let options = document.createElement('i');
    options.classList.add("fa-solid", "fa-bars",'icon-style');
    subDiv2.appendChild(options);

    checkBox.addEventListener('click', (event) => {
        event.stopPropagation();
        if (checkBox.checked) {
            p.style.textDecoration = 'line-through';
            p.style.color = 'gold';
        }
        else {
            p.style.textDecoration = 'none';
            p.style.color = 'white';
        }
    })

    options.addEventListener('click', () => {
        subDiv2.removeChild(options);
        subDiv2.className = 'options-request';

        let edit = document.createElement('i');
        edit.classList.add('fa-solid', 'fa-pen-to-square','icon-style');
        subDiv2.appendChild(edit);

        let trash = document.createElement('i');
        trash.classList.add('fa-solid', 'fa-trash','icon-style');
        subDiv2.appendChild(trash);

        let manipulate = document.createElement('i');
        manipulate.classList.add('fa-solid', 'fa-sliders','icon-style');
        subDiv2.appendChild(manipulate);

        trash.addEventListener('click', function deleteNow(event) {
            event.stopPropagation();
            let id = div.dataset.id;
            for (index = 0; index < items.length; index++) {
                if (items[index].dataset.id === id) {
                    div.remove();
                    items.splice(index, 1);
                    todoData.splice(index, 1);
                    localStorage.setItem('todos', JSON.stringify(todoData));
                }
            }
        })

        edit.addEventListener('click', (event) => {
            event.stopPropagation();
            getDetails.value = p.textContent;
            add.textContent = 'update';
            add.style.background = 'lightgreen';
            add.style.color = 'black';
            div.remove();
        })

        manipulate.addEventListener('click', (event) => {
            let targeted = event.target.closest(".append-item");
            targeted = items.indexOf(targeted);
            trash.remove();
            edit.remove();
            manipulate.remove();

            let field = document.createElement('input');

            field.type = 'text';
            field.style.display = 'flex';
            field.placeholder = 'position...';
            field.id='handle-order';
            subDiv2.className = 'handle-input';
            

            subDiv2.appendChild(field);
            subDiv2.style.alignContent = 'center';

            field.addEventListener('keyup', (event) => {
                event.stopPropagation();

                if (event.key == 'Enter') {
                    let val = Number(field.value);
                    if (val > 0 && val <= items.length && !isfloat(String(val))) {
                        if (targeted < val) {
                            todo.insertBefore(items[targeted], items[val - 1].nextSibling);
                        }
                        else {
                            todo.insertBefore(items[targeted], items[val - 1]);
                        }
                        const [movedOne] = items.splice(targeted, 1);
                        items.splice(val - 1, 0, movedOne);
                        subDiv2.appendChild(options);
                        subDiv2.className = 'add-options';
                        subDiv2.removeChild(field)
                    }
                    else {
                        alert('Select appropriate value');
                    }
                }
            })
        })
    })
}
function getTime(existingTime) {

    timeNow = document.createElement('p');

    if (existingTime) {
        timeNow.textContent = existingTime;
    }
    else {
        const time = new Date();
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0'); // since 0-Indexed
        const day = String(time.getDate()).padStart(2, '0');
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        timeNow.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    timeNow.style.height = '20px';
}
function isfloat(num) {
    return num.includes('.') && !Number.isNaN(num);
}







