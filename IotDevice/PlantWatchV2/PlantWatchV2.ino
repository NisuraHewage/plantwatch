#include <WiFi.h>
#include <HTTPClient.h>
#include "SparkFunHTU21D.h"
#include "time.h"
#include <iostream>
#include <sstream>  
HTU21D myHumidity;

using namespace std;  
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 16200;
const int   daylightOffset_sec = 3600;
String callTime[4] = {"7", "11", "23", "4"};
struct tm timeinfo2;

const String endpoint = "https://gfvpdn2440.execute-api.us-east-1.amazonaws.com/v1/readings";
bool userIdRecived = false;
String userID = "";
WiFiServer server(80);

void printLocalTime()
{
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%H:%M:%S");
}

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
   //Init WiFi as Station, start SmartConfig
  WiFi.mode(WIFI_AP_STA);
  WiFi.beginSmartConfig();

  //Wait for SmartConfig packet from mobile
  Serial.println("Waiting for SmartConfig.");
  while (!WiFi.smartConfigDone()) {
    delay(500);
    
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("SmartConfig received.");

  //Wait for WiFi to connect to AP
  Serial.println("Waiting for WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("WiFi Connected.");

//init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  server.begin();
  Serial.println("Server Up");
  Serial.println("Waiting for User ID");
  while(!userIdRecived)
    {
      WiFiClient client = server.available(); 

    if (client) { 
    Serial.println("New Client.");
    String currentLine = "";  
    while (client.connected()) {           
      if (client.available()) {           
        char c = client.read();                             
        if (c == '\n') {                    
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.print("Click <a href=\"/H\">here</a> to turn the LED on pin 5 on.<br>");
            client.print("Click <a href=\"/L\">here</a> to turn the LED on pin 5 off.<br>");
            client.println();
            break;
          } else {   
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
          
        }
        if((currentLine.indexOf("userId:") > 0) && (currentLine.endsWith("H"))){
          Serial.println(currentLine.indexOf("userId:"));
          Serial.println(currentLine);
          userID=currentLine.substring(currentLine.indexOf("userId:")+7,currentLine.indexOf("userId:")+13);
          Serial.println("UserID: "+userID);
          userIdRecived=true;
        }
      }
    }
    client.stop();
    Serial.println("Client Disconnected.");
    
  }
    }
  
  myHumidity.begin();
  
  dump_user_register();
//  WiFi.begin(ssid, password);
 
 
}
void loop() {

 
  if ((WiFi.status() == WL_CONNECTED)) {

    
    if (userIdRecived){

    Serial.println(&timeinfo2);
  int second,minute,hour;
  stringstream ss,mm,hh;  
  string s,m,h;  

  second = timeinfo2.tm_sec;
  ss << second;  
  ss >> s;  
  
  minute = timeinfo2.tm_min   ; 
  mm << minute;    
  mm >> m;

  hour = timeinfo2.tm_hour   ; 
  hh << hour;    
  hh >> h;

  
  //printf(s.c_str());
  Serial.println(s.c_str());
  Serial.println(m.c_str());
  Serial.println(h.c_str());
  if(!getLocalTime(&timeinfo2)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo2, "%H:%M:%S");
  
 
    
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
    String httpRequestData = "{\"userId\":\""+userID+"\",\"deviceId\": \"1\",\"moisture\": \""+moisture+"\",\"temperature\": \""+temp+"\",\"light\": \""+light+"\",\"humidity\": \""+humid+"\"}";    
    Serial.println(httpRequestData);  
     if (std::find(std::begin(callTime), std::end(callTime), h.c_str()) != std::end(callTime))
  {
    Serial.println("Hour correct");
    if((s.compare("22") == 1) && (m.compare("22") == 1))
    {
            // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);
 
   if (httpResponseCode > 0) {
 
        String payload = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(payload);
      }
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end();
    }
  } 

  }
  delay(5000);
  }
}
