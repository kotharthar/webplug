package main

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

/* Project directory for editing */
var projectDir string = "./project"

/* List of Project files */
var projectFiles []string

/* Directory walking recursive function */
func collectProjectFiles(fp string, fi os.FileInfo, err error) error {
	if err != nil {
		return nil // Can't walk here, move on
	}
	if !!fi.IsDir() {
		return nil //not a file. Ignore.
	}

	matched, err := filepath.Match("*.*", fi.Name())
	hmatched, _ := filepath.Match(".*", fi.Name())
	if err != nil {
		return err //malform pattern, failed.
	}
	if matched && !hmatched {
		projectFiles = append(projectFiles, fp) //collect
	}
	return nil
}

/* API: This returns the list of all files in project directory including files in
sub directory
*/
func FileTreeHandler(w rest.ResponseWriter, r *rest.Request) {
	projectFiles = make([]string, 0)
	filepath.Walk(projectDir, collectProjectFiles) // populate projectFiles
	w.WriteJson(map[string][]string{
		"files": projectFiles,
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
