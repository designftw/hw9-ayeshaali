import Backend from "https://madata.dev/src/index.js";

let $$ = (selector, container = document) => Array.from(container.querySelectorAll(selector));
let $ = (selector, container = document) => container.querySelector(selector);

let backend = Backend.from("https://github.com/designftw/hw9-ayeshaali/tracker/data.json");

export const dom = {
	app: document.querySelector("#app"),
	totalCount: document.querySelector("#total_count"),
	saveButton: document.querySelector("#save_button"),
	loginButton: document.querySelector("#login_button"),
	logoutButton: document.querySelector("#logout_button"),
	userName: document.querySelector("#user_name"),
	userAvatar: document.querySelector("#user_avatar"),
};

dom.saveButton.addEventListener("click", event => {
	dom.app.classList.add("saving");
	let dataToSave = $$(".entry > form").map(form => {
		let data = new FormData(form);
		return Object.fromEntries(data.entries());
	});
	backend.store(dataToSave);
	dom.app.classList.remove("saving");
});

dom.loginButton.addEventListener("click", async e => {
	backend.login();
});

dom.logoutButton.addEventListener("click", e => {
	backend.logout();
});

backend.addEventListener("mv-login", e => {
	let user = backend.user;
	if (user) {
		dom.app.classList.add("logged-in");
		dom.userName.textContent = user.name+"'s Restaurant Tracker";
		dom.userAvatar.src = user.avatar;
	}
});

backend.addEventListener("mv-logout", e => {
	dom.app.classList.remove("logged-in");
	dom.userName.textContent = "";
	dom.userAvatar.src = "";
});

add_entry_button.addEventListener("click", event => {
	// Set current date and time as default
	let currentISODate = new Date().toISOString().substring(0, 19); // drop ms and timezone
	addEntry({datetime: currentISODate});
});

function addEntry(data) {
	let entry = entry_template.content.cloneNode(true);

	for (let prop in data) {
		setFormElement(prop, data[prop], entry);
	}
	// Add new entry after "Add entry" button
	add_entry_button.after(entry);
	entry = add_entry_button.nextElementSibling
}

function deleteRow(el) {
	el.parentElement.remove();
} 
window.deleteRow= deleteRow;

function setFormElement(name, value, container) {
	let elements = $$(`[name="${name}"]`, container);

	for (let element of elements) { // only radios will have more than one, but can't hurt
		if (element.type === "checkbox") {
			element.checked = value;
		}
		if (element.type === "radio") {
			element.checked = element.value === value;
		}
		else {
			element.value = value;
		}
	}
}

dom.app.classList.add("loading");
export const json = await backend.load();
if (json) {
	for (let entry of json) {
		addEntry(entry);
	}
}
else {
	addEntry();
}
dom.app.classList.remove("loading");

