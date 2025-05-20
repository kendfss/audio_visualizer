package routes

import (
	"context"
	"fmt"
	"net/http"

	"github.com/skip2/go-qrcode"

	"github.com/kendfss/audio_visualizer/conf"
	"github.com/kendfss/audio_visualizer/plates"
)

var Table = map[string]http.HandlerFunc{
	"GET /home":   Home(),
	"GET /qrcode": QRCode(conf.Config()),
}

func init() {
	for pattern, handler := range Table {
		Table[pattern] = withLogging(handler)
	}
}

func QRCode(cfg *conf.Settings) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Query().Get("path")
		if path != "" {
			png, err := qrcode.Encode(fmt.Sprintf("http://%s:%d", cfg.Addr, cfg.Port), qrcode.High, 512)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_, err = w.Write(png)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
	}
}

func Home() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := plates.Home().Render(context.Background(), w)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}
