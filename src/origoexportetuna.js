import Origo from 'Origo';

const Origoexportetuna = function Origoexportetuna(options = {}) {
  let viewer;
  let selectionManager;
  const dom = Origo.ui.dom;

  const layer = Object.prototype.hasOwnProperty.call(options, 'layer') ? options.layer : null;
  const hostname = Object.prototype.hasOwnProperty.call(options, 'hostname') ? options.hostname : null;
  const attribute = Object.prototype.hasOwnProperty.call(options, 'attribute') ? options.attribute : null;
  const buttonText = Object.prototype.hasOwnProperty.call(options, 'buttonText') ? options.buttonText : null;

  function dotNetUrlBuilder(items) {
    let idString = '';
    items.forEach((item) => {
      idString += `${item.getFeature().get(attribute)};`;
    });
    return `${hostname}/search/estateExcelReport.aspx?searchstring=&estateLayer=${layer}&ids=${idString}&functionParam=excel`;
  }

  function listenerFunc() {
    const buttonContainer = document.getElementsByClassName('export-buttons-container')[0];
    const correctLayer = selectionManager.getSelectedItemsForASelectionGroup(layer).length > 0;
    const layerTitle = viewer.getLayer(layer).get('title');

    if (typeof buttonContainer !== 'undefined') {
      const buttonNeedsToBeAdded = document.getElementById('callDotNet') === null;
      const hasOrigoExportButton = buttonContainer.getElementsByTagName('div').length === 1;
      const groupElement = document.getElementsByClassName('selectedurvalelement');

      if (groupElement && groupElement.length > 0 && !groupElement[0].classList.contains('hidden')) {
        const selectedGroupTitle = groupElement[0].textContent.replace(/\s*\(.*?\)\s*/g, '');

        if (selectedGroupTitle === layerTitle) {
          if (hasOrigoExportButton) {
            buttonContainer.getElementsByTagName('div')[0].style.display = 'inline-block';
          }

          if (buttonNeedsToBeAdded && correctLayer) {
            const button = dom.html(`<button id="callDotNet" class="export-button" style="margin-left: 0.5rem;">${buttonText}</button>`);
            buttonContainer.appendChild(button);
            document.getElementById('callDotNet').addEventListener('click', () => window.open(dotNetUrlBuilder(selectionManager.getSelectedItemsForASelectionGroup(layer)), '_blank'));
          }
        }
      } else if (!buttonNeedsToBeAdded) {
        document.getElementById('callDotNet').remove();
      }
    }
  }

  return Origo.ui.Component({
    name: 'origoexportetuna',
    onAdd(evt) {
      if (layer && hostname && attribute && buttonText) {
        viewer = evt.target;
        selectionManager = viewer.getSelectionManager();

        const el = document.getElementsByClassName('listcontainer')[0];
        const observer = new MutationObserver(() => {
          if (el && el.offsetParent !== null) {
            listenerFunc();
            document.getElementsByClassName('urvalelement').forEach((element) => {
              if (!element.getAttribute('hasListener')) {
                element.setAttribute('hasListener', true);
                element.addEventListener('click', () => listenerFunc());
              }
            });
          }
        });

        observer.observe(document.querySelector('#sidebarcontainer'), { attributes: true, childList: true, characterData: true });
      } else {
        alert('Kunde inte ladda plugin Origoexportetuna.\nParametrar saknas.');
      }
    }
  });
};

export default Origoexportetuna;
