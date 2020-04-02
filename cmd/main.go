package main

import (
	"github.com/pborges/vue"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

type Server struct {
	Assets http.FileSystem
}

func (s *Server) Index() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var layout io.Reader
		var err error
		layoutName := "/_layout.vue.html"
		if layout, err = s.Assets.Open(layoutName); err != nil {
			log.Println("error loading layout:", layoutName, err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		components, _ := filepath.Glob("public/*.vue.js")
		for i := range components {
			c := components[i]
			c = strings.TrimPrefix(c, "public/")
			c = strings.TrimSuffix(c, ".vue.js")
			components[i] = c
		}

		ctmpl := make([]vue.Component, 0, len(components))
		for _, c := range components {
			var html io.Reader
			htmlName := "/" + c + ".vue.html"
			if html, err = s.Assets.Open(htmlName); err != nil {
				log.Println("error loading component html:", htmlName, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			var js io.Reader
			jsName := "/" + c + ".vue.js"
			if js, err = s.Assets.Open(jsName); err != nil {
				log.Println("error loading component js:", jsName, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			tmpl, err := vue.NewComponentFromReaders(c, html, js)
			if err != nil {
				log.Println("error", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			ctmpl = append(ctmpl, tmpl)
		}

		layoutTmpl, err := vue.NewLayoutFromReader(layout, ctmpl...)
		if err != nil {
			log.Println("error", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := layoutTmpl.Render(w); err != nil {
			log.Println("error", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func main() {
	srv := Server{
		Assets: http.Dir("public"),
	}
	http.HandleFunc("/", srv.Index())

	panic(http.ListenAndServe(":8080", nil))
}
