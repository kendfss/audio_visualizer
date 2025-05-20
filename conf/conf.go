package conf

import (
	"context"
	"path/filepath"

	"github.com/charmbracelet/log"
	"github.com/kendfss/go-ip"
	"github.com/pelletier/go-toml"
	"github.com/shibukawa/configdir"
)

type Settings struct {
	Port uint16 // the port on which to serve
	Addr string // the local ip address of the running machine
}

// Default context value. Mostly used for template rendering
func (Settings) DefaultCtx() context.Context {
	return context.TODO()
}

const fname = "conf.toml"

// Write commits a configuration to the disk and returns its path
func (c *Settings) Write() (string, error) {
	data, err := toml.Marshal(c)
	if err != nil {
		return "", err
	}
	err = dir().WriteFile(fname, data)
	if err != nil {
		return "", err
	}
	return filepath.Join(dir().Path, fname), nil
}

var configDir *configdir.Config

func dir() *configdir.Config {
	if configDir == nil {
		configDir = configdir.New("kendfss", "serva").QueryFolders(configdir.Global)[0]
	}
	return configDir
}

var conf *Settings

// Config is like Load but it produces a fatal log entry on error
func Config() *Settings {
	if conf == nil {
		out, err := Load()
		if err != nil {
			log.Fatal(err)
		}
		conf = out
	}
	return conf
}

// Load checks the disk for a configuration file, and consults os.Args if none is found
func Load() (*Settings, error) {
	out := new(Settings)
	defer func() { out.Addr = ip.MustLocal() }()
	if conf == nil {
		defer func() { conf = out }()
		if !dir().Exists(fname) {
			out.Port = 8080
			return out, nil
		}
		data, err := dir().ReadFile(fname)
		if err != nil {
			return nil, err
		}
		err = toml.Unmarshal(data, out)
		if err != nil {
			return nil, err
		}
		return out, err
	}
	return conf, nil
}
