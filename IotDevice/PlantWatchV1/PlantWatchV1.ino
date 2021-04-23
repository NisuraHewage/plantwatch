#include <WiFi.h>
#include <HTTPClient.h>
#include "SparkFunHTU21D.h"
HTU21D myHumidity;

const char* ssid = "fiber";
const char* password =  "Kamal118888A";
 
const String endpoint = "https://gfvpdn2440.execute-api.us-east-1.amazonaws.com/v1/readings";

void show_yes_no(const char *prefix, int val)
{
  Serial.print(prefix);
  if (val)
    Serial.println("yes");
  else
    Serial.println("no");
}

void dump_user_register()
{
  byte reg = myHumidity.readUserRegister();

  Serial.print("Resolution (Humidity, Temperature): ");
  switch (reg & USER_REGISTER_RESOLUTION_MASK) {
  case USER_REGISTER_RESOLUTION_RH12_TEMP14: Serial.print(12); Serial.print(", "); Serial.println(14); break;
  case USER_REGISTER_RESOLUTION_RH8_TEMP12: Serial.print(8); Serial.print(", "); Serial.println(12); break;
  case USER_REGISTER_RESOLUTION_RH10_TEMP13: Serial.print(10); Serial.print(", "); Serial.println(13); break;
  case USER_REGISTER_RESOLUTION_RH11_TEMP11: Serial.print(11); Serial.print(", "); Serial.println(11); break;
  }

  show_yes_no("End of battery: ", reg & USER_REGISTER_END_OF_BATTERY);
  show_yes_no("Heater enabled: ", reg & USER_REGISTER_HEATER_ENABLED);
  show_yes_no("Disable OTP reload: ", reg & USER_REGISTER_DISABLE_OTP_RELOAD);
}

void setup() {
 
  Serial.begin(115200);
  myHumidity.begin();
  
  dump_user_register();
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
}
void loop() {

 
  if ((WiFi.status() == WL_CONNECTED)) {
    String moisture,light;
    HTTPClient http;
    float humid = myHumidity.readHumidity();
    float temp = myHumidity.readTemperature();
  
    Serial.print(" Moisture Level1: ");
    moisture=-((map(analogRead(34), 2000, 4095, 0, 100))-100);
    //Serial.println(analogRead(34));
    Serial.println(moisture);
    Serial.print(" Light level Level: ");
    light=-((map(analogRead(32), 2500, 4095, 0, 100))-100);
    //light=map(analogRead(32), 2000, 4095, 0, 100);
    Serial.println(analogRead(32));
    http.begin(endpoint); //Specify the URL
    
    http.addHeader("Content-Type", "application/json");
    String httpRequestData = "{\"userId\":\"3\",\"deviceId\": \"1\",\"moisture\": \""+moisture+"\",\"temperature\": \""+temp+"\",\"light\": \""+light+"\",\"humidity\": \""+humid+"\"}";    
    Serial.println(httpRequestData);       
      // Send HTTP POST request
//    int httpResponseCode = http.POST(httpRequestData);
// 
//   if (httpResponseCode > 0) {
// 
//        String payload = http.getString();
//        Serial.println(httpResponseCode);
//        Serial.println(payload);
//      }
//    else {
//      Serial.println("Error on HTTP request");
//    }
 
    http.end();
    
  }
  delay(5000);
}
