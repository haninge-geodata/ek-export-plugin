import Origo from 'Origo';

const Origoexportetuna = function Origoexportetuna(options = {}) {
  let viewer;
  let selectionManager;
  const dom = Origo.ui.dom;

  const layer = Object.prototype.hasOwnProperty.call(options, 'layer') ? options.layer : null;
  const hostname = Object.prototype.hasOwnProperty.call(options, 'hostname') ? options.hostname : null;
  const attribute = Object.prototype.hasOwnProperty.call(options, 'attribute') ? options.attribute : null;
  const buttonText = Object.prototype.hasOwnProperty.call(options, 'buttonText') ? options.buttonText : null;

  let globalURL;

  function dotNetUrlBuilder(items) {
    let fnrString = '';
    items.forEach((item) => {
      fnrString += `${item.getFeature().get(attribute)};`;
    });
    return `${hostname}/search/estateExcelReport.aspx?searchstring=&estateLayer=${layer}&ids=${fnrString}&functionParam=excel`;
  }

  function evtListener() {
    const buttonContainer = document.getElementsByClassName('export-buttons-container')[0];
    const buttonNeedsToBeAdded = document.getElementById('callDotNet') === null;

    if (typeof buttonContainer !== 'undefined') {
      const items = selectionManager.getSelectedItemsForASelectionGroup(layer);
      const hasOrigoExportButton = buttonContainer.getElementsByTagName('div').length === 1;

      globalURL = dotNetUrlBuilder(items);

      if (hasOrigoExportButton) {
        buttonContainer.getElementsByTagName('div')[0].style.display = 'inline-block';
      }

      if (buttonNeedsToBeAdded) {
        const button = dom.html(`<button id="callDotNet" class="export-button" style="margin-left: 0.5rem;">${buttonText}</button>`);
        buttonContainer.appendChild(button);
        document.getElementById('callDotNet').addEventListener('click', () => window.open(globalURL, '_blank'));
      }
    }
  }

  return Origo.ui.Component({
    name: 'origoexportetuna',
    onAdd(evt) {
      if (layer && hostname && attribute && buttonText) {
        viewer = evt.target;
        selectionManager = viewer.getSelectionManager();
        document.getElementById('sidebarcontainer').addEventListener('DOMSubtreeModified', evtListener);
      } else {
        alert('Kunde inte ladda plugin Origoexportetuna.\nParametrar saknas.');
      }
    }
  });
};

export default Origoexportetuna;
