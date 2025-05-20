package main

import (
	"bytes"
	"encoding/base64"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/charmbracelet/log"
	"github.com/dhowden/tag"
	"github.com/h2non/filetype"
)

func main() {
	flag.Parse()
	err := scrape(os.Stdout, filepath.SplitList(os.Getenv("VISI_AUDIO_PATH"))...)
	if err != nil {
		log.Fatal(err)
	}
}

func code(data []byte) ([]byte, error) {
	var buf bytes.Buffer
	encoder := base64.NewEncoder(base64.StdEncoding, &buf)
	_, err := io.Copy(encoder, bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	err = encoder.Close()
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func scrape(dst io.StringWriter, dirs ...string) error {
	_, err := dst.WriteString("const audios = {")
	if err != nil {
		return fmt.Errorf("opening-up")
	}
	counter := 0
	for _, dir := range dirs {
		files, err := os.ReadDir(dir)
		if err != nil {
			return err
		}
		for _, entry := range files {
			if !entry.IsDir() {
				path := filepath.Join(dir, entry.Name())
				data, err := os.ReadFile(path)
				if err != nil {
					return err
				}
				if filetype.IsAudio(data) {
					var title string
					ext := filepath.Ext(entry.Name())
					switch strings.ToLower(ext) {
					case ".mp3", ".flac", ".ogg", "m4a":
						m, err := tag.ReadFrom(bytes.NewReader(data))
						if err != nil {
							log.Errorf("reading %q: %s", entry.Name(), err)
							counter++
							title = fmt.Sprintf("audio%d", counter)
							break
						}
						title = m.Title()
					default:
						title = filepath.Base(entry.Name())
						title = title[:len(title)-len(ext)]
					}
					encoded, err := code(data)
					if err != nil {
						return fmt.Errorf("encoding %q: %w", entry.Name(), err)
					}
					re := regexp.MustCompile(`[\(\)\s-]+`)
					title = strings.ToLower(re.ReplaceAllString(title, "_"))
					_, err = dst.WriteString(fmt.Sprintf("\n%q:\tnew Audio('data:audio/x-%s;base64,%s'),", title, ext[1:], string(encoded)))
					if err != nil {
						return fmt.Errorf("writing %q: %w", entry.Name(), err)
					}
				}
			}
		}
	}
	_, err = dst.WriteString("\n};")
	if err != nil {
		return fmt.Errorf("closing-out")
	}
	return nil
}
