const express = require("express");
const app = express();
const router = express.Router();

const exphbs = require("express-handlebars");

// <------------------------- Contenedor de Productos ------------------------->

const Contenedor = require("./contenedor");
const contenedor1 = new Contenedor("productos.json");

// <------------------------- Configuracion de HandleBars ------------------------->

app.set("views", "./views");
app.engine(
	".hbs",
	exphbs({
		defaultLayout: "main",
		layoutsDir: "./views/layouts",
		partialsDir: "./views/partials",
		extname: ".hbs",
	})
);
app.set("view engine", ".hbs");

// <------------------------- Configuracion Rutas ------------------------->

app.use("/api/productos", router);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// <------------------------- Rutas ------------------------->

router.get("/", (req, res) => {
	const { id } = req.query;
	if (id != undefined) {
		const response = contenedor1.get(Number(id));
		res.render("idProduct", { response });
	} else {
		const response = contenedor1.getAll();
		res.render("index", { response });
	}
});

router.get("/:id", (req, res) => {
	const { id } = req.params;
	const response = contenedor1.get(Number(id));
	res.render("idProduct", { response });
});

router.post("/", (req, res) => {
	const { nombre, precio, imagen } = req.body;
	if (nombre === "" || precio === "" || imagen === "") {
		res.render("addProduct", {response: false});
	} else {
    const response = contenedor1.save({
      nombre: nombre,
      precio: Number(precio),
      imagen: imagen,
    });
		res.render("addProduct", {response});
	}
});

router.put("/:id", (req, res) => {
  const { nombre, precio, imagen } = req.body;
  const { id } = req.params;
	if (nombre === "" || precio === "" || imagen === "") {
		res.render("updateProduct", {response: false});
	} else {
    const response = contenedor1.update(
      Number(id), 
      {
        nombre: nombre,
        precio: Number(precio),
        imagen: imagen
      });
		res.render("updateProduct", {response});
	}
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
  const response = contenedor1.delete(Number(id));
	res.render("deleteProduct", {response});
});

// <------------------------- Servidor ------------------------->

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor: ${error}`));
