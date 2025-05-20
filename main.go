package main

import (
	"embed"
	"fmt"
	"net/http"
	"os"

	"github.com/charmbracelet/log"
	"github.com/k0kubun/pp"
	"github.com/mdp/qrterminal"

	"github.com/kendfss/audio_visualizer/conf"
	"github.com/kendfss/audio_visualizer/routes"
)

var version string

//go:embed static/*
var staticFS embed.FS

//go:embed assets/*
var assetsFS embed.FS

func main() {
	pp.Printf("audio_visualizer\t%s\n", version)
	cfg, err := conf.Load()
	if err != nil {
		log.Fatal(err)
	}

	link := fmt.Sprintf("http://%s:%d", cfg.Addr, cfg.Port)
	qrterminal.GenerateWithConfig(link, qrterminal.Config{
		Level:     qrterminal.L,
		Writer:    os.Stdout,
		BlackChar: qrterminal.WHITE,
		WhiteChar: qrterminal.BLACK,
		QuietZone: 1,
	})

	http.Handle("/static/", http.FileServer(http.FS(staticFS)))
	http.Handle("/assets/", http.FileServer(http.FS(assetsFS)))
	for path, fn := range routes.Table {
		http.HandleFunc(path, fn)
	}

	log.Infof("serving @ http://localhost:%d/home", cfg.Port)
	log.Infof("serving @ %s/home", link)
	err = http.ListenAndServe(fmt.Sprintf(":%d", cfg.Port), nil)
	if err != nil {
		log.Fatal(err)
	}
}
