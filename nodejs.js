// const http = require("http")
// const fs = require("fs/promises")
// const path = require("path")
// const chalk = require("chalk")
// const { addNotes } = require("./notes.controller")

// const PORT = 3000
// const basePathPages = path.join(__dirname, "./pages")

const server = http.createServer( async (request, response) => {
	if (request.method === "GET") {
		try {
			const content = await fs.readFile(path.join(basePathPages, "index.html"), { encoding: "utf-8" })
			response.writeHead(200, {
				"Content-Type": "text/html"
			})
			response.end(content)
		} catch (err) {
			console.log(err)
		}
	} else if (request.method === "POST") {
		const body = []
		request.on("data", data => {
			body.push(Buffer.from(data).toString("utf-8"))
		})
		request.on("end", () => {
			const title = body.toString().split("=")[1].replaceAll("+", " ")
			addNotes(title)
		})
		response.setHeader("Content-Type", "text/plain; charset=utf-8")
		response.writeHead(200)
		response.end("Post success")
	}
})

server.listen(PORT, () => {
	console.log(chalk.green.inverse(`Server has been started on ${PORT} PORT`))
})