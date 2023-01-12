$(document).ready(function () {

        class User {
            constructor(id, name, password, age, city, roles) {
                this.id = id;
                this.name = name;
                this.password = password;
                this.age = age;
                this.city = city;
                this.roles = roles;
            }
        }

        class Role {
            constructor(id, name) {
                this.id = id;
                this.name = name;
            }
        }

        let roleSet = [
            {id: 1, role: "ROLE_ADMIN"},
            {id: 2, role: "ROLE_USER"}
        ];

        //Заполнение таблицы данными и кнопками
        run();

        async function run() {
            await fillCurrentUser();
            let response = await fetch("http://localhost:8080/admin/users");
            let users = await response.json();
            fillTable(users);
            addEditAndDeleteEventListeners();
        }

        function fillTable(users) {
            let tableBody = document.getElementsByTagName("tbody")[0];
            $("#usersTable tbody tr").remove();
            for (let i = 0; i < users.length; i++) {
                let row = tableBody.insertRow();
                let cellId = row.insertCell();
                let cellName = row.insertCell();
                let cellAge = row.insertCell();
                let cellCity = row.insertCell();
                let cellRoles = row.insertCell();
                let cellEdit = row.insertCell();
                let cellDelete = row.insertCell();
                cellId.innerHTML = users[i].id;
                cellName.innerHTML = users[i].name;
                cellAge.innerHTML = users[i].age;
                cellCity.innerHTML = users[i].city;
                let roles = "";
                for (let k = 0; k < users[i].roles.length; k++) {
                    roles += users[i].roles[k].role.replace("ROLE_", "") + " ";
                }
                cellRoles.innerHTML = roles;
                let editButton = document.createElement("BUTTON");   // Create a <button> element
                editButton.innerHTML = "Edit";
                editButton.className = "btn btn-info";
                editButton.value = users[i].id;
                editButton.name = "Edit";
                editButton.type = "button";
                cellEdit.appendChild(editButton);
                let deleteButton = document.createElement("BUTTON");   // Create a <button> element
                deleteButton.innerHTML = "Delete";
                deleteButton.className = "btn btn-danger";
                deleteButton.value = users[i].id;
                deleteButton.name = "Delete";
                deleteButton.type = "button";
                cellDelete.appendChild(deleteButton);
            }
        }

        function addEditAndDeleteEventListeners() {
            let buttons = $("table button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function () {
                    showModel(buttons[i]);
                });
            }
        }

        //Заполнение модальных окон кнопок
        async function showModel(button) {
            await fillModel(button.value);
            if (button.name === "Edit") {
                getEditModel(button.value);
            } else {
                getDeleteModel(button.value);
            }
            $("#userInfo").modal("show");
        }

        async function fillModel(id) {
            let responseUser = await fetch("http://localhost:8080/admin/users/" + id);
            let responseRole = await fetch("http://localhost:8080/admin/role");
            let user = await responseUser.json();
            let roles = await responseRole.json();
            $("#userInfo #id").val(user.id);
            $("#userInfo .name").val(user.name);
            $("#userInfo .age").val(user.age);
            $("#userInfo .city").val(user.city);
            let select = $("#userInfo #roles");
            select.empty();
            for (let i = 0; i < roles.length; i++) {
                let option = new Option(roles[i].role, roles[i].id);
                for (let j = 0; j < user.roles.length; j++) {
                    if (roles[i].id === user.roles[j].id) {
                        option.selected = true;
                    }
                }
                select.append(option);
            }
        }

        function getEditModel(id) {
            $("#userInfo .modal-header h3").text("Edit User");
            $("#userInfo .name").prop("disabled", false);
            $("#userInfo .password").prop("disabled", false);
            $("#userInfo .age").prop("disabled", false);
            $("#userInfo .city").prop("disabled", false);
            $("#userInfo #roles").prop("disabled", false);
            $("#userInfo form").attr("method", "PATCH").attr("action", "http://localhost:8080/admin/users/" + id);
            let button = $("#userInfo button");
            if (button.hasClass("btn-danger")) {
                button.removeClass("btn-danger");
                button.addClass("btn-primary")
            }
            $("#userInfo .btn-primary").text("Edit");
        }

        function getDeleteModel(id) {
            $("#userInfo .modal-header h3").text("Delete User");
            $("#userInfo .name").prop("disabled", true);
            $("#userInfo .password").prop("disabled", true);
            $("#userInfo .age").prop("disabled", true);
            $("#userInfo .city").prop("disabled", true);
            $("#userInfo #roles").prop("disabled", true);
            $("#userInfo form").attr("method", "DELETE").attr("action", "http://localhost:8080/admin/users/" + id);
            let button = $("#userInfo button");
            if (button.hasClass("btn-primary")) {
                button.removeClass("btn-primary");
                button.addClass("btn-danger")
            }
            $("#userInfo .btn-danger").text("Delete");
        }

        //Заполнение страницы текущего пользователя
        async function fillCurrentUser() {
            let responseCurrentUser = await fetch("/user/current");
            let user = await responseCurrentUser.json();
            let roles = "";
            for (let i = 0; i < user.roles.length; i++) {
                roles += user.roles[i].role.replace("ROLE_", "") + " ";
            }
            $("#company").text(user.name + " with roles: " + roles);
            fillOneUserTable(user);
        }

        function fillOneUserTable(user) {
            let tableBody = document.getElementsByTagName("tbody")[1];
            let row = tableBody.insertRow();
            let cellId = row.insertCell();
            let cellName = row.insertCell();
            let cellAge = row.insertCell();
            let cellCity = row.insertCell();
            let cellRoles = row.insertCell();
            cellId.innerHTML = user.id;
            cellName.innerHTML = user.name;
            cellAge.innerHTML = user.age;
            cellCity.innerHTML = user.city;
            let roles = "";
            for (let k = 0; k < user.roles.length; k++) {
                roles += user.roles[k].role.replace("ROLE_", "") + " ";
            }
            cellRoles.innerHTML = roles;
        }

        //Функционал вкладки добаления нового пользователя(действие)
        document.getElementById("addButton").addEventListener("click", addUser);

        async function addUser() {
            await fetch($("#user-addForm").attr("action"), {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(getUser("#user-addForm"))
            });
            run();
            clearAddForm();
            alert("New user added.");
        }

        function getUser(form) {
            let checkedRoles = () => {
                let array = []
                let options = document.querySelector('#rolesCreate').options
                for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                        array.push(roleSet[i])
                    }
                }
                return array;
            }
            let id = null;
            if (form === "#userInfo") {
                id = $(form + " #id").val();
            }
            return new User(id, $(form + " .name").val(), $(form + " .password").val(),
                $(form + " .age").val(), $(form + " .city").val(), checkedRoles());
        }

        function clearAddForm() {

            $("#user-addForm .name").val("");
            $("#user-addForm .password").val("");
            $("#user-addForm .age").val("");
            $("#user-addForm .city").val("");
        }

        //Функционал кнопок изменение/удаление (действие)
        document.getElementById("modelButton").addEventListener("click", sendRequest);

        async function sendRequest() {
            if ($("#modelButton").text() === "Edit") {
                await fetch($("#userInfo form").attr("action"), {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(getUpdateUser("#userInfo"))
                });
            } else {
                await fetch($("#userInfo form").attr("action"), {method: "DELETE"});
            }
            run();
            $("#userInfo").modal("hide");
        }

        function getUpdateUser(form) {
            let checkedRoles = () => {
                let array = []
                let options = document.querySelector('#rolesUpdate').options
                for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                        array.push(roleSet[i])
                    }
                }
                return array;
            }
            let id = $(form + " #id").val();

            return new User(id, $(form + " .name").val(), $(form + " .password").val(),
                $(form + " .age").val(), $(form + " .city").val(), checkedRoles());

            // let updatedRoles = () => {
            //     let array = []
            //     let options = document.querySelector('#rolesUpdate').options
            //     for (let i = 0; i < options.length; i++) {
            //         if (options[i].selected) {
            //             array.push(roleSet[i])
            //         }
            //     }
            //     return array;
            // }
            // return new User($(form + " .id").val(), $(form + " .name").val(), $(form + " .password").val(),
            //     $(form + " .age").val(), $(form + " .city").val(), updatedRoles());
        }
    }
)