const fs = require("fs/promises")
const path = require("path")
const chalk = require("chalk")

const notesPath = path.join(__dirname, "db.json")

async function addNotes(title) {
	const notesDB = await getNotes()
	const note = {
		title,
		id: Date.now().toString()
	}
	notesDB.push(note)

	await fs.writeFile(notesPath, JSON.stringify(notesDB))

	console.log(chalk.green.inverse("Note added!"))
}

async function getNotes() {
	const notesDB = await fs.readFile(notesPath, { encoding: "utf-8" })
	return Array.isArray(JSON.parse(notesDB)) ? JSON.parse(notesDB) : []
}

async function editNote(id, body) {
	const notesDB = await getNotes()
	const index = notesDB.findIndex(note => note.id === id)
	notesDB[index] = {...notesDB[index], ...body}
	try {
		await fs.writeFile(notesPath, JSON.stringify(notesDB))
		console.log(chalk.yellow.inverse(`Note by id: ${id} edit`))
	} catch (error) {
		console.log("Error write update file", error)
	}
}

async function removeNoteById(id) {
	const notesDB = await getNotes()
	const newArrayNotes = notesDB.filter(note => note.id !== id)
	await fs.writeFile(notesPath, JSON.stringify(newArrayNotes))
	console.log(chalk.red.inverse(`Note ${id} deleted!`))
}

async function printNotes() {
	const notesDB = await getNotes()
	console.log(chalk.blue.inverse("This is list of notes: "))
	notesDB.forEach(note => {
		console.log(chalk.yellow.inverse(`Title: ${note.title}, ID: ${note.id}, Tag: ${note.tag}`))
	})
}

module.exports = {
	addNotes,
	printNotes,
	removeNoteById,
	getNotes,
	editNote
}