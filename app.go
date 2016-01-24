package main

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"net/http"
)

/* API: This returns the list of all files in project directory including files in
sub directory
*/
func FileTreeHandler(w rest.ResponseWriter, r *rest.Request) {
	w.WriteJson(map[string]string{
		"Body": "FileTreeHandler",
	})
}

/* API: This returns the file content of given file in project directory */
func FileOpenHandler(w rest.ResponseWriter, r *rest.Request) {
	w.WriteJson(map[string]string{
		"Body": "FileOpenHandler",
	})
}

/* API: This write given content to given file in project directory */
func FileSaveHandler(w rest.ResponseWriter, r *rest.Request) {
	w.WriteJson(map[string]string{
		"Body": "FileSaveHandler",
	})
}

/* API: This simply create the needed directories & file */
func FileNewHandler(w rest.ResponseWriter, r *rest.Request) {
	w.WriteJson(map[string]string{
		"Body": "FileNewHandler",
	})
}

func main() {

	/* API Router setup */
	api := rest.NewApi()
	api.Use(&rest.AccessLogApacheMiddleware{})
	api.Use(rest.DefaultCommonStack...)
	apiRouter, _ := rest.MakeRouter(
		rest.Get("/files", FileTreeHandler),
		rest.Get("/files/open", FileOpenHandler),
		rest.Post("/files/save", FileSaveHandler),
		rest.Post("/files/new", FileNewHandler),
	)
	api.SetApp(apiRouter)

	/* API endpoints */
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))

	/* AngularJS App Distribution Directory */
	http.Handle("/", http.FileServer(http.Dir("./site_app/dist")))

	/* Now start the server */
	log.Fatal(http.ListenAndServe(":3000", nil))
}
