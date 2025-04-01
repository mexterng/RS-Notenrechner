document.addEventListener("update-averages", function () {
  // Array of slider names for the Prüfungslehrproben
  const plpNames = ["plp-1", "plp-2", "plp-3"];

  // Extract all min and max values of the Prüfungslehrproben
  let plpSliders = plpNames
    .map((name) => {
      let slider = document.querySelector(`range-slider[name="${name}"]`);
      if (slider && slider.min && slider.max) {
        return {
          min: parseFloat(slider.min.value),
          max: parseFloat(slider.max.value),
        };
      }
      return null;
    })
    .filter((val) => val !== null);

  if (plpSliders.length == 3) {
    // Calculate the average of the min values
    let avgMin = (
      plpSliders.reduce((sum, slider) => sum + slider.min, 0) / 3
    ).toFixed(2);

    // Calculate the average of the max values
    let avgMax = (
      plpSliders.reduce((sum, slider) => sum + slider.max, 0) / 3
    ).toFixed(2);

    // Update the element displaying the average of the Prüfungslehrproben (min and max)
    let plpAvgElement = document.getElementById("lehrproben-avg");
    if (plpAvgElement) {
      plpAvgElement.setAttribute("avgmin", avgMin);
      plpAvgElement.setAttribute("avgmax", avgMax);
      plpAvgElement.textContent = `Durchschnitt der Prüfungslehrproben: ${avgMin}${
        avgMin != avgMax ? ` - ${avgMax}` : ""
      } (x4)`;
    }
  }

  // Calculate the average for GSB/Schulrecht + Mündliche Prüfungen (min and max)
  const mdlNames = ["gsb-sr", "mdl-1", "mdl-2"];
  let mdlSliders = mdlNames
    .map((name) => {
      let slider = document.querySelector(`range-slider[name="${name}"]`);
      if (slider && slider.min && slider.max) {
        return {
          min: parseFloat(slider.min.value),
          max: parseFloat(slider.max.value),
        };
      }
      return null;
    })
    .filter((val) => val !== null);

  if (mdlSliders.length == 3) {
    let avgMin = (
      mdlSliders.reduce((sum, slider) => sum + slider.min, 0) / 3
    ).toFixed(2);

    let avgMax = (
      mdlSliders.reduce((sum, slider) => sum + slider.max, 0) / 3
    ).toFixed(2);

    let mdlAvgElement = document.getElementById("mdl-avg");
    if (mdlAvgElement) {
      mdlAvgElement.setAttribute("avgmin", avgMin);
      mdlAvgElement.setAttribute("avgmax", avgMax);
      mdlAvgElement.textContent = `Durchschnitt der mündlichen Prüfungen: ${avgMin}${
        avgMin != avgMax ? ` - ${avgMax}` : ""
      } (x2)`;
    }
  }

  // Calculate the average for Gutachten (min and max)
  const gutachtenNames = ["unterricht", "erzieherisch", "handlung-sach"];
  let gutachtenSliders = gutachtenNames
    .map((name) => {
      let slider = document.querySelector(`range-slider[name="${name}"]`);
      if (slider && slider.min && slider.max) {
        return {
          name: name,
          min: parseFloat(slider.min.value),
          max: parseFloat(slider.max.value),
        };
      }
      return null;
    })
    .filter((val) => val !== null);

  if (gutachtenSliders.length == 3) {
    const unterrichtSlider = gutachtenSliders.find(
      (slider) => slider.name === "unterricht"
    );
    const erzieherischSlider = gutachtenSliders.find(
      (slider) => slider.name === "erzieherisch"
    );
    const handlungSachSlider = gutachtenSliders.find(
      (slider) => slider.name === "handlung-sach"
    );

    let avgMin =
      (3 * unterrichtSlider.min +
        3 * erzieherischSlider.min +
        2 * handlungSachSlider.min) /
      (3 + 3 + 2); // Weighted calculation

    let avgMax =
      (3 * unterrichtSlider.max +
        3 * erzieherischSlider.max +
        2 * handlungSachSlider.max) /
      (3 + 3 + 2); // Weighted calculation

    let gutachtenAvgElement = document.getElementById("gutachten-avg");
    if (gutachtenAvgElement) {
      gutachtenAvgElement.setAttribute("avgmin", avgMin.toFixed(2));
      gutachtenAvgElement.setAttribute("avgmax", avgMax.toFixed(2));
      gutachtenAvgElement.textContent = `Durchschnitt des Gutachtens: ${avgMin.toFixed(
        2
      )}${avgMin !== avgMax ? ` - ${avgMax.toFixed(2)}` : ""} (x5)`;
    }
  }

  // Calculate the overall average for 2. Staatsexamen
  const plpAvgMin = parseFloat(
    document.getElementById("lehrproben-avg").getAttribute("avgmin")
  );
  const plpAvgMax = parseFloat(
    document.getElementById("lehrproben-avg").getAttribute("avgmax")
  );

  const mdlAvgMin = parseFloat(
    document.getElementById("mdl-avg").getAttribute("avgmin")
  );
  const mdlAvgMax = parseFloat(
    document.getElementById("mdl-avg").getAttribute("avgmax")
  );

  const gutachtenAvgMin = parseFloat(
    document.getElementById("gutachten-avg").getAttribute("avgmin")
  );
  const gutachtenAvgMax = parseFloat(
    document.getElementById("gutachten-avg").getAttribute("avgmax")
  );

  const gesamtNames = ["hausarbeit", "kolloquium"];
  let gesamtSliders = gesamtNames
    .map((name) => {
      let slider = document.querySelector(`range-slider[name="${name}"]`);
      if (slider && slider.min && slider.max) {
        return {
          name: name,
          min: parseFloat(slider.min.value),
          max: parseFloat(slider.max.value),
        };
      }
      return null;
    })
    .filter((val) => val !== null);

  if (gesamtSliders.length == 2) {
    const hausarbeitSlider = gesamtSliders.find(
      (slider) => slider.name === "hausarbeit"
    );
    const kolloquiumSlider = gesamtSliders.find(
      (slider) => slider.name === "kolloquium"
    );

    // Weighting factors
    const plpGewichtung = 4;
    const mdlGewichtung = 2;
    const gutachtenGewichtung = 5;

    // Calculate the overall grade for 2. Staatsexamen (min and max)
    const gesamtMin =
      (plpGewichtung * plpAvgMin +
        mdlGewichtung * mdlAvgMin +
        gutachtenGewichtung * gutachtenAvgMin +
        hausarbeitSlider.min +
        kolloquiumSlider.min) /
      13;

    const gesamtMax =
      (plpGewichtung * plpAvgMax +
        mdlGewichtung * mdlAvgMax +
        gutachtenGewichtung * gutachtenAvgMax +
        hausarbeitSlider.max +
        kolloquiumSlider.max) /
      13;

    // Display the overall grade for 2. Staatsexamen (min and max)
    let gesamtNoteElement = document.getElementById("gesamtnote-2-avg");
    if (gesamtNoteElement) {
      gesamtNoteElement.setAttribute("avgmin", gesamtMin.toFixed(2));
      gesamtNoteElement.setAttribute("avgmax", gesamtMax.toFixed(2));
      gesamtNoteElement.textContent = `Gesamtnote 2. Staatsexamen: ${gesamtMin.toFixed(
        2
      )}${gesamtMin !== gesamtMax ? ` - ${gesamtMax.toFixed(2)}` : ""}`;
    }

    // Display the overall grade for Staatsexamen (min and max)
    let input = document.getElementById("examen-1");
    if (input) {
      let examen1 = input.value.replace(",", "."); // Convert comma to dot for calculations
      examen1 = parseFloat(examen1);

      if (!isNaN(examen1)) {
        // Ensure it's a valid number
        let examenMin = (gesamtMin + examen1) / 2;
        let examenMax = (gesamtMax + examen1) / 2;

        let examenNoteElement = document.getElementById("examennote-avg");
        if (examenNoteElement) {
          examenNoteElement.setAttribute("avgmin", examenMin.toFixed(2));
          examenNoteElement.setAttribute("avgmax", examenMax.toFixed(2));
          examenNoteElement.textContent = `Gesamtnote Staatsexamen: ${examenMin.toFixed(2)}${examenMin !== examenMax ? ` - ${examenMax.toFixed(2)}` : ""}`;
        }
      }
    }
  }
});
document.getElementById("examen-1").addEventListener("input", function () {
  // Do not format immediately while typing, just ensure it's valid when done
  clearTimeout(document.getElementById("examen-1").formatTimer); // Clear any previously set timer
  document.getElementById("examen-1").formatTimer = setTimeout(() => formatDecimal(this), 500);  // Delay format after typing stops
});
function formatDecimal(input) {
  let value = input.value.replace(",", ".");
  let formattedValue = parseFloat(value)

  if (!isNaN(formattedValue) && formattedValue >= 1.0 && formattedValue <= 6.0) {
    input.value = formattedValue.toFixed(2);
    document.dispatchEvent(new Event('update-averages'));
  } else {
    input.value = ""; // Fallback to the minimum value
  }
  let params = new URLSearchParams(window.location.search);
  let examen1 = input.value.replace(",", ".");
  params.delete('examen1')
  params.set('examen-1', examen1)
  window.history.replaceState({}, '', '?' + params.toString());
}
