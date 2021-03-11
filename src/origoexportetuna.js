import Origo from 'Origo';

const Origoexportetuna = function Origoexportetuna(options = {}) {
  let viewer;
  let selectionManager;
  let modal;
  let callDotNetButton;
  let acceptTermsButton;
  let termsText;
  let modalContent;
  let acceptedTerms = false;
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

  function modalLogic() {
    if (acceptedTerms) {
      window.open(dotNetUrlBuilder(selectionManager.getSelectedItemsForASelectionGroup(layer)), '_blank');
    } else {
      modal = Origo.ui.Modal({
        title: 'Varning',
        content: modalContent.render(),
        style: 'width: auto;',
        target: viewer.getId()
      });

      document.getElementById(acceptTermsButton.getId()).addEventListener('click', () => {
        acceptedTerms = true;
        modal.closeModal();
      });
    }
  }

  function listenerFunc() {
    const buttonContainer = document.getElementsByClassName('export-buttons-container')[0];
    const correctLayer = selectionManager.getSelectedItemsForASelectionGroup(layer).length > 0;
    const layerTitle = viewer.getLayer(layer).get('title');

    if (typeof buttonContainer !== 'undefined') {
      const buttonNeedsToBeAdded = document.getElementById(callDotNetButton.getId()) === null;
      const hasOrigoExportButton = buttonContainer.getElementsByTagName('div').length === 1;
      const groupElement = document.getElementsByClassName('selectedurvalelement');

      if (groupElement && groupElement.length > 0 && !groupElement[0].classList.contains('hidden')) {
        const selectedGroupTitle = groupElement[0].textContent.replace(/\s*\(.*?\)\s*/g, '');

        if (selectedGroupTitle === layerTitle) {
          if (hasOrigoExportButton) {
            buttonContainer.getElementsByTagName('div')[0].style.display = 'inline-block';
          }

          if (buttonNeedsToBeAdded && correctLayer) {
            buttonContainer.appendChild(dom.html(callDotNetButton.render()));
            document.getElementById(callDotNetButton.getId()).addEventListener('click', () => modalLogic());
          }
        }
      } else if (!buttonNeedsToBeAdded) {
        document.getElementById(callDotNetButton.getId()).remove();
      }
    }
  }

  return Origo.ui.Component({
    name: 'origoexportetuna',
    onInit() {
      callDotNetButton = Origo.ui.Button({
        text: buttonText,
        cls: 'export-button',
        style: 'margin-left: 0.5rem;'
      });

      acceptTermsButton = Origo.ui.Button({
        text: 'Jag förstår',
        cls: 'light rounded border text-smaller o-tooltip margin-top',
        style: 'display: block; background-color: #ebebeb; padding: 0.4rem; margin-left: auto; margin-right: auto;'
      });

      termsText = Origo.ui.Element({
        tagName: 'p',
        innerHTML: 'Informationen du är på väg att hämta är känslig och får inte delas med utomstående.'
      });

      modalContent = Origo.ui.Element({
        components: [termsText, acceptTermsButton]
      });
    },
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
