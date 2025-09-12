let btn = document.querySelector("button");
let inp = document.querySelector("input");
let ul = document.querySelector("ul");

let editMode = false; // track whether we are editing
let taskBeingEdited = null; // store which li is being edited

btn.addEventListener("click", function(){
    let taskText = inp.value;

    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    if (editMode) {
        // update existing task
        taskBeingEdited.firstChild.textContent = taskText + " ";
        editMode = false;
        taskBeingEdited = null;
        btn.textContent = "Add Task";
    } else {
        // create new task
        let item = document.createElement("li");
        item.innerHTML = `${taskText} `;

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("edit");

        let delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("delete");

        item.appendChild(editBtn);
        item.appendChild(delBtn);

        ul.appendChild(item);
    }

    inp.value = "";
});

ul.addEventListener("click", function(event){
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
    }

    if (event.target.classList.contains("edit")) {
        editMode = true;
        taskBeingEdited = event.target.parentElement;
        inp.value = taskBeingEdited.firstChild.textContent; // prefill input
        btn.textContent = "Update Task"; // change button text
        inp.focus();
    }
});
