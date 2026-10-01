PYTHON ?= python3.12

.PHONY: install test render

install:
	$(PYTHON) -m pip install -r requirements.txt

test:
	$(PYTHON) -m unittest discover -s tests -v

render:
	$(PYTHON) scripts/render_roadmap.py
