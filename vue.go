package vue

import (
	"bytes"
	"html/template"
	"io"
	"io/ioutil"
)

func NewLayoutFromReader(html io.Reader, components ...Component) (l Layout, err error) {
	l.Components = components
	var buff []byte
	if buff, err = ioutil.ReadAll(html); err != nil {
		return
	} else {
		l.HTML = template.HTML(buff)
	}
	return
}

type Layout struct {
	HTML       template.HTML
	Components []Component
}

func (c Layout) Render(w io.Writer) error {
	buf := &bytes.Buffer{}
	for _, c := range c.Components {
		if err := c.Render(buf); err != nil {
			return err
		}
	}

	m := struct {
		Components template.HTML
	}{
		Components: template.HTML(buf.String()),
	}

	t, err := template.New("layout").Delims("@{", "}@").Parse(string(c.HTML))
	if err != nil {
		return err
	}
	return t.Execute(w, m)
}

func NewComponentFromReaders(name string, html, js io.Reader) (c Component, err error) {
	c.Name = name
	var buff []byte
	if buff, err = ioutil.ReadAll(html); err != nil {
		return
	} else {
		c.HTML = template.HTML(buff)
	}

	if buff, err = ioutil.ReadAll(js); err != nil {
		return
	} else {
		c.JS = template.JS(buff)
	}
	return
}

const componentTmpl = `<script type="text/javascript">
@{template "js" .}@
</script>
<script type="text/x-template" id="@{.TemplateId}@">
@{template "html" .}@
</script>`

type Component struct {
	Name string
	HTML template.HTML
	JS   template.JS
}

func (c Component) Render(w io.Writer) error {
	m := struct {
		Name       string
		Template   string
		TemplateId string
	}{
		Name:       c.Name,
		Template:   "#tmpl-" + c.Name,
		TemplateId: "tmpl-" + c.Name,
	}

	t, err := template.New("component").Delims("@{", "}@").Parse(componentTmpl)
	if err != nil {
		return err
	}

	_, err = t.New("html").Parse(string(c.HTML))
	if err != nil {
		return err
	}

	_, err = t.New("js").Parse(string(c.JS))
	if err != nil {
		return err
	}

	return t.Execute(w, m)
}
