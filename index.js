const express = require("express")
const chalk = require("chalk")
const path = require("path")
const { addNotes, getNotes, removeNoteById, editNote } = require("./notes.controller")

const PORT = 3000
const app = express()

app.set("view engine", "ejs")
app.set("views", "pages")

app.use(express.json())
app.use(express.urlencoded({ // Для того, чтобы express распознавал тела запросов
	extended: true
}))
app.use(express.static(path.join(__dirname, "public")))

app.put("/:id", async (request, response) => {
	try {
		await editNote(request.params.id, request.body)
		response.render("index", {
			title: "Express App",
			notes: await getNotes(),
			create: false
		})
	} catch (error) {
		console.log("Error update serve", error)
	}
})

app.get("/", async (request, response) => {
	response.render("index", {
		title: "Express App",
		notes: await getNotes(),
		create: false
	})
})

app.post("/", async (request, response) => {
	try {
		await addNotes(request.body.title)
		response.render("index", {
			title: "Express App",
			notes: await getNotes(),
			create: true
		})
	} catch (err) {
		console.log("Error add: ", err)
	}
})

app.delete("/:id", async (request, response) => {
	try {
		await removeNoteById(request.params.id)
		response.render("index", {
			title: "Express App",
			notes: await getNotes(),
			create: false
		})
	} catch (err) {
		console.log(err)
	}
})

app.listen(PORT, () => {
	console.log(chalk.green.inverse(`Server has been started on ${PORT} PORT`))
})