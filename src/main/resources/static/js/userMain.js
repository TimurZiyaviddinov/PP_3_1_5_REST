$(document).ready(function () {

        fillCurrentUser();

        async function fillCurrentUser() {
            let responseCurrentUser = await fetch("/user/current");
            let user = await responseCurrentUser.json();
            let roles = "";
            for (let i = 0; i < user.roles.length; i++) {
                roles += user.roles[i].role.replace("ROLE_", "") + " ";
            }
            $("#company").text(user.name + " with roles: " + roles);
            fillTable(user);
        }

        function fillTable(user){
            let tableBody = document.getElementsByTagName("tbody")[0];
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

    }
)
