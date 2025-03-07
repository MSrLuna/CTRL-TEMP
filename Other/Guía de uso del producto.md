Guía de Uso del Sistema de Monitoreo de Temperatura con Arduino

## Introducción
Este sistema utiliza un Arduino con un sensor de temperatura para monitorear la temperatura de un refrigerador. Los datos se envían a un servidor para su registro y análisis. El dispositivo también puede configurarse para conectarse a diferentes redes Wi-Fi y ajustar el intervalo de medición.

## Componentes Necesarios
- Arduino (ESP32)
- Sensor de temperatura DS18B20
- LEDs (rojo, verde, amarillo)
- Resistencia de 4.7k ohmios (para el sensor DS18B20)
- Conexión a Internet (Wi-Fi)
- Servidor para recibir los datos (configurado según las instrucciones del proyecto)

## Conexiones del Hardware
### Sensor de Temperatura DS18B20:
- Conecta el pin de datos del sensor al pin D4 del Arduino.
- Conecta el pin de alimentación (VCC) del sensor al pin de 3.3V del Arduino.
- Conecta el pin de tierra (GND) del sensor al pin GND del Arduino.
- Coloca una resistencia de 4.7k ohmios entre el pin de datos y el pin de alimentación del sensor.

### LEDs:
- Conecta el LED rojo al pin D12 del Arduino.
- Conecta el LED verde al pin D13 del Arduino.
- Conecta el LED amarillo al pin D14 del Arduino.
- Conecta las resistencias adecuadas en serie con cada LED para limitar la corriente.

## Configuración del Software
### Instalación de Librerías:
Asegúrate de tener instaladas las siguientes librerías en el IDE de Arduino:
- WiFi
- HTTPClient
- OneWire
- DallasTemperature
- ArduinoJson
- NTPClient
- WiFiUdp
- EEPROM
- DNSServer
- WebServer

### Código del Arduino:
Sube el código proporcionado en el archivo `arduino.ino` a tu Arduino.

## Funcionamiento del Sistema
### 1. Inicialización
Al encender el dispositivo, los LEDs se configuran y el sistema intenta cargar la configuración guardada desde la EEPROM. Si no hay configuración guardada o si el dispositivo no puede conectarse a la red Wi-Fi, entra en modo AP (Access Point).

### 2. Modo AP (Access Point)
El dispositivo crea una red Wi-Fi con el SSID `tempArduino001` y la contraseña `rhenania1914`. Conéctate a esta red Wi-Fi desde tu computadora o teléfono. Abre un navegador web y navega a `http://192.168.4.1` para acceder a la página de configuración.

### 3. Configuración de Wi-Fi y Parámetros
En la página de configuración, selecciona la red Wi-Fi a la que deseas conectar el dispositivo e ingresa la contraseña. Configura el intervalo de medición (en segundos, minutos o horas). Guarda la configuración. El dispositivo se reiniciará y tratará de conectarse a la red Wi-Fi configurada.

### 4. Conexión a la Red Wi-Fi
Si la conexión es exitosa, el LED verde se encenderá. Si la conexión falla, el LED rojo parpadeará.

### 5. Medición y Envío de Datos
El dispositivo mide la temperatura a intervalos regulares y envía los datos al servidor configurado. Los datos incluyen la temperatura, la fecha y hora de la medición, la dirección IP del dispositivo y el tipo de equipo (refrigerador).

### Indicadores LED
- **LED Rojo:**
  - Encendido: El dispositivo está en modo AP.
  - Parpadeando: Error al conectar a la red Wi-Fi.
- **LED Verde:**
  - Encendido: Conexión exitosa a la red Wi-Fi.
- **LED Amarillo:**
  - Encendido: No hay tarjeta microSD insertada.

## Solución de Problemas
### No puedo conectarme a la red `tempArduino001`:
- Asegúrate de que el dispositivo esté en modo AP (LED rojo encendido).
- Verifica que la contraseña sea correcta (`rhenania1914`).

### El dispositivo no se conecta a la red Wi-Fi configurada:
- Verifica que el SSID y la contraseña ingresados sean correctos.
- Asegúrate de que la red Wi-Fi esté disponible y tenga buena señal.

### No se envían datos al servidor:
- Verifica la configuración del servidor en el código del Arduino.
- Asegúrate de que el servidor esté en funcionamiento y accesible desde la red.

## Conclusión
Este sistema proporciona una solución eficiente para monitorear la temperatura de un refrigerador y enviar los datos a un servidor para su análisis. La configuración es sencilla y el dispositivo puede adaptarse a diferentes redes Wi-Fi y parámetros de medición. Una vez configurado, el dispositivo funcionará de forma automática sin necesidad de intervención adicional o del IDE de Arduino.