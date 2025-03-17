# Sistema di Rilevamento Oggetti in Tempo Reale con Webcam

## Descrizione
Questo progetto implementa un sistema di sorveglianza in tempo reale basato su webcam che utilizza l'intelligenza artificiale per rilevare e identificare oggetti in video. Il sistema utilizza TensorFlow.js e il modello COCO-SSD per eseguire il rilevamento degli oggetti direttamente nel browser.

## Funzionalità
- Rilevamento di oggetti in tempo reale dalla webcam
- Visualizzazione di riquadri di delimitazione (bounding box) attorno agli oggetti rilevati
- Etichettatura degli oggetti con nome della classe e percentuale di confidenza
- Elenco cronologico di tutti gli oggetti rilevati con timestamp

## Requisiti Tecnici
- Node.js (v12.0 o superiore)
- Webcam o fotocamera collegata al dispositivo
- TensorFlow.js (v3.0.0 o superiore)
- COCO-SSD (modello preaddestrato per il rilevamento di oggetti)

## Installazione
1. Clonare il repository:
   ```
   git clone [URL-del-repository]
   cd webcam_object_detection
   ```

2. Installare le dipendenze:
   ```
   npm install
   ```

3. Avviare il server:
   ```
   npm start
   ```

4. Aprire il browser e navigare a:
   ```
   http://localhost:3000
   ```

## Come Utilizzare
1. Una volta caricata la pagina, attendere che il modello venga caricato
2. Cliccare sul pulsante "Start" per avviare la webcam
3. Posizionare oggetti davanti alla webcam per il rilevamento
4. Gli oggetti rilevati verranno evidenziati con riquadri colorati e le relative informazioni appariranno nell'elenco sottostante
5. Cliccare sul pulsante "Stop" per interrompere il rilevamento e spegnere la webcam

## Tecnologie Utilizzate
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Intelligenza Artificiale**: TensorFlow.js, COCO-SSD
- **Streaming Video**: WebRTC (getUserMedia API)

## Struttura del Progetto
- `server.js` - Server Express principale
- `public/client.js` - Logica di rilevamento degli oggetti e gestione della webcam

## Limitazioni
- Le prestazioni dipendono dalla capacità di elaborazione del dispositivo
- Il rilevamento funziona meglio in condizioni di buona illuminazione
- Il modello COCO-SSD può rilevare solo le 80 classi di oggetti su cui è stato addestrato
- È necessario concedere le autorizzazioni di accesso alla webcam

## Sviluppi Futuri
- Aggiungere supporto per il salvataggio delle immagini con oggetti rilevati
- Implementare notifiche quando vengono rilevati oggetti specifici
- Migliorare l'interfaccia utente per dispositivi mobili
- Aggiungere opzioni per regolare la sensibilità del rilevamento

## Licenza
ISC

