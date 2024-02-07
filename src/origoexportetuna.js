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

  const layerName = Object.prototype.hasOwnProperty.call(options, 'layer') ? options.layer : null;
  const hostname = Object.prototype.hasOwnProperty.call(options, 'hostname') ? options.hostname : null;
  const customEndpoint = Object.prototype.hasOwnProperty.call(options, 'customEndpoint') ? options.customEndpoint : '/search/estateExcelReport.aspx';
  const customParameters = Object.prototype.hasOwnProperty.call(options, 'customParameters') ? options.customParameters : null;
  const attribute = Object.prototype.hasOwnProperty.call(options, 'attribute') ? options.attribute : null;
  const buttonText = Object.prototype.hasOwnProperty.call(options, 'buttonText') ? options.buttonText : null;
  const modalTitle = Object.prototype.hasOwnProperty.call(options, 'modalTitle') ? options.modalTitle : 'Varning';
  const modalContentText = Object.prototype.hasOwnProperty.call(options, 'modalContentText') ? options.modalContentText : 'Informationen du är på väg att hämta är känslig och får inte delas med utomstående.';
  const modalButtonText = Object.prototype.hasOwnProperty.call(options, 'modalButtonText') ? options.modalButtonText : 'Jag förstår';

  function dotNetUrlBuilder(items) {
    let idString = '';
    items.forEach((item) => {
      idString += `${item.getFeature().get(attribute)};`;
    });
    return `${hostname}${customEndpoint}?${customParameters ? `${customParameters}${idString}` : `searchstring=&estateLayer=${layerName}&functionParam=excel&ids=${idString}`}`;
  }

  function modalLogic() {
    if (acceptedTerms) {
      window.open(dotNetUrlBuilder(selectionManager.getSelectedItemsForASelectionGroup(layerName)), '_blank');
    } else {
      modal = Origo.ui.Modal({
        title: `${modalTitle}`,
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
    const correctLayer = selectionManager.getSelectedItemsForASelectionGroup(layerName).length > 0;
    const layerTitle = viewer.getLayer(layerName).get('title');

    if (typeof buttonContainer !== 'undefined') {
      const buttonNeedsToBeAdded = document.getElementById(callDotNetButton.getId()) === null;
      const hasOrigoExportButton = buttonContainer.getElementsByTagName('div').length === 1;
      const groupElement = document.getElementsByClassName('selectedurvalelement');

      if (groupElement && groupElement.length > 0 && !groupElement[0].classList.contains('hidden')) {
        const selectedGroupTitle = groupElement[0].textContent.slice(0, groupElement[0].textContent.lastIndexOf(' '))

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
        text: `${modalButtonText}`,
        cls: 'light rounded border text-smaller o-tooltip margin-top',
        style: 'display: block; background-color: #ebebeb; padding: 0.4rem; margin-left: auto; margin-right: auto;'
      });

      termsText = Origo.ui.Element({
        tagName: 'p',
        innerHTML: `${modalContentText}`
      });

      modalContent = Origo.ui.Element({
        components: [termsText, acceptTermsButton]
      });
    },
    onAdd(evt) {
      viewer = evt.target;
      const layerExists = viewer.getLayers().filter(layer => layer.get('name') === layerName).length > 0;

      if (layerExists && layerName && hostname && attribute && buttonText) {
        selectionManager = viewer.getSelectionManager();

        const el = document.getElementsByClassName('listcontainer')[0];
        const observer = new MutationObserver(() => {
          if (el && el.offsetParent !== null) {
            listenerFunc();
            Array.from(document.getElementsByClassName('urvalelement')).forEach((element) => {
              if (!element.getAttribute('hasListener')) {
                element.setAttribute('hasListener', true);
                element.addEventListener('click', () => listenerFunc());
              }
            });
          }
        });

        observer.observe(document.querySelector('#sidebarcontainer'), { attributes: true, childList: true, characterData: true });
      } else {
        console.log(`Kunde inte ladda plugin Origoexportetuna. ${layerExists ? 'Parametrar saknas.' : 'Lagret finns inte i vyn.'}`);
      }
    }
  });
};

export default Origoexportetuna;
