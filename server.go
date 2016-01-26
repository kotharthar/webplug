package main

import (
	"./dashboard"
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

/* Editable structure */
type Editable struct {
	FilePath string   `json:"filepath"`
	Content  string   `json:"content"`
	Children []string `json:"children"`
}

func (e *Editable) FullPath() string {
	return filepath.Join(projectDir, e.FilePath)
}

/* Project directory for editing */
var projectDir string = "/Users/ktt/w/webplug/project/"

/* List of Project files */
var projectFiles []Editable

/* Directory walking recursive function */
func collectProjectFiles(fp string, fi os.FileInfo, err error) error {
	if err != nil {
		log.Println(err.Error())
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
		relPath, _ := filepath.Rel(projectDir, fp) // extract relative path
		theEditable := Editable{relPath, "", []string{}}
		projectFiles = append(projectFiles, theEditable) //collect
	}
	return nil
}

/* API: This returns the list of all files in project directory including files in
sub directory
> curl -i http://127.0.0.1:3000/api/files
*/
func FileTreeHandler(w rest.ResponseWriter, r *rest.Request) {
	projectFiles = make([]Editable, 0)
	filepath.Walk(projectDir, collectProjectFiles) // populate projectFiles
	w.WriteJson(projectFiles)
}

/* API: This returns the file content of given file in project directory
> curl -i http://127.0.0.1:3000/api/files/open?t=
*/
func FileOpenHandler(w rest.ResponseWriter, r *rest.Request) {
	r.ParseForm()
	target := r.Form.Get("target")

	if target == "" {
		rest.Error(w, "Missing target file.", http.StatusBadRequest)
		return
	}

	content, err := ioutil.ReadFile(projectDir + target)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteJson(&Editable{target, fmt.Sprintf("%s", content), []string{}})
}

/* API: This write given content to given file in project directory */
func FileSaveHandler(w rest.ResponseWriter, r *rest.Request) {
	// Get Payload
	editable := Editable{}
	err := r.DecodeJsonPayload(&editable)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create nested path incase missing
	err = os.MkdirAll(filepath.Dir(editable.FullPath()), 0777)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write file and check error
	log.Println(editable.FullPath())
	err = ioutil.WriteFile(editable.FullPath(), []byte(editable.Content), 0644)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func main() {

	/* API Router setup */
	api := rest.NewApi()
	api.Use(&rest.AccessLogApacheMiddleware{})
	api.Use(rest.DefaultCommonStack...)
	api.Use(&rest.CorsMiddleware{ //TODO: To make origin configurable
		RejectNonCorsRequests: false,
		OriginValidator: func(origin string, request *rest.Request) bool {
			return origin == "http://localhost:9000"
		},
		AllowedMethods: []string{"GET", "POST", "DELETE"},
		AllowedHeaders: []string{
			"Accept", "Content-Type", "X-Custom-Header", "Origin"},
		AccessControlAllowCredentials: true,
		AccessControlMaxAge:           3600,
	})
	apiRouter, _ := rest.MakeRouter(
		rest.Get("/files", FileTreeHandler),
		rest.Get("/files/open", FileOpenHandler),
		rest.Post("/files/save", FileSaveHandler),
	)
	api.SetApp(apiRouter)

	/* API endpoints */
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))

	/* AngularJS App Distribution Directory */
	http.Handle("/", http.FileServer(dashboard.EassetFS()))

	/* Now start the server */
	log.Fatal(http.ListenAndServe(":3000", nil))
}
