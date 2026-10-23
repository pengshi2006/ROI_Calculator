# ROI Calculator

A responsive, dependency-free ROI calculator inspired by the supplied reference image.

## Run it locally

1. Open a terminal in this repository.
2. Start a local web server:

   ```bash
   python3 -m http.server 4173
   ```

3. Open `http://localhost:4173` in your browser.
4. Move a slider or edit a number to update the three-year projection.

## Project structure

- `index.html` contains the page content and accessible form controls.
- `styles.css` contains the layout, responsive design, sliders, and bar chart styling.
- `script.js` keeps the sliders and number fields synchronized and recalculates benefits.

## Calculation model

The calculator first finds annual call cost:

```text
annual call cost = annual call volume × cost per call
```

It then applies phased adoption rates for years 1–3 and adjusts the result relative to the default 70% first-contact-resolution assumption:

```text
year benefit = annual call cost × adoption rate × (resolution rate ÷ 70)
```

The sample adoption rates are placeholders for a gradual rollout. Replace `ADOPTION_RATES` in `script.js` with values from your own business case before using the estimate for decisions.

## Easy customizations

- Change headings and helper text in `index.html`.
- Change colors in the `:root` section at the top of `styles.css`.
- Change input limits using each input's `min`, `max`, and `step` attributes.
- Change the ROI assumptions in `ADOPTION_RATES` inside `script.js`.
