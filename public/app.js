function updateStateElement(element, newType, newText, newClass = null) {
	element.dataset.type = newType
	element.innerHTML = newText
	if (newClass) { element.className = newClass }
}

document.addEventListener("click", async ({ target }) => {
	if (target.getAttribute("data-type") === "remove") {
		const idNote = target.getAttribute("data-id")
		remove(idNote).then(() => {
			target.closest("li").remove()
		})
	}
	if (target.getAttribute("data-type") === "edit") {
		const btnContainer = target.closest(".btn-container")
		const btnDelete = btnContainer.children[1]
		updateStateElement(target, "save", "Сохранить", "btn btn-success")
		updateStateElement(btnDelete, "cancel", "Oтмена")
		const parent = target.closest("li")
		const valueDef = parent.outerText.split()[0].split("\n")[0]
		const text = [...parent.childNodes][0]
		const inputElement = document.createElement("input")
		inputElement.dataset.value = text.textContent
		text.textContent = ""
		inputElement.classList.add("input-note")
		inputElement.value = valueDef
		parent.prepend(inputElement)
	} else if (target.getAttribute("data-type") === "cancel") {
		const parent = target.closest("li")
		const input = document.querySelector(".input-note")
		if (input) {
			const textNode = document.createTextNode(input.dataset.value)
			input.remove()
			parent.prepend(textNode)
		}
		const btnContainer = target.closest(".btn-container")
		const btnSave = btnContainer.children[0]
		updateStateElement(btnSave, "edit", "Обновить", "btn btn-primary")
		updateStateElement(target, "remove", "&#10005;")
	} else if (target.getAttribute("data-type") === "save") {
		const parent = target.closest("li")
		const input = document.querySelector(".input-note")
		let textNode
		if (input) {
			textNode = document.createTextNode(input.value)
			edit(target.dataset.id, input.value)
			input.remove()
			parent.prepend(textNode)
		}
		const btnContainer = target.closest(".btn-container")
		const btnCancel = btnContainer.children[1]
		updateStateElement(target, "edit", "Обновить", "btn btn-primary")
		updateStateElement(btnCancel, "remove", "&#10005;")
	}
})

async function edit (id, result) {
	try {
		await fetch(`/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ title: result })
		})
	} catch (error) {
		console.log("Error edit:", error)
	}
}

async function remove (idNote) {
	try {
		await fetch(`/${idNote}`, {
			method: "DELETE",
		})
	} catch (err) {
		console.log("Error delete", err)
	}
}