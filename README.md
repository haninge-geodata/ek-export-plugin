# ek-export-plugin

Knapp som skickar anrop till Eskilstunas .NET projekt för fastighetsrapporter.

**Parametrar:**
- layer: Lagernamnet för fastigheter
- hostname: URL till önskad host som kör tjänsten för .NET projektet. Ta inte med backslash i slutet av URL:en.
- attribute: Det attribut för id/fnr som ska skickas med i anropet.
- buttonText: Knappens text.
- modalTitle: Titel på popup-fönster.
- modalContentText: Text som visas i popup-fönster.
- modalButtonText: Knappens text i popup-fönster.

**Exempel:**
```HTML
<script type="text/javascript">
    var origo = Origo('index.json');
    origo.on('load', function (viewer) {
      var origoexportetuna = Origoexportetuna({
        layer: "sokvyx_djupdata_djuppunkter_vy",
        hostname: "https://kartakarta.karta",
        attribute: "fnr",
        buttonText: "Hämta excel"
      });
      viewer.addComponent(origoexportetuna);
    });
</script>
```

### Knappens placering med origo-servers excelcreator
![](hamtaexcel1.gif)

### Knappens placering utan origo-servers excelcreator
![](hamtaexcel2.gif)
