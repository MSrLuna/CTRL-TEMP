#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <EEPROM.h>
#include <DNSServer.h>
#include <WebServer.h>

// ----------------------------------------------
// Configuración de la base de datos y parámetros
// ----------------------------------------------
#define REFRIGERADOR_ID 1          // ID del refrigerador
#define DEVICE_UID "001"           // UID del dispositivo
#define EQUIPO "Refrigerador"      // Tipo de equipo
#define ONE_WIRE_BUS 4             // Pin utilizado para el sensor de temperatura
#define LED_ROJO 12
#define LED_VERDE 13
#define LED_AZUL 14

OneWire ourWire(ONE_WIRE_BUS);
DallasTemperature sensors(&ourWire);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 3600000);

// Variables para configuración dinámica
String WIFI_SSID_DINAMICO = "";
String WIFI_PASSWORD_DINAMICO = "";
String SERVER_BASE_URL_DINAMICO = ""; // Se configura automáticamente
unsigned long TIEMPO_MEDICION_DINAMICO = 10000; // 10 segundos por defecto

// Configuración del modo AP
const char *AP_SSID = "tempArduino001";
const char *AP_PASSWORD = "rhenania1914"; // Contraseña para el AP
DNSServer dnsServer;
WebServer server(80);

void setup() {
    Serial.begin(115200);
    delay(1000);

    // Configurar pines de LED
    pinMode(LED_ROJO, OUTPUT);
    pinMode(LED_VERDE, OUTPUT);
    pinMode(LED_AZUL, OUTPUT);#include <OneWire.h>                
#include <DallasTemperature.h>
 
OneWire ourWire(2);                //Se establece el pin 2  como bus OneWire
 
DallasTemperature sensors(&ourWire); //Se declara una variable u objeto para nuestro sensor

void setup() {
delay(1000);
Serial.begin(9600);
sensors.begin();   //Se inicia el sensor
}
 
void loop() {
sensors.requestTemperatures();   //Se envía el comando para leer la temperatura
float temp= sensors.getTempCByIndex(0); //Se obtiene la temperatura en ºC

Serial.print("Temperatura= ");
Serial.print(temp);
Serial.println(" C");
delay(100);                     
}
    digitalWrite(LED_ROJO, LOW);
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_AZUL, LOW);

    // Cargar configuración guardada
    loadConfiguration();

    // Forzar modo AP al inicio
    Serial.println("\nIniciando en modo AP...");
    digitalWrite(LED_ROJO, HIGH);
    setupAPMode();

    sensors.begin();
    timeClient.begin();
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        dnsServer.processNextRequest(); // Procesar solicitudes DNS
        server.handleClient();         // Manejar solicitudes HTTP
        return; // No hacer nada si no hay conexión Wi-Fi
    }

    // Leer temperatura
    float temp = readTemperature();
    if (temp == -127) {
        Serial.println("Error al leer el sensor de temperatura.");
        return;
    }

    // Obtener fecha y hora
    String fecha = getCurrentISO8601Timestamp();
    String ip = WiFi.localIP().toString();

    // Enviar datos al servidor
    enviarDatosAlServidor(temp, fecha, ip);

    delay(TIEMPO_MEDICION_DINAMICO);
}

// -----------------------------
// Funciones auxiliares
// -----------------------------

bool connectToWiFi() {
    WiFi.begin(WIFI_SSID_DINAMICO.c_str(), WIFI_PASSWORD_DINAMICO.c_str());
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < 20) {
        delay(1000);
        Serial.print(".");
        attempt++;
    }
    return WiFi.status() == WL_CONNECTED;
}

float readTemperature() {
    sensors.requestTemperatures();
    return sensors.getTempCByIndex(0);
}

String getCurrentISO8601Timestamp() {
    timeClient.update();
    unsigned long epochTime = timeClient.getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);
    char timestamp[30];
    snprintf(timestamp, sizeof(timestamp), "%04d-%02d-%02dT%02d:%02d:%02d.000Z",
             ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday,
             ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
    return String(timestamp);
}

void enviarDatosAlServidor(float temp, String fecha, String ip) {
    StaticJsonDocument<256> doc;
    doc["refrigeradorId"] = REFRIGERADOR_ID;
    doc["uid"] = DEVICE_UID;
    doc["fecha"] = fecha;
    doc["temperatura"] = temp;
    doc["ip"] = ip;
    doc["equipo"] = EQUIPO;

    String jsonData;
    serializeJson(doc, jsonData);
    Serial.println("Datos JSON a enviar:");
    Serial.println(jsonData);

    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.setTimeout(5000);  // Tiempo de espera ajustado
        http.begin(SERVER_BASE_URL_DINAMICO);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(jsonData);

        if (httpResponseCode > 0) {
            Serial.print("Código de respuesta HTTP: ");
            Serial.println(httpResponseCode);
            Serial.println("Respuesta del servidor:");
            Serial.println(http.getString());
        } else {
            Serial.print("Error al enviar los datos: ");
            Serial.println(httpResponseCode);
        }

        http.end();
        delay(100);  // Espera breve para liberar recursos
    } else {
        Serial.println("No hay conexión Wi-Fi. No se pueden enviar los datos.");
    }
}

void setupAPMode() {
    Serial.println("Iniciando modo AP...");
    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_SSID, AP_PASSWORD);
    Serial.println("Modo AP iniciado. Conéctate a la red: " + String(AP_SSID));

    // Configurar DNS para redirigir todas las solicitudes al servidor web
    dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
    dnsServer.start(53, "*", WiFi.softAPIP());
    Serial.println("DNS iniciado. Todas las solicitudes serán redirigidas a " + WiFi.softAPIP().toString());

    // Rutas del servidor web
    server.on("/", handleRoot);
    server.on("/save", HTTP_POST, handleSave);
    server.begin();
    Serial.println("Servidor web iniciado en http://" + WiFi.softAPIP().toString());
}

void handleRoot() {
    // Escanear redes Wi-Fi disponibles
    int n = WiFi.scanNetworks();
    String options = "";

    if (n == 0) {
        options = "<option value=''>No se encontraron redes</option>";
    } else {
        for (int i = 0; i < n; ++i) {
            String ssid = WiFi.SSID(i);
            options += "<option value='" + ssid + "'>" + ssid + "</option>";
        }
    }

    String html = "<!DOCTYPE html>"
                  "<html lang='es'>"
                  "<head>"
                  "<meta charset='UTF-8'>"
                  "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                  "<title>Configuración del Dispositivo</title>"
                  "<style>"
                  "* { margin: 0; padding: 0; box-sizing: border-box; }"
                  "body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #6e8efb, #a777e3); height: 100vh; display: flex; justify-content: center; align-items: center; }"
                  ".container { background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center; animation: fadeIn 1s ease-in-out; }"
                  "h1 { font-size: 24px; color: #333; margin-bottom: 20px; }"
                  "form { display: flex; flex-direction: column; gap: 15px; }"
                  "label { font-size: 14px; color: #555; text-align: left; }"
                  "input, select { padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px; transition: border-color 0.3s ease; }"
                  "input:focus, select:focus { border-color: #6e8efb; outline: none; }"
                  "button { background: #6e8efb; color: #fff; padding: 12px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background 0.3s ease; }"
                  "button:hover { background: #5a7de5; }"
                  ".password-toggle { position: relative; }"
                  ".password-toggle button { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #aaa; cursor: pointer; font-size: 16px; }"
                  ".password-toggle button:hover { color: #6e8efb; }"
                  "@keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }"
                  "</style>"
                  "</head>"
                  "<body>"
                  "<div class='container'>"
                  "<h1>Configuración de Wi-Fi</h1>"
                  "<form action='/save' method='POST'>"
                  "<label for='ssid'>Red Wi-Fi:</label>"
                  "<select id='ssid' name='ssid' required>"
                  + options +
                  "</select>"
                  "<label for='password'>Contraseña:</label>"
                  "<div class='password-toggle'>"
                  "<input type='password' id='password' name='password' required placeholder='Contraseña de la red Wi-Fi'>"
                  "<button type='button' onclick='togglePasswordVisibility()'>👁️</button>"
                  "</div>"
                  "<label for='interval'>Intervalo de Medición:</label>"
                  "<div style='display: flex; gap: 10px;'>"
                  "<input type='number' id='interval' name='interval' required placeholder='Ejemplo: 10'>"
                  "<select id='unit' name='unit' style='flex: 1;'>"
                  "<option value='seconds'>Segundos</option>"
                  "<option value='minutes'>Minutos</option>"
                  "<option value='hours'>Horas</option>"
                  "</select>"
                  "</div>"
                  "<button type='submit'>Guardar Configuración</button>"
                  "</form>"
                  "<script>"
                  "function togglePasswordVisibility() {"
                  "  const passwordField = document.getElementById('password');"
                  "  if (passwordField.type === 'password') {"
                  "    passwordField.type = 'text';"
                  "  } else {"
                  "    passwordField.type = 'password';"
                  "  }"
                  "}"
                  "</script>"
                  "</div>"
                  "</body>"
                  "</html>";

    // Redirección automática si el usuario accede a una URL diferente
    if (server.uri() != "/") {
        server.sendHeader("Location", "/");
        server.send(302, "text/plain", "");
        return;
    }

    server.send(200, "text/html", html);
}

void handleSave() {
    String ssid = server.arg("ssid");
    String password = server.arg("password");
    String intervalStr = server.arg("interval");
    String unit = server.arg("unit");

    if (ssid.isEmpty() || password.isEmpty() || intervalStr.isEmpty() || unit.isEmpty()) {
        server.send(400, "text/plain", "Todos los campos son obligatorios.");
        return;
    }

    unsigned long interval = intervalStr.toInt();

    // Convertir el intervalo a milisegundos según la unidad seleccionada
    if (unit == "minutes") {
        interval *= 60 * 1000; // Minutos a milisegundos
    } else if (unit == "hours") {
        interval *= 60 * 60 * 1000; // Horas a milisegundos
    } else {
        interval *= 1000; // Segundos a milisegundos
    }

    // Guardar configuración en EEPROM
    saveConfiguration(ssid, password, "", interval);

    server.send(200, "text/plain", "Configuración guardada. Reiniciando...");
    delay(1000);
    ESP.restart(); // Reiniciar el dispositivo
}

void saveConfiguration(String ssid, String password, String serverIp, unsigned long interval) {
    EEPROM.begin(512);
    EEPROM.writeString(0, ssid);
    EEPROM.writeString(32, password);
    EEPROM.writeString(64, serverIp);
    EEPROM.put(96, interval);
    EEPROM.commit();
}

void loadConfiguration() {
    EEPROM.begin(512);
    WIFI_SSID_DINAMICO = EEPROM.readString(0);
    WIFI_PASSWORD_DINAMICO = EEPROM.readString(32);
    SERVER_BASE_URL_DINAMICO = EEPROM.readString(64);
    EEPROM.get(96, TIEMPO_MEDICION_DINAMICO);

    // Si no hay una IP del servidor guardada, usar la IP local
    if (SERVER_BASE_URL_DINAMICO.isEmpty()) {
        if (WiFi.status() == WL_CONNECTED) {
            SERVER_BASE_URL_DINAMICO = "http://" + WiFi.localIP().toString();
        } else {
            SERVER_BASE_URL_DINAMICO = ""; // Dejar en blanco si no hay conexión
        }
    }
}