(function () {
    // выносим сюда чтобы доступна была для всех функций
    let todoItemsDefault = JSON.parse(localStorage.getItem("todoItems"));
  
    // Создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
      let appTitle = document.createElement("h2");
      appTitle.innerHTML = title;
      return appTitle;
    }
  
    // Создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
      let form = document.createElement("form");
      let input = document.createElement("input");
      let buttonWrapper = document.createElement("div");
      let button = document.createElement("button");
  
      form.classList.add("input-group", "mb-3");
      input.classList.add("form-control");
      input.placeholder = "Введите название нового дела";
      buttonWrapper.classList.add("input-group-append");
      button.classList.add("btn", "btn-primary");
      button.textContent = "Добавить дело";
      button.disabled = true;
  
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);
  
      input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.value.length > 0) {
          button.disabled = false;
        } else if (input.value.length == 0) {
          button.disabled = true;
        }
      });
  
      return {
        form,
        input,
        button,
      };
    }
  
    // Создаём и возвращаем список элементов
    function createTodoList() {
      let list = document.createElement("ul");
      list.classList.add("list-group");
      return list;
    }
  
    // Записываем новое состояние приложения в localstorage
    function setItLocal(newState) {
      localStorage.setItem("todoItems", JSON.stringify(newState));

      // дополнительные ключи
      localStorage.setItem("secondKey", JSON.stringify(newState));
      localStorage.setItem("thirdKey", JSON.stringify(newState));

    }
  
    function createTodoItem(name, done) {
      let item = document.createElement("li");
      // Кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement("div");
      let doneButton = document.createElement("button");
      let deleteButton = document.createElement("button");
  
      // Устанавливаем стили для элемента сиписка, а так же для размещения кнопок
      // в его правой части с помощью flex
      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      item.textContent = name;
  
      buttonGroup.classList.add("btn-group", "btn-group-sm");
      doneButton.classList.add("btn", "btn-success");
      doneButton.textContent = "Готово";
      // data атрибут укажет кому конкретно принадлежит нажатая кнопка
      doneButton.dataset.name = name;
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Удалить";
      // data атрибут укажет кому конкретно принадлежит нажатая кнопка
      deleteButton.dataset.name = name;
  
      // Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
  
      if (done == true) {
        item.classList.add("list-group-item-success");
      }
  
      // помещаем обработчики событий в цикл и пробегаемся по объектам в массиве todoItemsDefault,
      // благодаря data атрибуту мы знаем какой объект нужно перезаписать
      for (let todoItem of todoItemsDefault) {
        doneButton.addEventListener("click", function () {
          if (todoItem.name == this.dataset.name) {
            item.classList.toggle("list-group-item-success");
            let index = todoItemsDefault.indexOf(todoItem);
            todoItemsDefault[index].done = todoItem.done ? false : true;
            setItLocal(todoItemsDefault);
          }
        });

  
        deleteButton.addEventListener("click", function () {
          if (todoItem.name == this.dataset.name && confirm("Вы уверены?")) {
            item.remove();
            todoItemsDefault.splice(todoItemsDefault.indexOf(todoItem), 1);
            setItLocal(todoItemsDefault);
          }
        });
      }
  
      // Приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
      return {
        item,
        doneButton,
        deleteButton,
      };
    }
  
    function createTodoApp(container, title = "Список дел", arrayCases) {
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();
  
      if (localStorage.getItem("todoItems") == null) {
        setItLocal(arrayCases);
      }
    //   if (localStorage.getItem("todoItemsMom") == null) {
    //     setItLocal(arrayCases);
    //   }
    //   if (localStorage.getItem("todoItemsDad") == null) {
    //     setItLocal(arrayCases);
    //   }

  
      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
  
      for (let todoItem of todoItemsDefault) {
        let todoItemElem = createTodoItem(todoItem.name, todoItem.done);
  
        todoList.append(todoItemElem.item);
      }
  
      // Браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
      todoItemForm.form.addEventListener("submit", function (e) {
        // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
        // В данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
        e.preventDefault();
  
        // Игнорируем создание элемента, если пользователь ничего не ввел в поле
        if (!todoItemForm.input.value) {
          return;
        }

        
  
        // ***пушим новый объект с параметрами элемента в масив***
        todoItemsDefault = JSON.parse(localStorage.getItem("todoItems", ))
        todoItemsDefault.push({
          name: todoItemForm.input.value,
          done: false,
        });
      
        // ***записали в localstorge***
        setItLocal(todoItemsDefault);
  
        let todoItem = createTodoItem(todoItemForm.input.value);
        // Создаём и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItem.item);
        // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = "";
      });
    }
  
    window.createTodoApp = createTodoApp;
  })();